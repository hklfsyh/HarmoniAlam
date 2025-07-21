const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerVolunteer = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Semua field harus diisi" });
    }
    try {
        const existingVolunteer = await prisma.volunteer.findUnique({ where: { email } });
        if (existingVolunteer) {
            return res.status(409).json({ message: "Email volunteer sudah terdaftar" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVolunteer = await prisma.$transaction(async (tx) => {
            const volunteer = await tx.volunteer.create({ data: { firstName, lastName, email, password: hashedPassword } });
            await tx.author.create({ data: { volunteer_id: volunteer.volunteer_id } });
            return volunteer;
        });
        const { password: _, ...volunteerWithoutPassword } = newVolunteer;
        res.status(201).json({ message: "Registrasi volunteer berhasil", volunteer: volunteerWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const loginVolunteer = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi" });
    }
    try {
        const volunteer = await prisma.volunteer.findUnique({ where: { email } });
        if (!volunteer) return res.status(404).json({ message: "Email atau password salah" });

        const isPasswordValid = await bcrypt.compare(password, volunteer.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Email atau password salah" });

        const token = jwt.sign({ volunteerId: volunteer.volunteer_id, type: 'volunteer' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: "Login berhasil", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = { registerVolunteer, loginVolunteer };