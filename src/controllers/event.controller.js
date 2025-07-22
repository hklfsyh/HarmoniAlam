const prisma = require('../config/prisma');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');

// POST /api/events - Membuat event baru
const createEvent = async (req, res) => {
    try {
        const { title, category_id, maxParticipants, eventDate, eventTime, location, description, requiredItems, providedItems } = req.body;
        const file = req.file;
        const organizerId = req.user.organizerId;

        if (!title || !category_id || !maxParticipants || !eventDate || !eventTime || !location || !description || !file) {
            return res.status(400).json({ message: "Semua field dan gambar wajib diisi." });
        }

        // Buat path folder dinamis: events/Nama_Event/
        const folderPath = `events/${title.replace(/\s+/g, '_')}/`;
        const imageUrl = await uploadToGCS(file, folderPath);

        const newEvent = await prisma.event.create({
            data: {
                title,
                maxParticipants: parseInt(maxParticipants),
                eventDate: new Date(eventDate),
                eventTime: new Date(`1970-01-01T${eventTime}Z`),
                location, description, requiredItems, providedItems,
                imagePath: imageUrl,
                organizer_id: organizerId,
                category_id: parseInt(category_id),
            }
        });
        res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getPublicEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                eventDate: {
                    gte: new Date(),
                },
                organizer: {
                    status: 'approved'
                }
            },
            orderBy: { eventDate: 'asc' },
            select: {
                title: true,
                description: true,
                eventDate: true,
                eventTime: true,
                currentParticipants: true,
                maxParticipants: true,
                imagePath: true,
                category: {
                    select: {
                        categoryName: true
                    }
                }
            }
        });

        // Format the response to flatten categoryName and combine participants
        const formattedEvents = events.map(event => ({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            participants: `${event.currentParticipants}/${event.maxParticipants}`,
            categoryName: event.category.categoryName,
            image: event.imagePath
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error("Error getting public events:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET /api/my-events - Melihat event milik ORGANIZER yang login
const getMyEvents = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;
        const events = await prisma.event.findMany({
            where: { organizer_id: organizerId },
            orderBy: { eventDate: 'asc' },
            select: {
                event_id: true,
                title: true,
                eventDate: true,
                eventTime: true,
                location: true,
                currentParticipants: true,
                maxParticipants: true,
                status: true,
            }
        });
        res.status(200).json(events);
    } catch (error)
    {
        console.error("Error getting my events:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET /api/events/all - Melihat semua event untuk ADMIN
const getAllEventsForAdmin = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { eventDate: 'desc' },
            select: {
                event_id: true,
                title: true,
                eventDate: true,
                eventTime: true,
                location: true,
                currentParticipants: true,
                maxParticipants: true,
                status: true,
                organizer: { // Sertakan nama organizer untuk admin
                    select: {
                        orgName: true
                    }
                }
            }
        });

        // Format ulang agar nama organizer tidak nested
        const formattedEvents = events.map(event => ({
            ...event,
            organizerName: event.organizer.orgName,
            organizer: undefined, // Hapus objek organizer yang nested
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error("Error getting all events for admin:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};
// PATCH /api/events/:id - Mengubah detail event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category_id, maxParticipants, eventDate, eventTime, location, description, requiredItems, providedItems } = req.body;
        const file = req.file;
        let imageUrl;

        const existingEvent = await prisma.event.findUnique({ where: { event_id: parseInt(id) } });
        if (!existingEvent) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (file) {
            if (existingEvent.imagePath) {
                await deleteFromGCS(existingEvent.imagePath);
            }
            // Gunakan judul event yang ada untuk path folder
            const folderPath = `events/${existingEvent.title.replace(/\s+/g, '_')}/`;
            imageUrl = await uploadToGCS(file, folderPath);
        }

        const updatedEvent = await prisma.event.update({
            where: { event_id: parseInt(id) },
            data: {
                title,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
                eventDate: eventDate ? new Date(eventDate) : undefined,
                eventTime: eventTime ? new Date(`1970-01-01T${eventTime}Z`) : undefined,
                location, description, requiredItems, providedItems,
                category_id: category_id ? parseInt(category_id) : undefined,
                imagePath: imageUrl,
            }
        });

        res.status(200).json({ message: "Event berhasil diubah", event: updatedEvent });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: "Event tidak ditemukan." });
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};
// DELETE /api/events/:id - Menghapus event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const eventToDelete = await prisma.event.findUnique({
            where: { event_id: parseInt(id) }
        });

        if (!eventToDelete) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        if (eventToDelete.imagePath) {
            await deleteFromGCS(eventToDelete.imagePath);
        }

        await prisma.event.delete({
            where: { event_id: parseInt(id) }
        });

        res.status(200).json({ message: "Event berhasil dihapus." });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET /api/events/:id/volunteers - Melihat pendaftar
const getEventVolunteers = async (req, res) => {
    try {
        const { id } = req.params;
        const registrations = await prisma.eventRegistration.findMany({
            where: { event_id: parseInt(id) },
            include: {
                volunteer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET /api/events/:id - Melihat detail event (Publik)
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { event_id: parseInt(id) },
            include: {
                category: true,
                organizer: {
                    select: {
                        orgName: true
                    }
                }
            }
        });
        if (!event) return res.status(404).json({ message: "Event tidak ditemukan." });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const volunteerId = req.user.volunteerId;

        // Gunakan transaksi untuk memastikan data konsisten
        const result = await prisma.$transaction(async (tx) => {
            // 1. Cek event dan pastikan slot masih ada
            const event = await tx.event.findUnique({
                where: { event_id: eventId },
            });
            if (!event) throw new Error("Event tidak ditemukan.");
            if (event.currentParticipants >= event.maxParticipants) {
                throw new Error("Event sudah penuh.");
            }

            // 2. Cek apakah volunteer sudah terdaftar
            const existingRegistration = await tx.eventRegistration.findUnique({
                where: { volunteer_id_event_id: { volunteer_id: volunteerId, event_id: eventId } }
            });
            if (existingRegistration) throw new Error("Anda sudah terdaftar di event ini.");

            // 3. Daftarkan volunteer dan update jumlah partisipan
            const registration = await tx.eventRegistration.create({
                data: {
                    volunteer_id: volunteerId,
                    event_id: eventId,
                }
            });

            await tx.event.update({
                where: { event_id: eventId },
                data: { currentParticipants: { increment: 1 } }
            });

            return registration;
        });

        res.status(201).json({ message: "Berhasil mendaftar ke event!", registration: result });
    } catch (error) {
        console.error("Error registering for event:", error);
        // Kirim pesan error yang spesifik jika ada
        if (error.message.includes("Event tidak ditemukan")) return res.status(404).json({ message: error.message });
        if (error.message.includes("Event sudah penuh")) return res.status(409).json({ message: error.message });
        if (error.message.includes("Anda sudah terdaftar")) return res.status(409).json({ message: error.message });
        
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// DELETE /api/events/:id/register - Volunteer membatalkan pendaftaran
const cancelRegistration = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const volunteerId = req.user.volunteerId;

        await prisma.$transaction(async (tx) => {
            // 1. Hapus data pendaftaran
            const deletedRegistration = await tx.eventRegistration.delete({
                where: { volunteer_id_event_id: { volunteer_id: volunteerId, event_id: eventId } }
            });
            
            // 2. Kurangi jumlah partisipan di event
            await tx.event.update({
                where: { event_id: eventId },
                data: { currentParticipants: { decrement: 1 } }
            });
        });

        res.status(200).json({ message: "Pendaftaran berhasil dibatalkan." });
    } catch (error) {
        // Error jika pendaftaran tidak ditemukan
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Anda tidak terdaftar di event ini." });
        }
        console.error("Error canceling registration:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


module.exports = { createEvent, getPublicEvents,getMyEvents, getAllEventsForAdmin, updateEvent, deleteEvent, getEventVolunteers, getEventById, registerForEvent, cancelRegistration };