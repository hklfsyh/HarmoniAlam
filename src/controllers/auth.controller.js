const prisma = require('../config/prisma');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');


const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Token tidak ditemukan.');

    try {
        const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });

        if (!verificationToken || new Date() > verificationToken.expiresAt) {
            return res.status(400).send('Token tidak valid atau sudah kedaluwarsa.');
        }

        // Update user terkait (Volunteer atau Organizer)
        if (verificationToken.volunteerId) {
            await prisma.volunteer.update({ where: { volunteer_id: verificationToken.volunteerId }, data: { isVerified: true } });
        } else if (verificationToken.organizerId) {
            await prisma.organizer.update({ where: { organizer_id: verificationToken.organizerId }, data: { isVerified: true } });
        }

        // Hapus token setelah digunakan
        await prisma.verificationToken.delete({ where: { token } });

        res.send('Verifikasi email berhasil! Anda sekarang bisa login.');
    } catch (error) {
        res.status(500).send('Terjadi kesalahan pada server.');
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email wajib diisi." });

    try {
        let user = null;
        let userType = null;
        let userIdField = null;

        const volunteer = await prisma.volunteer.findUnique({ where: { email } });
        if (volunteer) {
            user = volunteer;
            userType = 'volunteer';
            userIdField = 'volunteer_id';
        } else {
            const organizer = await prisma.organizer.findUnique({ where: { email } });
            if (organizer) {
                user = organizer;
                userType = 'organizer';
                userIdField = 'organizer_id';
            }
        }

        if (!user) {
            return res.status(200).json({ message: "Jika email Anda terdaftar, kami telah mengirimkan link reset password." });
        }

        // Hapus token lama jika ada
        await prisma.passwordResetToken.deleteMany({
            where: { OR: [{ volunteerId: user[userIdField] }, { organizerId: user[userIdField] }] }
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 600000); // 10 menit

        const tokenData = { token, expiresAt };
        if (userType === 'volunteer') {
            tokenData.volunteerId = user.volunteer_id;
        } else {
            tokenData.organizerId = user.organizer_id;
        }

        await prisma.passwordResetToken.create({ data: tokenData });
        await sendPasswordResetEmail(user.email, token);

        res.status(200).json({ message: "Jika email Anda terdaftar, kami telah mengirimkan link reset password." });
    } catch (error) {
        console.error(`Error in forgotPassword: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token dan password baru wajib diisi." });
    }

    try {
        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

        if (!resetToken || new Date() > resetToken.expiresAt) {
            return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (resetToken.volunteerId) {
            await prisma.volunteer.update({
                where: { volunteer_id: resetToken.volunteerId },
                data: { password: hashedPassword }
            });
        } else if (resetToken.organizerId) {
            await prisma.organizer.update({
                where: { organizer_id: resetToken.organizerId },
                data: { password: hashedPassword }
            });
        }

        await prisma.passwordResetToken.delete({ where: { token } });

        res.status(200).json({ message: "Password berhasil diubah. Silakan login dengan password baru Anda." });
    } catch (error) {
        console.error(`Error in resetPassword: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { verifyEmail, forgotPassword, resetPassword };