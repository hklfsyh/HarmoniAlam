// src/controllers/contact.controller.js
const prisma = require('../config/prisma');
const { sendContactAdminEmail } = require('../utils/mailer');

const submitContactForm = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const user = req.user; // Dari middleware verifyAuthenticated

        if (!subject || !message) {
            return res.status(400).json({ message: "Subjek dan pesan wajib diisi." });
        }

        let senderName = "Pengguna Tidak Dikenal";
        let senderEmail = "";
        let senderRole = "Pengguna";

        // Cari detail pengguna berdasarkan tipe token untuk melengkapi informasi
        if (user.type === 'volunteer' && user.volunteerId) {
            const volunteer = await prisma.volunteer.findUnique({
                where: { volunteer_id: user.volunteerId },
                select: { firstName: true, lastName: true, email: true }
            });
            if (volunteer) {
                senderName = `${volunteer.firstName} ${volunteer.lastName}`;
                senderEmail = volunteer.email;
                senderRole = "Volunteer";
            }
        } else if (user.type === 'organizer' && user.organizerId) {
            const organizer = await prisma.organizer.findUnique({
                where: { organizer_id: user.organizerId },
                select: { orgName: true, email: true }
            });
            if (organizer) {
                senderName = organizer.orgName;
                senderEmail = organizer.email;
                senderRole = "Organizer";
            }
        }

        if (!senderEmail) {
            return res.status(404).json({ message: "Data pengguna tidak ditemukan." });
        }

        // Kirim email ke admin
        await sendContactAdminEmail(senderName, senderEmail, senderRole, subject, message);

        res.status(200).json({ message: "Pesan Anda telah berhasil dikirim ke admin." });

    } catch (error) {
        console.error(`Error in submitContactForm: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { submitContactForm };
