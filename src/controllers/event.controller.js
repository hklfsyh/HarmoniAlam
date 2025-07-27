const prisma = require('../config/prisma');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');
const { sendDeletionNotificationEmail } = require('../utils/mailer');

// POST /api/events - Membuat event baru
const createEvent = async (req, res) => {
    try {
        const { title, category_id, maxParticipants, eventDate, eventTime, location, description, requiredItems, providedItems } = req.body;
        const file = req.file;
        const organizerId = req.user.organizerId;

        // VALIDASI DIPERBARUI
        if (!title || !category_id || !maxParticipants || !eventDate || !eventTime || !location || !description || !requiredItems || !providedItems || !file) {
            return res.status(400).json({ message: "Semua field (termasuk requiredItems, providedItems) dan gambar wajib diisi." });
        }

        // --- VALIDASI TANGGAL ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputEventDate = new Date(eventDate);
        if (isNaN(inputEventDate.getTime())) {
            return res.status(400).json({ message: "Format tanggal event tidak valid." });
        }
        if (inputEventDate <= today) {
            return res.status(400).json({ message: "Tanggal event harus minimal satu hari setelah hari ini." });
        }
        // --- AKHIR VALIDASI ---

        const folderPath = `events/${title.replace(/\s+/g, '_')}/`;
        const imageUrl = await uploadToGCS(file, folderPath);

        const newEvent = await prisma.event.create({
            data: {
                title,
                maxParticipants: parseInt(maxParticipants),
                eventDate: inputEventDate,
                eventTime: new Date(`1970-01-01T${eventTime}Z`),
                location, description, requiredItems, providedItems,
                imagePath: imageUrl,
                organizer_id: organizerId,
                category_id: parseInt(category_id),
            }
        });
        res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
        console.error(`Error in createEvent: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getPublicEvents = async (req, res) => {
    try {
        // --- BLOK UPDATE STATUS OTOMATIS ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.event.updateMany({
            where: {
                status: 'upcoming',
                eventDate: { lt: today }
            },
            data: { status: 'completed' }
        });

        const { category, search, month } = req.query; 
        
        const whereClause = {
            organizer: { status: 'approved' },
            deletedAt: null
        };

        // Filter event yang akan datang (upcoming) secara default
        whereClause.status = 'upcoming';

        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (search) {
            whereClause.title = { contains: search, mode: 'insensitive' };
        }
        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);
            whereClause.eventDate = {
                gte: startDate,
                lte: endDate,
            };
        } else {
            whereClause.eventDate = { gte: new Date() };
        }
        
        const events = await prisma.event.findMany({
            where: whereClause,
            orderBy: { eventDate: 'asc' },
            select: {
                event_id: true,
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

        const formattedEvents = events.map(event => ({
            event_id: event.event_id,
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
        console.error(`Error in getPublicEvents: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// GET /api/my-events - Melihat event milik ORGANIZER yang login
const getMyEvents = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;
        const { search, category, month } = req.query; // Ambil parameter dari URL

        const whereClause = {
            organizer_id: organizerId, // Filter dasar: hanya event milik organizer ini
            deletedAt: null
        };

        if (search) {
            whereClause.title = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);
            whereClause.eventDate = { gte: startDate, lte: endDate };
        }

        const events = await prisma.event.findMany({
            where: whereClause,
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
    } catch (error) {
        console.error("Error getting my events:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

/**
 * GET /api/events/all - Melihat semua event untuk ADMIN
 * Mendukung filter berdasarkan judul (search), kategori, dan bulan.
 */
const getAllEventsForAdmin = async (req, res) => {
    try {
        const { search, category, month, status } = req.query; // Ambil parameter dari URL

        const whereClause = { deletedAt: null }; // Mulai dengan objek kosong dan filter soft delete

        if (search) {
            whereClause.title = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            whereClause.category_id = parseInt(category);
        }
        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);
            whereClause.eventDate = { gte: startDate, lte: endDate };
        }
        // Jika ada parameter status, tambahkan filter status
        if (status) {
            whereClause.status = status;
        }

        const events = await prisma.event.findMany({
            where: whereClause,
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
                organizer: {
                    select: {
                        orgName: true
                    }
                }
            }
        });

        const formattedEvents = events.map(event => ({
            ...event,
            organizerName: event.organizer.orgName,
            organizer: undefined,
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

        // VALIDASI BARU UNTUK UPDATE
        if (!requiredItems || !providedItems) {
            return res.status(400).json({ message: "RequiredItems dan providedItems wajib diisi saat mengubah event." });
        }

        if (eventDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputEventDate = new Date(eventDate);
            if (isNaN(inputEventDate.getTime())) {
                return res.status(400).json({ message: "Format tanggal event tidak valid." });
            }
            if (inputEventDate <= today) {
                return res.status(400).json({ message: "Tanggal event harus minimal satu hari setelah hari ini." });
            }
        }

        const existingEvent = await prisma.event.findUnique({ where: { event_id: parseInt(id) } });
        if (!existingEvent) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (file) {
            if (existingEvent.imagePath) {
                await deleteFromGCS(existingEvent.imagePath);
            }
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
        console.error(`Error in updateEvent: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// DELETE /api/events/:id - Menghapus event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const loggedInUser = req.user; // Info pengguna dari token (via verifyAuthenticated)

        // 1. Cari event dan data organizernya
        const eventToDelete = await prisma.event.findUnique({
            where: { event_id: parseInt(id) },
            include: {
                organizer: {
                    select: { email: true, orgName: true }
                }
            }
        });

        if (!eventToDelete) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        // 2. Logika berdasarkan peran pengguna
        if (loggedInUser.isAdmin) {
            // Jika yang menghapus adalah ADMIN
            if (!reason) {
                return res.status(400).json({ message: "Alasan penghapusan wajib diisi oleh admin." });
            }
            // Kirim notifikasi email ke organizer
            if (eventToDelete.organizer.email) {
                await sendDeletionNotificationEmail(eventToDelete.organizer.email, eventToDelete.title, 'event', reason);
            }
        }
        // Jika yang menghapus adalah PEMILIK, tidak perlu 'reason' dan tidak ada notifikasi.
        // Middleware verifyEventOwner sudah memastikan hanya pemilik atau admin yang bisa sampai di sini.

        // 3. Lakukan Soft Delete untuk kedua kasus
        await prisma.event.update({
            where: { event_id: parseInt(id) },
            data: {
                deletedAt: new Date()
            }
        });

        res.status(200).json({ message: "Event berhasil dihapus." });
    } catch (error) {
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
        // Jalankan "Lazy Update" untuk memastikan status event akurat
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.event.updateMany({
            where: {
                status: 'upcoming',
                eventDate: {
                    lt: today
                }
            },
            data: {
                status: 'completed'
            }
        });

        // Ambil data event
        const { id } = req.params;
        const event = await prisma.event.findFirst({
            where: { event_id: parseInt(id), deletedAt: null },
            include: {
                category: true, // Ambil seluruh objek kategori
                organizer: {
                    select: {
                        orgName: true
                    }
                }
            }
        });

        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        // --- FORMAT ULANG RESPONSE ---
        // Buat properti baru 'organizerName' dari objek nested
        const formattedEvent = {
            ...event,
            organizerName: event.organizer.orgName
        };
        // Hapus objek dan field yang redundant agar response lebih bersih
        delete formattedEvent.organizer;
        delete formattedEvent.category_id; // <-- Menghapus category_id dari level atas

        res.status(200).json(formattedEvent);
        
    } catch (error) {
        console.error(`Error in getEventById: ${error.message}`);
        console.error(error);
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

const getEventStats = async (req, res) => {
    try {
        const organizerId = req.user.organizerId;

        // Cek jika organizerId ada dari token
        if (!organizerId) {
            return res.status(403).json({ message: "Token tidak valid untuk seorang organizer." });
        }

        const author = await prisma.author.findUnique({
            where: { organizer_id: organizerId },
            select: { author_id: true }
        });
        if (!author) {
            return res.status(404).json({ message: "Profil penulis untuk organizer ini tidak ditemukan." });
        }

        const [
            eventCountsByStatus,
            eventsPerCategory
        ] = await Promise.all([
            prisma.event.groupBy({
                by: ['status'],
                where: { organizer_id: organizerId, deletedAt: null },
                _count: { event_id: true },
                _sum: { currentParticipants: true },
            }),

            prisma.event.groupBy({
                by: ['category_id'],
                where: { organizer_id: organizerId, deletedAt: null },
                _count: { event_id: true },
            }),
        ]);

        let totalCompletedEvents = 0;
        let totalUpcomingEvents = 0;
        let totalParticipants = 0;
        eventCountsByStatus.forEach(group => {
            if (group.status === 'completed') totalCompletedEvents = group._count.event_id;
            if (group.status === 'upcoming') totalUpcomingEvents = group._count.event_id;
            totalParticipants += group._sum.currentParticipants || 0;
        });
        const totalEvents = totalCompletedEvents + totalUpcomingEvents;

        const categoryIds = eventsPerCategory.map(item => item.category_id);
        let eventsPerCategoryFormatted = [];
        if (categoryIds.length > 0) {
            const categories = await prisma.category.findMany({
                where: { category_id: { in: categoryIds } },
                select: { category_id: true, categoryName: true }
            });
            const categoryMap = Object.fromEntries(categories.map(cat => [cat.category_id, cat.categoryName]));
            eventsPerCategoryFormatted = eventsPerCategory.map(item => ({
                categoryName: categoryMap[item.category_id] || "Unknown Category",
                count: item._count.event_id
            }));
        }
        
        const articleCount = await prisma.article.count({
            where: { author_id: author.author_id }
        });

        const response = {
            totalCompletedEvents,
            totalUpcomingEvents,
            totalParticipants,
            averageParticipantsPerEvent: totalEvents > 0 ? parseFloat((totalParticipants / totalEvents).toFixed(1)) : 0,
            totalArticles: articleCount,
            eventsPerCategory: eventsPerCategoryFormatted,
        };

        res.status(200).json(response);

    } catch (error) {
        // --- BLOK INI YANG DIPERBARUI ---
        console.error(`Error in getEventStats: ${error.message}`);
        console.error(error); // Ini akan menampilkan detail error lengkap (stack trace)
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getMyRegisteredEvents = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;

        // Update status event yang sudah lewat menjadi 'completed'
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.event.updateMany({
            where: {
                status: 'upcoming',
                eventDate: { lt: today }
            },
            data: { status: 'completed' }
        });

        // Ambil event yang diikuti volunteer
        const registrations = await prisma.eventRegistration.findMany({
            where: { volunteer_id: volunteerId },
            include: {
                event: {
                    select: {
                        event_id: true,
                        title: true,
                        eventDate: true,
                        status: true,
                        organizer: {
                            select: {
                                orgName: true
                            }
                        },
                        deletedAt: true
                    }
                }
            }
        });

        // Filter event yang belum dihapus (deletedAt: null)
        const filteredRegistrations = registrations.filter(registration => registration.event && registration.event.deletedAt === null);

        // Format response
        const formattedEvents = filteredRegistrations.map(registration => ({
            event_id: registration.event.event_id,
            title: registration.event.title,
            organizerName: registration.event.organizer.orgName,
            eventDate: registration.event.eventDate,
            status: registration.event.status
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error(`Error in getMyRegisteredEvents: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getLatestEvents = async (req, res) => {
    try {
        // Jalankan "Lazy Update" untuk memastikan status event akurat
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.event.updateMany({
            where: {
                status: 'upcoming',
                eventDate: { lt: today }
            },
            data: { status: 'completed' }
        });

        const latestEvents = await prisma.event.findMany({
            where: {
                // Hanya ambil event yang akan datang dari organizer yang aktif
                status: 'upcoming',
                organizer: { status: 'approved' },
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc' // Urutkan berdasarkan tanggal dibuat
            },
            take: 3, // Ambil hanya 3
            select: {
                event_id: true,
                title: true,
                imagePath: true,
                eventDate: true,
                // Diubah untuk mengambil seluruh objek kategori
                category: {
                    select: {
                        category_id: true,
                        categoryName: true,
                        categoryType: true
                    }
                }
            }
        });

        // Format response agar lebih ringkas
        const formattedEvents = latestEvents.map(event => ({
            event_id: event.event_id,
            title: event.title,
            image: event.imagePath,
            eventDate: event.eventDate,
            category: event.category // Diubah menjadi objek lengkap
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error(`Error in getLatestEvents: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { 
    createEvent, 
    getPublicEvents, 
    getMyEvents, 
    getAllEventsForAdmin, 
    updateEvent, 
    deleteEvent, 
    getEventVolunteers, 
    getEventById, 
    registerForEvent, 
    cancelRegistration, 
    getEventStats,
    getMyRegisteredEvents,
    getLatestEvents
};