const prisma = require('../config/prisma');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');
const { sendDeletionNotificationEmail } = require('../utils/mailer');

const createArticle = async (req, res) => {
    try {
        const { title, summary, content, category_id, status } = req.body;
        const files = req.files;
        const mainImage = files?.image?.[0];
        const galleryImages = files?.gallery;

        if (!title || !summary || !content || !category_id || !mainImage) {
            return res.status(400).json({ message: "Judul, ringkasan, konten, kategori, dan gambar utama wajib diisi." });
        }

        const author = await prisma.author.findFirst({
            where: { OR: [ { volunteer_id: req.user.volunteerId }, { organizer_id: req.user.organizerId }, { admin_id: req.user.adminId } ] }
        });
        if (!author) return res.status(404).json({ message: "Profil penulis tidak ditemukan." });

        const folderPath = `articles/${title.replace(/\s+/g, '_')}/`;
        const imageUrl = await uploadToGCS(mainImage, folderPath);

        const newArticle = await prisma.article.create({
            data: {
                title, summary, content,
                category_id: parseInt(category_id),
                author_id: author.author_id,
                imagePath: imageUrl,
                status: status || 'draft',
            },
        });
        
        if (galleryImages && galleryImages.length > 0) {
            const galleryUploadPromises = galleryImages.map(file => uploadToGCS(file, `${folderPath}gallery/`));
            const galleryUrls = await Promise.all(galleryUploadPromises);
            
            await prisma.image.createMany({
                data: galleryUrls.map(url => ({
                    url: url,
                    articleId: newArticle.article_id
                }))
            });
        }

        res.status(201).json({ message: "Artikel berhasil dibuat", article: newArticle });
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, category_id, status, deleteGalleryImageIds } = req.body;
        const files = req.files;
        const mainImage = files?.image?.[0];
        const galleryImages = files?.gallery;

        // --- KODE DEBUGGING ---
        console.log("--- Memulai updateArticle ---");
        console.log("Received body:", req.body);
        console.log("deleteGalleryImageIds (sebelum parse):", deleteGalleryImageIds);
        console.log("Tipe data deleteGalleryImageIds:", typeof deleteGalleryImageIds);
        // ----------------------

        const updateData = { title, summary, content, status, category_id: category_id ? parseInt(category_id) : undefined };

        const existingArticle = await prisma.article.findUnique({ where: { article_id: parseInt(id) } });
        if (!existingArticle) return res.status(404).json({ message: "Artikel tidak ditemukan." });

        if (deleteGalleryImageIds && deleteGalleryImageIds.length > 0) {
            try {
                const idsToDelete = JSON.parse(deleteGalleryImageIds).map(id => parseInt(id));
                console.log("ID gambar yang akan dihapus (setelah parse):", idsToDelete);

                if (idsToDelete.length > 0) {
                    const imagesToDelete = await prisma.image.findMany({ where: { id: { in: idsToDelete } } });
                    const deletePromises = imagesToDelete.map(img => deleteFromGCS(img.url));
                    await Promise.all(deletePromises);
                    await prisma.image.deleteMany({ where: { id: { in: idsToDelete } } });
                    console.log("Gambar galeri berhasil dihapus.");
                }
            } catch (parseError) {
                console.error("Gagal mem-parsing deleteGalleryImageIds:", parseError);
            }
        }

        const folderPath = `articles/${existingArticle.title.replace(/\s+/g, '_')}/`;

        if (mainImage) {
            if (existingArticle.imagePath) {
                await deleteFromGCS(existingArticle.imagePath);
            }
            updateData.imagePath = await uploadToGCS(mainImage, folderPath);
        }

        if (galleryImages && galleryImages.length > 0) {
            const galleryUploadPromises = galleryImages.map(file => uploadToGCS(file, `${folderPath}gallery/`));
            const galleryUrls = await Promise.all(galleryUploadPromises);
            
            await prisma.image.createMany({
                data: galleryUrls.map(url => ({
                    url: url,
                    articleId: existingArticle.article_id
                }))
            });
        }

        const updatedArticle = await prisma.article.update({
            where: { article_id: parseInt(id) },
            data: updateData
        });

        res.status(200).json({ message: "Artikel berhasil diubah", article: updatedArticle });
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await prisma.article.findUnique({
            where: { article_id: parseInt(id), deletedAt: null },
            include: {
                category: true,
                author: {
                    select: {
                        volunteer: { select: { firstName: true, lastName: true } },
                        organizer: { select: { orgName: true } },
                        admin: { select: { email: true } }
                    }
                },
                // Ambil ID dan URL untuk setiap gambar galeri
                galleryImages: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });

        if (!article) {
            return res.status(404).json({ message: "Artikel tidak ditemukan." });
        }

        let authorName = "Penulis Tidak Dikenal";
        if (article.author.volunteer) {
            authorName = `${article.author.volunteer.firstName} ${article.author.volunteer.lastName}`;
        } else if (article.author.organizer) {
            authorName = article.author.organizer.orgName;
        } else if (article.author.admin) {
            authorName = "Admin Harmoni Alam";
        }

        const formattedArticle = {
            ...article,
            authorName: authorName,
            gallery: article.galleryImages // <-- Sekarang ini adalah array objek {id, url}
        };
        delete formattedArticle.author;
        delete formattedArticle.galleryImages;

        res.status(200).json(formattedArticle);
    } catch (error) {
        console.error("Error getting article by ID:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getPublicArticles = async (req, res) => {
    try {
        const { category, search } = req.query;

        const whereClause = {
            status: 'publish',
            deletedAt: null // Hanya tampilkan artikel yang sudah publish dan belum dihapus
        };

        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (search) {
            whereClause.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        const articles = await prisma.article.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                article_id: true,
                title: true,
                summary: true,
                createdAt: true,
                imagePath: true,
                author_id: true, // <-- Ditambahkan
                category: {
                    select: {
                        category_id: true,
                        categoryName: true,
                        categoryType: true
                    }
                },
                author: {
                    select: {
                        volunteer: { select: { firstName: true, lastName: true } },
                        organizer: { select: { orgName: true } },
                        admin: { select: { email: true } }
                    }
                }
            }
        });

        // Format ulang hasil untuk membuat objek baru dengan field yang diinginkan
        const formattedArticles = articles.map(article => {
            let authorName = "Penulis Tidak Dikenal";
            if (article.author.volunteer) {
                authorName = `${article.author.volunteer.firstName} ${article.author.volunteer.lastName}`;
            } else if (article.author.organizer) {
                authorName = article.author.organizer.orgName;
            } else if (article.author.admin) {
                authorName = "Admin Harmoni Alam";
            }
            
            return {
                article_id: article.article_id,
                title: article.title,
                category: article.category,
                summary: article.summary,
                authorName: authorName,
                author_id: article.author_id, // <-- Ditambahkan
                createdAt: article.createdAt,
                image: article.imagePath
            };
        });

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error("Error getting public articles:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const loggedInUser = req.user; // Info pengguna dari token

        // 1. Cari artikel dan data penulisnya
        const articleToDelete = await prisma.article.findUnique({
            where: { article_id: parseInt(id) },
            include: {
                author: {
                    include: {
                        volunteer: { select: { email: true } },
                        organizer: { select: { email: true } },
                        admin: { select: { email: true, admin_id: true } }
                    }
                }
            }
        });

        if (!articleToDelete) {
            return res.status(404).json({ message: "Artikel tidak ditemukan." });
        }

        // 2. Logika berdasarkan peran pengguna
        if (loggedInUser.isAdmin) {
            // Jika yang menghapus adalah ADMIN
            if (!reason) {
                return res.status(400).json({ message: "Alasan penghapusan wajib diisi oleh admin." });
            }
            
            // Kirim notifikasi email ke pembuatnya (jika bukan admin sendiri)
            const authorInfo = articleToDelete.author;
            const authorEmail = authorInfo.volunteer?.email || authorInfo.organizer?.email || authorInfo.admin?.email;
            
            if (authorEmail && authorInfo.admin?.admin_id !== loggedInUser.adminId) {
                await sendDeletionNotificationEmail(authorEmail, articleToDelete.title, 'artikel', reason);
            }
        }
        // Jika yang menghapus adalah PEMILIK, tidak perlu 'reason' dan tidak ada notifikasi.
        // Middleware verifyAuthorOrAdmin sudah memastikan hanya pemilik atau admin yang bisa sampai di sini.

        // 3. Lakukan Soft Delete untuk kedua kasus
        await prisma.article.update({
            where: { article_id: parseInt(id) },
            data: {
                deletedAt: new Date()
            }
        });

        res.status(200).json({ message: "Artikel berhasil dihapus." });
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllArticles = async (req, res) => {
    try {
        const { search, category, status } = req.query; // Ambil parameter dari URL

        const whereClause = { deletedAt: null }; // Mulai dengan objek kosong dan filter soft delete

        if (search) {
            whereClause.title = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (status) {
            whereClause.status = status; // Filter berdasarkan status (draft/publish)
        }

        const articles = await prisma.article.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                author: {
                    select: {
                        volunteer: { select: { firstName: true, lastName: true } },
                        organizer: { select: { orgName: true } },
                        admin: { select: { email: true } },
                    },
                },
            },
        });

        const formattedArticles = articles.map(article => {
            let authorName = "Penulis Tidak Dikenal";
            if (article.author.volunteer) {
                authorName = `${article.author.volunteer.firstName} ${article.author.volunteer.lastName}`;
            } else if (article.author.organizer) {
                authorName = article.author.organizer.orgName;
            } else if (article.author.admin) {
                authorName = `Admin`;
            }

            return {
                article_id: article.article_id,
                title: article.title,
                createdAt: article.createdAt,
                category: article.category,
                author: authorName,
                status: article.status,
            };
        });

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error("Error getting all articles:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

/**
 * GET: Melihat artikel milik PENGGUNA YANG LOGIN
 * Mendukung filter berdasarkan judul (search), kategori, dan status.
 */
const getMyArticles = async (req, res) => {
    try {
        const { search, category, status } = req.query; // Ambil parameter dari URL

        const author = await prisma.author.findFirst({
            where: {
                OR: [
                    { volunteer_id: req.user.volunteerId },
                    { organizer_id: req.user.organizerId },
                    { admin_id: req.user.adminId },
                ],
            },
        });

        if (!author) {
            return res.status(404).json({ message: "Profil penulis tidak ditemukan." });
        }

        const whereClause = { author_id: author.author_id, deletedAt: null };

        if (search) {
            whereClause.title = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (status) {
            whereClause.status = status; // Filter berdasarkan status (draft/publish)
        }

        const [total, articles] = await Promise.all([
            prisma.article.count({ where: whereClause }),
            prisma.article.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                select: {
                    article_id: true,
                    title: true,
                    summary: true,
                    createdAt: true,
                    status: true,
                    category: {
                        select: {
                            category_id: true,
                            categoryName: true,
                            categoryType: true
                        }
                    }
                }
            })
        ]);

        const formattedArticles = articles.map(article => ({
            article_id: article.article_id,
            title: article.title,
            summary: article.summary,
            createdAt: article.createdAt,
            category: article.category,
            status: article.status
        }));

        res.status(200).json({
            total: total,
            articles: formattedArticles
        });
    } catch (error) {
        console.error("Error getting my articles:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};
/**
 * GET: Melihat detail SATU artikel (Publik)
 * Menampilkan detail lengkap sebuah artikel, termasuk statusnya.
 * Catatan: Logika untuk menyembunyikan 'draft' dari publik bisa ditambahkan di sini jika diperlukan.
 */

const getLatestArticles = async (req, res) => {
    try {
        const latestArticles = await prisma.article.findMany({
            where: {
                status: 'publish',
                deletedAt: null // Hanya ambil artikel yang sudah dipublikasikan dan belum dihapus
            },
            orderBy: {
                createdAt: 'desc' // Urutkan berdasarkan tanggal dibuat
            },
            take: 3, // Ambil hanya 3
            select: {
                article_id: true,
                title: true,
                imagePath: true,
                createdAt: true,
                summary: true, // <-- Ditambahkan
                // Diubah untuk mengambil seluruh objek kategori
                category: {
                    select: {
                        category_id: true,
                        categoryName: true,
                        categoryType: true
                    }
                }
            }
        });

        const formattedArticles = latestArticles.map(article => ({
            article_id: article.article_id,
            title: article.title,
            image: article.imagePath,
            createdAt: article.createdAt,
            summary: article.summary, 
            category: article.category 
        }));

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error(`Error in getLatestArticles: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


module.exports = {
    createArticle,
    updateArticle,
    deleteArticle,
    getAllArticles,
    getMyArticles,
    getArticleById,
    getPublicArticles,
    getLatestArticles
};