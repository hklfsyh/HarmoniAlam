const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerOrganizer = async (req, res) => {
    const { orgName, responsiblePerson, email, password, phoneNumber, website, orgAddress, orgDescription, documentPath } = req.body;
    if (!orgName || !responsiblePerson || !email || !password || !phoneNumber || !orgAddress || !orgDescription || !documentPath) {
        return res.status(400).json({ message: "Semua field wajib harus diisi" });
    }
    try {
        const existingOrganizer = await prisma.organizer.findUnique({ where: { email } });
        if (existingOrganizer) {
            return res.status(409).json({ message: "Email organizer sudah terdaftar" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOrganizer = await prisma.$transaction(async (tx) => {
            const organizer = await tx.organizer.create({
                data: { orgName, responsiblePerson, email, password: hashedPassword, phoneNumber, website, orgAddress, orgDescription, documentPath },
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

        // Validasi input status yang baru (lebih fleksibel)
        const validStatuses = ['approved', 'rejected', 'suspended', 'deactivated'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Nilai status tidak valid." });
        }

        const organizer = await prisma.organizer.update({
            where: {
                organizer_id: parseInt(id),
            },
            data: {
                status: status,
            },
        });

        // Pesan dinamis berdasarkan aksi
        let actionMessage = `statusnya diubah menjadi ${status}`;
        if (status === 'approved') actionMessage = 'berhasil disetujui';
        if (status === 'rejected') actionMessage = 'berhasil ditolak';


        res.status(200).json({
            message: `Pengajuan dari ${organizer.orgName} ${actionMessage}.`,
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Organizer tidak ditemukan." });
        }
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


module.exports = { 
    registerOrganizer, 
    loginOrganizer, 
    updateOrganizerStatus // Ganti approveOrganizer dengan fungsi baru ini
};