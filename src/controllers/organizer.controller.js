const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');
const { sendVerificationEmail, sendApprovalEmail, sendRejectionEmail, sendAdminNotificationEmail } = require('../utils/mailer');
const crypto = require('crypto');

const registerOrganizer = async (req, res) => {
    const { orgName, responsiblePerson, email, password, phoneNumber, website, orgAddress, orgDescription } = req.body;
    const file = req.file;

    if (!orgName || !responsiblePerson || !email || !password || !phoneNumber || !orgAddress || !orgDescription || !file) {
        return res.status(400).json({ message: "Semua field dan dokumen wajib diisi" });
    }

    try {
        const existingOrganizer = await prisma.organizer.findUnique({ where: { email } });
        if (existingOrganizer) {
            return res.status(409).json({ message: "Email organizer sudah terdaftar" });
        }

        const folderPath = `organizer/${orgName.replace(/\s+/g, '_')}/`;
        const documentUrl = await uploadToGCS(file, folderPath);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newOrganizer = await prisma.$transaction(async (tx) => {
            const organizer = await tx.organizer.create({
                data: {
                    orgName, responsiblePerson, email, password: hashedPassword, phoneNumber, website, orgAddress, orgDescription,
                    documentPath: documentUrl,
                    isVerified: false
                },
            });

            await tx.author.create({ 
                data: {
                    organizer: {
                        connect: {
                            organizer_id: organizer.organizer_id
                        }
                    }
                }
            });

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 3600000);
            await tx.verificationToken.create({
                data: {
                    token,
                    expiresAt,
                    organizerId: organizer.organizer_id
                }
            });

            await sendVerificationEmail(organizer.email, token);
            return organizer;
        });
        
        await sendAdminNotificationEmail(newOrganizer.orgName, newOrganizer.organizer_id, 'new');

        const { password: _, ...organizerWithoutPassword } = newOrganizer;

        res.status(201).json({ 
            message: `Registrasi berhasil. Silakan cek email di ${newOrganizer.email} untuk verifikasi.`,
            organizer: organizerWithoutPassword
        });

    } catch (error) {
        console.error(`Error in registerOrganizer: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const loginOrganizer = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi" });
    }
    try {
        const organizer = await prisma.organizer.findUnique({ where: { email } });
        if (!organizer) {
            return res.status(404).json({ message: "Email atau password salah" });
        }

        if (organizer.status === 'DELETED') {
            return res.status(403).json({ message: "Akun Anda sudah dihapus." });
        }

        if (!organizer.isVerified) {
            return res.status(403).json({ message: "Akun Anda belum diverifikasi. Silakan cek email Anda." });
        }

        const isPasswordValid = await bcrypt.compare(password, organizer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        
        if (organizer.status === 'suspended' || organizer.status === 'deactivated') {
            return res.status(403).json({ message: `Akun Anda saat ini berstatus ${organizer.status}.` });
        }

        const token = jwt.sign({ organizerId: organizer.organizer_id, type: 'organizer' }, process.env.JWT_SECRET, { expiresIn: '12h' });
        
        res.status(200).json({ 
            message: "Login berhasil", 
            token: token,
            status: organizer.status
        });

    } catch (error) {
        console.error(`Error in loginOrganizer: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const updateOrganizerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        const validStatuses = ['approved', 'rejected', 'suspended', 'deactivated'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Nilai status tidak valid." });
        }
        
        const updateData = { 
            status: status,
            rejectionReason: status === 'rejected' ? reason : null
        };

        if (status === 'approved') {
            const organizerToApprove = await prisma.organizer.findUnique({
                where: { organizer_id: parseInt(id) }
            });

            if (!organizerToApprove.isVerified) {
                return res.status(403).json({ message: "Gagal. Organizer ini belum memverifikasi emailnya." });
            }
            updateData.approvedAt = new Date();
        }

        const organizer = await prisma.organizer.update({
            where: { organizer_id: parseInt(id) },
            data: updateData,
        });

        if (status === 'approved') {
            await sendApprovalEmail(organizer.email, organizer.orgName);
        } else if (status === 'rejected') {
            await sendRejectionEmail(organizer.email, organizer.orgName, reason);
        }

        const actionMessage = status === 'approved' ? 'disetujui' : `statusnya diubah menjadi ${status}`;
        res.status(200).json({ message: `Pengajuan dari ${organizer.orgName} ${actionMessage}.` });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Organizer tidak ditemukan." });
        }
        console.error(`Error in updateOrganizerStatus: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllOrganizers = async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = { status: { not: 'DELETED' } };

        if (search) {
            whereClause.orgName = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const organizers = await prisma.organizer.findMany({
            where: whereClause,
            select: {
                organizer_id: true,
                orgName: true,
                responsiblePerson: true,
                website: true,
                email: true,
                approvedAt: true,
                _count: {
                    select: { events: true }
                }
            }
        });

        // Format ulang data agar lebih rapi
        const formattedOrganizers = organizers.map(org => ({
            organizer_id: org.organizer_id,
            orgName: org.orgName,
            responsiblePerson: org.responsiblePerson,
            website: org.website,
            email: org.email,
            approvedAt: org.approvedAt,
            totalEvents: org._count.events
        }));

        res.status(200).json(formattedOrganizers);
    } catch (error) {
        console.error("Error getting organizers:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


const getOrganizerSubmissions = async (req, res) => {
    try {
        const { search, status } = req.query; // Ambil parameter search dan status dari URL
        const whereClause = { status: { not: 'DELETED' } }; // Tambahkan filter status

        // Jika ada parameter search, tambahkan filter nama organisasi
        if (search) {
            whereClause.orgName = {
                contains: search,
                mode: 'insensitive', // Tidak peduli huruf besar/kecil
            };
        }

        // Jika ada parameter status, tambahkan filter status
        if (status) {
            whereClause.status = status;
        }

        const submissions = await prisma.organizer.findMany({
            where: whereClause, // Gunakan klausa where yang sudah dibangun
            orderBy: {
                createdAt: 'desc' // Tampilkan pengajuan terbaru di atas
            },
            select: {
                organizer_id: true,
                responsiblePerson: true,
                orgName: true,
                phoneNumber: true,
                createdAt: true, // Ini adalah tanggal pengajuan
                isVerified: true,
                status: true,
            }
        });
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error getting organizer submissions:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// Melihat detail satu organizer (Admin)
const getOrganizerById = async (req, res) => {
    const { id } = req.params;
    const organizerId = parseInt(id);

    try {
        // Menjalankan query untuk profil dan semua event secara paralel
        const [
            organizer, 
            participantSum, 
            allEvents
        ] = await Promise.all([
            // 1. Ambil data dasar organizer + total event yang dibuat
            prisma.organizer.findFirst({
                where: { organizer_id: organizerId, status: { not: 'DELETED' } },
                select: {
                    organizer_id: true,
                    orgName: true,
                    responsiblePerson: true,
                    email: true,
                    phoneNumber: true,
                    website: true,
                    orgAddress: true,
                    orgDescription: true,
                    documentPath: true,
                    profilePicture: true,
                    status: true,
                    createdAt: true,
                    approvedAt: true,
                    _count: {
                        select: { events: true }
                    }
                }
            }),
            // 2. Jumlahkan semua partisipan dari semua event milik organizer ini
            prisma.event.aggregate({
                where: { organizer_id: organizerId },
                _sum: {
                    currentParticipants: true
                }
            }),
            // 3. Ambil SEMUA event milik organizer ini dalam satu query
            prisma.event.findMany({
                where: { organizer_id: organizerId },
                select: { event_id: true, title: true, eventDate: true, currentParticipants: true, maxParticipants: true, status: true }
            })
        ]);

        if (!organizer) {
            return res.status(404).json({ message: "Organizer tidak ditemukan." });
        }

        // 4. Pisahkan event menjadi 'upcoming' dan 'completed' di sini
        const upcomingEvents = allEvents.filter(event => event.status === 'upcoming');
        const completedEvents = allEvents.filter(event => event.status === 'completed');

        // 5. Susun ulang data untuk response yang rapi
        const response = {
            profile: {
                organizer_id: organizer.organizer_id,
                orgName: organizer.orgName,
                responsiblePerson: organizer.responsiblePerson,
                email: organizer.email,
                phoneNumber: organizer.phoneNumber,
                website: organizer.website,
                orgAddress: organizer.orgAddress,
                orgDescription: organizer.orgDescription,
                documentPath: organizer.documentPath,
                profilePicture: organizer.profilePicture,
                status: organizer.status,
                createdAt: organizer.createdAt,
                approvedAt: organizer.approvedAt,
            },
            stats: {
                totalEventsCreated: organizer._count.events,
                totalAllParticipants: participantSum._sum.currentParticipants || 0,
            },
            upcomingEvents: upcomingEvents,
            completedEvents: completedEvents,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting organizer by ID:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


//get organizer profile yg login
const getMyProfile = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;
        const profile = await prisma.organizer.findUnique({
            where: { organizer_id: organizerId },
            select: {
                organizer_id: true,       // <-- Ditambahkan
                orgName: true,
                responsiblePerson: true,
                email: true,
                phoneNumber: true,
                website: true,
                orgAddress: true,
                orgDescription: true,
                profilePicture: true,
                documentPath: true,
                status: true,       // <-- Ditambahkan
                approvedAt: true          // <-- Ditambahkan
            }
        });
        if (!profile) return res.status(404).json({ message: "Profil tidak ditemukan." });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


// PATCH /api/organizer/profile
const updateMyProfile = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;
        const { orgName, responsiblePerson, password, phoneNumber, website, orgAddress, orgDescription } = req.body;
        const files = req.files;
        const updateData = { orgName, responsiblePerson, phoneNumber, website, orgAddress, orgDescription };

        const existingProfile = await prisma.organizer.findUnique({ where: { organizer_id: organizerId } });
        if (!existingProfile) return res.status(404).json({ message: "Profil tidak ditemukan." });

        let isResubmission = false;
        if (existingProfile.status === 'rejected') {
            updateData.status = 'pending';
            updateData.rejectionReason = null;
            isResubmission = true;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (files && files.image) {
            const imageFile = files.image[0];
            if (existingProfile.profilePicture) {
                await deleteFromGCS(existingProfile.profilePicture);
            }
            const folderPath = `organizer/${existingProfile.orgName.replace(/\s+/g, '_')}/`;
            updateData.profilePicture = await uploadToGCS(imageFile, folderPath);
        }

        if (files && files.document) {
            const documentFile = files.document[0];
            if (existingProfile.documentPath) {
                await deleteFromGCS(existingProfile.documentPath);
            }
            const folderPath = `organizer/${existingProfile.orgName.replace(/\s+/g, '_')}/`;
            updateData.documentPath = await uploadToGCS(documentFile, folderPath);
        }

        const updatedProfile = await prisma.organizer.update({
            where: { organizer_id: organizerId },
            data: updateData,
            select: { orgName: true, responsiblePerson: true, email: true, profilePicture: true, documentPath: true, status: true }
        });

        if (isResubmission) {
            await sendAdminNotificationEmail(updatedProfile.orgName, organizerId, 'resubmission');
        }

        res.status(200).json({ message: "Profil berhasil diubah", profile: updatedProfile });
    } catch (error) {
        console.error(`Error in updateMyProfile (Organizer): ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getOrganizerStats = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;

        // Cari author_id yang terhubung dengan organizer ini
        const author = await prisma.author.findUnique({
            where: { organizer_id: organizerId },
            select: { author_id: true }
        });
        if (!author) {
            return res.status(404).json({ message: "Profil penulis untuk organizer ini tidak ditemukan." });
        }

        // Jalankan semua query agregasi secara bersamaan
        const [
            eventStats,
            participantSum,
            articleCount
        ] = await Promise.all([
            // Hitung total, upcoming, dan completed event
            prisma.event.groupBy({
                by: ['status'],
                where: { organizer_id: organizerId },
                _count: {
                    status: true,
                },
            }),
            // Jumlahkan semua partisipan
            prisma.event.aggregate({
                where: { organizer_id: organizerId },
                _sum: {
                    currentParticipants: true,
                },
            }),
            // Hitung total artikel
            prisma.article.count({
                where: { author_id: author.author_id }
            })
        ]);

        // Proses hasil dari groupBy untuk memudahkan
        let upcomingCount = 0;
        let completedCount = 0;
        eventStats.forEach(stat => {
            if (stat.status === 'upcoming') upcomingCount = stat._count.status;
            if (stat.status === 'completed') completedCount = stat._count.status;
        });
        const totalEvents = upcomingCount + completedCount;

        res.status(200).json({
            totalEvents: totalEvents,
            totalParticipants: participantSum._sum.currentParticipants || 0,
            totalUpcomingEvents: upcomingCount,
            totalCompletedEvents: completedCount,
            totalArticles: articleCount,
        });
    } catch (error) {
        console.error("Error getting organizer stats:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getPublicOrganizerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const organizerId = parseInt(id);

        const organizer = await prisma.organizer.findFirst({
            where: {
                organizer_id: organizerId,
                status: 'approved', // Hanya tampilkan organizer yang sudah disetujui
                // Anda juga bisa menambahkan filter soft delete di sini jika sudah diimplementasikan
            },
            select: {
                organizer_id: true, // <-- Ditambahkan
                orgName: true,
                orgDescription: true,
                profilePicture: true,
                website: true,
                // Ambil juga daftar event yang akan datang milik organizer ini
                events: {
                    where: {
                        status: 'upcoming',
                        deletedAt: null // Pastikan event tidak dihapus
                    },
                    orderBy: {
                        eventDate: 'asc'
                    },
                    select: {
                        event_id: true,
                        title: true,
                        eventDate: true,
                        imagePath: true,
                        location: true,
                        currentParticipants: true,
                        maxParticipants: true
                    }
                }
            }
        });

        if (!organizer) {
            return res.status(404).json({ message: "Profil organizer tidak ditemukan atau belum aktif." });
        }

        res.status(200).json(organizer);
    } catch (error) {
        console.error("Error getting public organizer profile:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};



module.exports = { 
    registerOrganizer, 
    loginOrganizer, 
    updateOrganizerStatus,
    getAllOrganizers,
    getOrganizerById,
    getMyProfile,
    updateMyProfile,
    getOrganizerSubmissions,
    getOrganizerStats,
    getPublicOrganizerProfile
};