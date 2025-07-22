const prisma = require('../config/prisma');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');

const createArticle = async (req, res) => {
    try {
        const { title, summary, content, category_id } = req.body;
        const file = req.file;

        if (!title || !summary || !content || !category_id || !file) {
            return res.status(400).json({ message: "Semua field dan gambar wajib diisi." });
        }

        const author = await prisma.author.findFirst({
            where: { OR: [ { volunteer_id: req.user.volunteerId }, { organizer_id: req.user.organizerId }, { admin_id: req.user.adminId } ] }
        });
        if (!author) return res.status(404).json({ message: "Profil penulis tidak ditemukan." });

        // Buat path folder dinamis: articles/Judul_Artikel/
        const folderPath = `articles/${title.replace(/\s+/g, '_')}/`;
        const imageUrl = await uploadToGCS(file, folderPath);

        const newArticle = await prisma.article.create({
            data: {
                title, summary, content,
                category_id: parseInt(category_id),
                author_id: author.author_id,
                imagePath: imageUrl,
            },
        });

        res.status(201).json({ message: "Artikel berhasil dibuat", article: newArticle });
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, category_id } = req.body;
        const file = req.file;
        let imageUrl;

        const existingArticle = await prisma.article.findUnique({ where: { article_id: parseInt(id) } });
        if (!existingArticle) return res.status(404).json({ message: "Artikel tidak ditemukan." });

        if (file) {
            if (existingArticle.imagePath) {
                await deleteFromGCS(existingArticle.imagePath);
            }
            // Gunakan judul artikel yang ada untuk path folder
            const folderPath = `articles/${existingArticle.title.replace(/\s+/g, '_')}/`;
            imageUrl = await uploadToGCS(file, folderPath);
        }

        const updatedArticle = await prisma.article.update({
            where: { article_id: parseInt(id) },
            data: {
                title, summary, content,
                category_id: category_id ? parseInt(category_id) : undefined,
                imagePath: imageUrl,
            }
        });

        res.status(200).json({ message: "Artikel berhasil diubah", article: updatedArticle });
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Cari artikel untuk mendapatkan URL gambar
        const articleToDelete = await prisma.article.findUnique({
            where: { article_id: parseInt(id) }
        });

        // Hapus gambar dari GCS jika ada
        if (articleToDelete && articleToDelete.imagePath) {
            await deleteFromGCS(articleToDelete.imagePath);
        }

        // Hapus artikel dari database
        await prisma.article.delete({
            where: { article_id: parseInt(id) }
        });

        res.status(200).json({ message: "Artikel berhasil dihapus." });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Artikel tidak ditemukan." });
        }
        console.error("Error deleting article:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllArticles = async (req, res) => {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            // Pilih hanya data yang dibutuhkan
            select: {
                title: true,
                createdAt: true,
                category: {
                    select: {
                        categoryName: true,
                    },
                },
                author: {
                    select: {
                        volunteer: { select: { firstName: true, lastName: true } },
                        organizer: { select: { orgName: true } },
                        admin: { select: { email: true } },
                    },
                },
            },
        });

        // Format ulang data agar lebih rapi dan flat
        const formattedArticles = articles.map(article => {
            let authorName = "Penulis Tidak Dikenal";
            if (article.author.volunteer) {
                authorName = `${article.author.volunteer.firstName} ${article.author.volunteer.lastName}`;
            } else if (article.author.organizer) {
                authorName = article.author.organizer.orgName;
            } else if (article.author.admin) {
                authorName = `Admin (${article.author.admin.email})`;
            }

            return {
                title: article.title,
                createdAt: article.createdAt,
                category: article.category.categoryName,
                author: authorName,
            };
        });

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error("Error getting all articles:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET: Melihat artikel milik PENGGUNA YANG LOGIN
const getMyArticles = async (req, res) => {
    try {
        // Cari author_id dari user yang sedang login
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

        const whereClause = { author_id: author.author_id };

        // Hitung total artikel dan ambil daftarnya secara bersamaan
        const [total, articles] = await Promise.all([
            prisma.article.count({ where: whereClause }),
            prisma.article.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                include: { category: true }
            })
        ]);

        res.status(200).json({
            total: total,
            articles: articles
        });
    } catch (error) {
        console.error("Error getting my articles:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET: Melihat detail SATU artikel (Publik)
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await prisma.article.findUnique({
            where: { article_id: parseInt(id) },
            include: {
                author: {
                    include: {
                        volunteer: { select: { firstName: true, lastName: true } },
                        organizer: { select: { orgName: true } },
                        admin: { select: { email: true } } // Misalnya, tampilkan email untuk admin
                    }
                },
                category: true,
            }
        });

        if (!article) {
            return res.status(404).json({ message: "Artikel tidak ditemukan." });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error("Error getting article by ID:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getPublicArticles = async (req, res) => {
    try {
        const articles = await prisma.article.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                title: true,
                summary: true,
                createdAt: true,
                imagePath: true,
                category: {
                    select: {
                        categoryName: true
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

        // Format the response to include authorName and flatten categoryName
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
                title: article.title,
                summary: article.summary,
                authorName,
                createdAt: article.createdAt,
                categoryName: article.category.categoryName,
                image: article.imagePath
            };
        });

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error("Error getting public articles:", error);
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
    getPublicArticles
};