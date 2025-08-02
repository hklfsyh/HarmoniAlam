// src/controllers/communication.controller.js
const prisma = require('../config/prisma');
const { sendEmailFromOrganizer } = require('../utils/mailer');

/**
 * POST: Organizer mengirim email ke volunteer yang terdaftar di eventnya.
 * Bisa mengirim ke satu atau semua volunteer.
 */
const emailVolunteers = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const organizerId = req.user.organizerId;
        const { subject, message, volunteerId } = req.body; // volunteerId bersifat opsional

        if (!subject || !message) {
            return res.status(400).json({ message: "Subjek dan pesan wajib diisi." });
        }

        // Ambil detail event dan nama organizer
        const event = await prisma.event.findUnique({
            where: { event_id: eventId },
            include: { organizer: { select: { orgName: true } } }
        });

        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        let recipients = [];

        if (volunteerId) {
            // --- Kirim ke SATU volunteer ---
            const registration = await prisma.eventRegistration.findFirst({
                where: { event_id: eventId, volunteer_id: parseInt(volunteerId) },
                include: { volunteer: { select: { email: true } } }
            });
            if (registration && registration.volunteer) {
                recipients.push(registration.volunteer.email);
            } else {
                return res.status(404).json({ message: "Volunteer tersebut tidak terdaftar di event ini." });
            }
        } else {
            // --- Kirim ke SEMUA volunteer ---
            const allRegistrations = await prisma.eventRegistration.findMany({
                where: { event_id: eventId },
                include: { volunteer: { select: { email: true } } }
            });
            recipients = allRegistrations.map(reg => reg.volunteer.email).filter(Boolean);
        }

        if (recipients.length === 0) {
            return res.status(404).json({ message: "Tidak ada volunteer untuk dikirimi email." });
        }

        // Kirim semua email secara paralel
        const emailPromises = recipients.map(email => 
            sendEmailFromOrganizer(email, event.organizer.orgName, event.title, subject, message)
        );
        await Promise.all(emailPromises);

        res.status(200).json({ message: `Email berhasil dikirim ke ${recipients.length} volunteer.` });

    } catch (error) {
        console.error(`Error in emailVolunteers: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { emailVolunteers };
