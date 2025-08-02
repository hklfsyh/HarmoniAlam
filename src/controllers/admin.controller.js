const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendDirectEmailFromAdmin, sendAccountDeletionEmail, sendBroadcastEmail } = require('../utils/mailer');

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
        // Menghitung semua data secara bersamaan untuk efisiensi
        const [
            articleCount, 
            volunteerCount, 
            organizerCount, 
            pendingOrganizerCount,
            eventCount
        ] = await Promise.all([
            // Hitung artikel yang tidak dihapus
            prisma.article.count({ 
                where: { deletedAt: null } 
            }),
            
            // Hitung volunteer yang tidak dihapus
            prisma.volunteer.count({ 
                where: { status: { not: 'DELETED' } } 
            }),
            
            // Hitung organizer yang tidak dihapus
            prisma.organizer.count({ 
                where: { status: { not: 'DELETED' } } 
            }),
            
            // Hitung organizer yang statusnya pending (ini sudah benar)
            prisma.organizer.count({ 
                where: { status: 'pending' } 
            }),
            
            // Hitung event yang tidak dihapus
            prisma.event.count({ 
                where: { deletedAt: null } 
            })
        ]);

        res.status(200).json({
            totalArticles: articleCount,
            totalVolunteers: volunteerCount,
            totalOrganizers: organizerCount,
            pendingOrganizers: pendingOrganizerCount,
            totalEvents: eventCount,
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

const sendBroadcast = async (req, res) => {
    try {
        const { userType, subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: "Subjek dan pesan wajib diisi." });
        }

        let recipientEmails = [];

        // Logika untuk mengambil email berdasarkan userType
        if (userType === 'volunteer') {
            const volunteers = await prisma.volunteer.findMany({
                where: { status: 'ACTIVE', isVerified: true },
                select: { email: true }
            });
            recipientEmails = volunteers.map(v => v.email);

        } else if (userType === 'organizer') {
            const organizers = await prisma.organizer.findMany({
                where: { status: 'approved', isVerified: true },
                select: { email: true }
            });
            recipientEmails = organizers.map(o => o.email);

        } else { 
            // Jika userType tidak ada, 'all', atau nilai lain, kirim ke semua
            const [volunteers, organizers] = await Promise.all([
                prisma.volunteer.findMany({
                    where: { status: 'ACTIVE', isVerified: true },
                    select: { email: true }
                }),
                prisma.organizer.findMany({
                    where: { status: 'approved', isVerified: true },
                    select: { email: true }
                })
            ]);
            const volunteerEmails = volunteers.map(v => v.email);
            const organizerEmails = organizers.map(o => o.email);
            // Gabungkan dan hapus duplikat jika ada
            recipientEmails = [...new Set([...volunteerEmails, ...organizerEmails])];
        }

        if (recipientEmails.length === 0) {
            return res.status(404).json({ message: `Tidak ada pengguna aktif untuk dikirimi email.` });
        }

        await sendBroadcastEmail(recipientEmails, subject, message);

        res.status(200).json({ message: `Email broadcast berhasil dikirim ke ${recipientEmails.length} penerima.` });

    } catch (error) {
        console.error(`Error in sendBroadcast: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { registerAdmin, loginAdmin, getDashboardStats, sendEmailToUser, deleteUserAccount, sendBroadcast };