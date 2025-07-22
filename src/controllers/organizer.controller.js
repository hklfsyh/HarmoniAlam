const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');

const registerOrganizer = async (req, res) => {
    // Ambil file dari request
    const { orgName, responsiblePerson, email, password, phoneNumber, website, orgAddress, orgDescription } = req.body;
    const file = req.file; // Ini adalah file dokumen

    if (!orgName || !responsiblePerson || !email || !password || !phoneNumber || !orgAddress || !orgDescription || !file) {
        return res.status(400).json({ message: "Semua field dan dokumen wajib diisi" });
    }

    try {
        const existingOrganizer = await prisma.organizer.findUnique({ where: { email } });
        if (existingOrganizer) {
            return res.status(409).json({ message: "Email organizer sudah terdaftar" });
        }

        // Buat path folder dinamis (mengganti spasi dengan _)
        const folderPath = `organizer/${orgName.replace(/\s+/g, '_')}/`;
        const documentUrl = await uploadToGCS(file, folderPath);

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newOrganizer = await prisma.$transaction(async (tx) => {
            const organizer = await tx.organizer.create({
                data: {
                    orgName, responsiblePerson, email, password: hashedPassword, phoneNumber, website, orgAddress, orgDescription,
                    documentPath: documentUrl, // Gunakan URL dari GCS
                },
            });
            await tx.author.create({ data: { organizer_id: organizer.organizer_id } });
            return organizer;
        });

        const { password: _, ...organizerWithoutPassword } = newOrganizer;
        res.status(201).json({ message: "Registrasi organizer berhasil. Akun Anda sedang ditinjau oleh admin.", organizer: organizerWithoutPassword });

    } catch (error) {
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
        if (!organizer) return res.status(404).json({ message: "Email atau password salah" });

        if (organizer.status !== 'approved') {
            return res.status(403).json({ message: "Akun Anda belum disetujui oleh admin." });
        }
        const isPasswordValid = await bcrypt.compare(password, organizer.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Email atau password salah" });

        const token = jwt.sign({ organizerId: organizer.organizer_id, type: 'organizer' }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.status(200).json({ message: "Login berhasil", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// FUNGSI BARU: Untuk menyetujui atau menolak pengajuan
const updateOrganizerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['approved', 'rejected', 'suspended', 'deactivated'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Nilai status tidak valid." });
        }
        
        const updateData = {
            status: status,
        };

        // Jika statusnya 'approved', catat tanggalnya
        if (status === 'approved') {
            updateData.approvedAt = new Date();
        }

        const organizer = await prisma.organizer.update({
            where: { organizer_id: parseInt(id) },
            data: updateData,
        });

        const actionMessage = status === 'approved' ? 'disetujui' : `statusnya diubah menjadi ${status}`;
        res.status(200).json({ message: `Pengajuan dari ${organizer.orgName} ${actionMessage}.` });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Organizer tidak ditemukan." });
        }
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllOrganizers = async (req, res) => {
    try {
        const organizers = await prisma.organizer.findMany({
            select: {
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

// Melihat detail satu organizer (Admin)
const getOrganizerById = async (req, res) => {
    const { id } = req.params;
    const organizerId = parseInt(id);

    try {
        // Menjalankan semua query secara paralel untuk efisiensi
        const [
            organizer, 
            participantSum, 
            upcomingEvents, 
            completedEvents
        ] = await Promise.all([
            // 1. Ambil data dasar organizer + total event yang dibuat
            prisma.organizer.findUnique({
                where: { organizer_id: organizerId },
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
            // 3. Ambil daftar event yang akan datang (upcoming)
            prisma.event.findMany({
                where: { organizer_id: organizerId, status: 'upcoming' },
                select: { event_id: true, title: true, eventDate: true, currentParticipants: true, maxParticipants: true }
            }),
            // 4. Ambil daftar event yang sudah selesai (completed)
            prisma.event.findMany({
                where: { organizer_id: organizerId, status: 'completed' },
                select: { event_id: true, title: true, eventDate: true, currentParticipants: true, maxParticipants: true }
            })
        ]);

        if (!organizer) {
            return res.status(404).json({ message: "Organizer tidak ditemukan." });
        }

        // Susun ulang data untuk response yang rapi
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
                orgName: true,
                responsiblePerson: true,
                email: true,
                phoneNumber: true,
                website: true,
                orgAddress: true,
                orgDescription: true,
                profilePicture: true,
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
        // req.file sekarang menjadi req.files
        const files = req.files;
        const updateData = { orgName, responsiblePerson, phoneNumber, website, orgAddress, orgDescription };

        const existingProfile = await prisma.organizer.findUnique({ where: { organizer_id: organizerId } });
        if (!existingProfile) return res.status(404).json({ message: "Profil tidak ditemukan." });

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Cek jika ada file gambar profil baru
        if (files && files.image) {
            const imageFile = files.image[0];
            if (existingProfile.profilePicture) {
                await deleteFromGCS(existingProfile.profilePicture);
            }
            const folderPath = `organizer/${existingProfile.orgName.replace(/\s+/g, '_')}/`;
            updateData.profilePicture = await uploadToGCS(imageFile, folderPath);
        }

        // Cek jika ada file dokumen baru
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
            select: { orgName: true, responsiblePerson: true, email: true, profilePicture: true, documentPath: true }
        });

        res.status(200).json({ message: "Profil berhasil diubah", profile: updatedProfile });
    } catch (error) {
        console.error(error);
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
    updateMyProfile // Ganti approveOrganizer dengan fungsi baru ini
};