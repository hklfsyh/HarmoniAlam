const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendDirectEmailFromAdmin, sendAccountDeletionEmail } = require('../utils/mailer');

const registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi" });
    }
    try {
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(409).json({ message: "Email admin sudah terdaftar" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await prisma.$transaction(async (tx) => {
            const admin = await tx.admin.create({ data: { email, password: hashedPassword } });
            await tx.author.create({ data: { admin_id: admin.admin_id } });
            return admin;
        });
        const { password: _, ...adminWithoutPassword } = newAdmin;
        res.status(201).json({ message: "Admin berhasil dibuat", admin: adminWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi" });
    }
    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return res.status(404).json({ message: "Email atau password salah" });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Email atau password salah" });

        const token = jwt.sign({ adminId: admin.admin_id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: "Login admin berhasil", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [
            articleCount, 
            volunteerCount, 
            organizerCount, 
            pendingOrganizerCount,
            eventCount // <-- Variabel baru
        ] = await Promise.all([
            prisma.article.count(),
            prisma.volunteer.count(),
            prisma.organizer.count(),
            prisma.organizer.count({ where: { status: 'pending' } }),
            prisma.event.count() // <-- Query baru untuk menghitung event
        ]);

        res.status(200).json({
            totalArticles: articleCount,
            totalVolunteers: volunteerCount,
            totalOrganizers: organizerCount,
            pendingOrganizers: pendingOrganizerCount,
            totalEvents: eventCount, // <-- Data baru di response
        });
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const sendEmailToUser = async (req, res) => {
    try {
        const { userId, userType, subject, message } = req.body;

        if (!userId || !userType || !subject || !message) {
            return res.status(400).json({ message: "userId, userType, subject, dan message wajib diisi." });
        }

        let userEmail;
        if (userType === 'volunteer') {
            const volunteer = await prisma.volunteer.findUnique({ where: { volunteer_id: parseInt(userId) } });
            if (!volunteer) return res.status(404).json({ message: "Volunteer tidak ditemukan." });
            userEmail = volunteer.email;
        } else if (userType === 'organizer') {
            const organizer = await prisma.organizer.findUnique({ where: { organizer_id: parseInt(userId) } });
            if (!organizer) return res.status(404).json({ message: "Organizer tidak ditemukan." });
            userEmail = organizer.email;
        } else {
            return res.status(400).json({ message: "userType tidak valid. Gunakan 'volunteer' atau 'organizer'." });
        }

        await sendDirectEmailFromAdmin(userEmail, subject, message);

        res.status(200).json({ message: `Email berhasil dikirim ke ${userEmail}.` });

    } catch (error) {
        console.error(`Error in sendEmailToUser: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const deleteUserAccount = async (req, res) => {
    try {
        const { userType, id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: "Alasan penghapusan wajib diisi." });
        }

        if (userType === 'volunteer') {
            const volunteer = await prisma.volunteer.findUnique({ where: { volunteer_id: parseInt(id) } });
            if (!volunteer) return res.status(404).json({ message: "Volunteer tidak ditemukan." });

            await prisma.volunteer.update({
                where: { volunteer_id: parseInt(id) },
                data: { status: 'DELETED' }
            });
            await sendAccountDeletionEmail(volunteer.email, `${volunteer.firstName} ${volunteer.lastName}`, reason);
            res.status(200).json({ message: `Akun volunteer ${volunteer.firstName} berhasil dihapus.` });

        } else if (userType === 'organizer') {
            const organizer = await prisma.organizer.findUnique({ where: { organizer_id: parseInt(id) } });
            if (!organizer) return res.status(404).json({ message: "Organizer tidak ditemukan." });

            await prisma.organizer.update({
                where: { organizer_id: parseInt(id) },
                data: { status: 'DELETED' }
            });
            await sendAccountDeletionEmail(organizer.email, organizer.orgName, reason);
            res.status(200).json({ message: `Akun organizer ${organizer.orgName} berhasil dihapus.` });

        } else {
            return res.status(400).json({ message: "Tipe pengguna tidak valid. Gunakan 'volunteer' atau 'organizer'." });
        }

    } catch (error) {
        console.error(`Error in deleteUserAccount: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { registerAdmin, loginAdmin, getDashboardStats, sendEmailToUser, deleteUserAccount };