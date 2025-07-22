const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        const [articleCount, volunteerCount, organizerCount, pendingOrganizerCount] = await Promise.all([
            prisma.article.count(),
            prisma.volunteer.count(),
            prisma.organizer.count(),
            prisma.organizer.count({ where: { status: 'pending' } })
        ]);

        res.status(200).json({
            totalArticles: articleCount,
            totalVolunteers: volunteerCount,
            totalOrganizers: organizerCount,
            pendingOrganizers: pendingOrganizerCount, // <-- Data baru
        });
    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { registerAdmin, loginAdmin, getDashboardStats };