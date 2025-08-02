const prisma = require('../config/prisma');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');
const { sendDeletionNotificationEmail, sendNewVolunteerNotificationEmail, sendEventUpdateNotificationEmail, sendThankYouForParticipatingEmail, sendCancellationNotificationEmail } = require('../utils/mailer');

// POST /api/events - Membuat event baru
const createEvent = async (req, res) => {
    try {
        const { title, category_id, maxParticipants, eventDate, eventTime, location, latitude, longitude, description, requiredItems, providedItems } = req.body;
        const files = req.files;
        const mainImage = files?.image?.[0];
        const galleryImages = files?.gallery;
        const organizerId = req.user.organizerId;

        if (!title || !category_id || !maxParticipants || !eventDate || !eventTime || !location || !description || !requiredItems || !providedItems || !mainImage) {
            return res.status(400).json({ message: "Semua field dan gambar utama wajib diisi." });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputEventDate = new Date(eventDate);
        if (isNaN(inputEventDate.getTime()) || inputEventDate <= today) {
            return res.status(400).json({ message: "Tanggal event tidak valid atau harus minimal satu hari setelah hari ini." });
        }

        const folderPath = `events/${title.replace(/\s+/g, '_')}/`;
        const imageUrl = await uploadToGCS(mainImage, folderPath);

        const newEvent = await prisma.event.create({
            data: {
                title,
                maxParticipants: parseInt(maxParticipants),
                eventDate: inputEventDate,
                eventTime: new Date(`1970-01-01T${eventTime}Z`),
                location,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                description,
                requiredItems,
                providedItems,
                imagePath: imageUrl,
                organizer: {
                    connect: {
                        organizer_id: organizerId
                    }
                },
                category: {
                    connect: {
                        category_id: parseInt(category_id)
                    }
                }
            }
        });

        if (galleryImages && galleryImages.length > 0) {
            const galleryUploadPromises = galleryImages.map(file => uploadToGCS(file, `${folderPath}gallery/`));
            const galleryUrls = await Promise.all(galleryUploadPromises);
            
            await prisma.image.createMany({
                data: galleryUrls.map(url => ({
                    url: url,
                    eventId: newEvent.event_id
                }))
            });
        }

        res.status(201).json({ message: "Event berhasil dibuat", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category_id, maxParticipants, eventDate, eventTime, location, latitude, longitude, description, requiredItems, providedItems, deleteGalleryImageIds } = req.body;
        const files = req.files;
        const mainImage = files?.image?.[0];
        const galleryImages = files?.gallery;

        // --- KODE DEBUGGING ---
        console.log("--- Memulai updateEvent ---");
        console.log("Received body:", req.body);
        console.log("deleteGalleryImageIds (sebelum parse):", deleteGalleryImageIds);
        console.log("Tipe data deleteGalleryImageIds:", typeof deleteGalleryImageIds);
        // ----------------------

        const updateData = { 
            title, 
            category_id: category_id ? parseInt(category_id) : undefined, 
            maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined, 
            eventDate: eventDate ? new Date(eventDate) : undefined, 
            eventTime: eventTime ? new Date(`1970-01-01T${eventTime}Z`) : undefined, 
            location, 
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            description, 
            requiredItems, 
            providedItems 
        };

        const existingEvent = await prisma.event.findUnique({ where: { event_id: parseInt(id) } });
        if (!existingEvent) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (deleteGalleryImageIds && deleteGalleryImageIds.length > 0) {
            try {
                const idsToDelete = JSON.parse(deleteGalleryImageIds).map(id => parseInt(id));
                console.log("ID gambar yang akan dihapus (setelah parse):", idsToDelete);

                if (idsToDelete.length > 0) {
                    const imagesToDelete = await prisma.image.findMany({ where: { id: { in: idsToDelete } } });
                    const deletePromises = imagesToDelete.map(img => deleteFromGCS(img.url));
                    await Promise.all(deletePromises);
                    await prisma.image.deleteMany({ where: { id: { in: idsToDelete } } });
                    console.log("Gambar galeri berhasil dihapus.");
                }
            } catch (parseError) {
                console.error("Gagal mem-parsing deleteGalleryImageIds:", parseError);
            }
        }

        const folderPath = `events/${existingEvent.title.replace(/\s+/g, '_')}/`;

        if (mainImage) {
            if (existingEvent.imagePath) {
                await deleteFromGCS(existingEvent.imagePath);
            }
            updateData.imagePath = await uploadToGCS(mainImage, folderPath);
        }

        if (galleryImages && galleryImages.length > 0) {
            const galleryUploadPromises = galleryImages.map(file => uploadToGCS(file, `${folderPath}gallery/`));
            const galleryUrls = await Promise.all(galleryUploadPromises);
            
            await prisma.image.createMany({
                data: galleryUrls.map(url => ({
                    url: url,
                    eventId: existingEvent.event_id
                }))
            });
        }

        const updatedEvent = await prisma.event.update({
            where: { event_id: parseInt(id) },
            data: updateData
        });

        res.status(200).json({ message: "Event berhasil diubah", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// 3. Kode Lengkap untuk deleteEvent
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const loggedInUser = req.user;

        const eventToDelete = await prisma.event.findUnique({
            where: { event_id: parseInt(id) },
            include: { organizer: { select: { email: true, orgName: true } } }
        });
        if (!eventToDelete) return res.status(404).json({ message: "Event tidak ditemukan." });

        if (loggedInUser.isAdmin && !reason) {
            return res.status(400).json({ message: "Alasan penghapusan wajib diisi oleh admin." });
        }
        
        // --- KIRIM NOTIFIKASI PEMBATALAN ---
        const registrations = await prisma.eventRegistration.findMany({
            where: { event_id: parseInt(id) },
            include: { volunteer: { select: { email: true } } }
        });
        for (const reg of registrations) {
            if (reg.volunteer) {
                await sendEventUpdateNotificationEmail(reg.volunteer.email, eventToDelete.title, 'cancelled', reason);
            }
        }
        // -----------------------------------

        await prisma.event.update({ where: { event_id: parseInt(id) }, data: { deletedAt: new Date() } });
        
        if (loggedInUser.isAdmin) {
             await sendDeletionNotificationEmail(eventToDelete.organizer.email, eventToDelete.title, 'event', reason);
        }

        res.status(200).json({ message: "Event berhasil dihapus." });
    } catch (error) {
        console.error(`Error in deleteEvent: ${error.message}`);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getEventById = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.event.updateMany({
            where: {
                status: 'upcoming',
                eventDate: { lt: today }
            },
            data: { status: 'completed' }
        });

        const { id } = req.params;
        const event = await prisma.event.findFirst({
            where: { event_id: parseInt(id), deletedAt: null },
            include: {
                category: true,
                organizer: {
                    select: {
                        orgName: true,
                        profilePicture: true
                    }
                },
                // Ambil ID dan URL untuk setiap gambar galeri
                galleryImages: {
                    select: {
                        id: true,
                        url: true
                    }
                }
            }
        });

        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        const formattedEvent = {
            ...event,
            organizerName: event.organizer.orgName,
            organizerProfilePicture: event.organizer.profilePicture,
            gallery: event.galleryImages // <-- Sekarang ini adalah array objek {id, url}
        };
        delete formattedEvent.organizer;
        delete formattedEvent.category_id;
        delete formattedEvent.galleryImages;

        res.status(200).json(formattedEvent);
        
    } catch (error) {
        console.error(`Error in getEventById: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};


const getPublicEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // --- KIRIM EMAIL TERIMA KASIH ---
        const eventsToComplete = await prisma.event.findMany({
            where: { status: 'upcoming', eventDate: { lt: today }, deletedAt: null },
            include: {
                eventRegistrations: {
                    include: { volunteer: { select: { email: true, firstName: true } } }
                }
            }
        });

        for (const event of eventsToComplete) {
            for (const reg of event.eventRegistrations) {
                if (reg.volunteer) {
                    await sendThankYouForParticipatingEmail(reg.volunteer.email, event.title, reg.volunteer.firstName);
                }
            }
        }
        // --------------------------------

        await prisma.event.updateMany({ 
            where: { event_id: { in: eventsToComplete.map(e => e.event_id) } }, 
            data: { status: 'completed' } 
        });

        const { category, search, month } = req.query;
        const whereClause = {
            organizer: { status: 'approved' },
            status: 'upcoming',
            deletedAt: null,
        };
        if (category) whereClause.category_id = parseInt(category);
        if (search) whereClause.title = { contains: search, mode: 'insensitive' };
        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);
            whereClause.eventDate = { gte: startDate, lte: endDate };
        } else {
            whereClause.eventDate = { gte: new Date() };
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            orderBy: { eventDate: 'asc' },
            select: {
                event_id: true, title: true, description: true, eventDate: true, eventTime: true,
                currentParticipants: true, maxParticipants: true, imagePath: true,
                category: { select: { categoryName: true } }
            }
        });

        const formattedEvents = events.map(event => ({
            event_id: event.event_id, title: event.title, description: event.description,
            eventDate: event.eventDate, eventTime: event.eventTime,
            participants: `${event.currentParticipants}/${event.maxParticipants}`,
            categoryName: event.category.categoryName, image: event.imagePath
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error(`Error in getPublicEvents: ${error.message}`);
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

const registerForEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const volunteerId = req.user.volunteerId;

        const result = await prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({ where: { event_id: eventId } });
            if (!event) throw new Error("Event tidak ditemukan.");
            if (event.status !== 'upcoming') throw new Error("Pendaftaran untuk event ini sudah ditutup.");
            if (event.currentParticipants >= event.maxParticipants) throw new Error("Event sudah penuh.");

            const existingRegistration = await tx.eventRegistration.findUnique({
                where: { volunteer_id_event_id: { volunteer_id: volunteerId, event_id: eventId } }
            });
            if (existingRegistration) throw new Error("Anda sudah terdaftar di event ini.");

            const registration = await tx.eventRegistration.create({ data: { volunteer_id: volunteerId, event_id: eventId } });
            await tx.event.update({ where: { event_id: eventId }, data: { currentParticipants: { increment: 1 } } });
            return { registration, event };
        });

        // --- KIRIM NOTIFIKASI KE ORGANIZER ---
        const organizer = await prisma.organizer.findUnique({ where: { organizer_id: result.event.organizer_id } });
        const volunteer = await prisma.volunteer.findUnique({ where: { volunteer_id: volunteerId } });
        if (organizer && volunteer) {
            await sendNewVolunteerNotificationEmail(organizer.email, result.event.title, `${volunteer.firstName} ${volunteer.lastName}`);
        }
        // ------------------------------------

        res.status(201).json({ message: "Berhasil mendaftar ke event!", registration: result.registration });
    } catch (error) {
        console.error(`Error in registerForEvent: ${error.message}`);
        if (error.message.includes("Event tidak ditemukan")) return res.status(404).json({ message: error.message });
        if (error.message.includes("sudah ditutup")) return res.status(409).json({ message: error.message });
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

        // Ambil detail event dan volunteer untuk notifikasi email
        const volunteer = await prisma.volunteer.findUnique({ where: { volunteer_id: volunteerId } });
        const event = await prisma.event.findUnique({
            where: { event_id: eventId },
            include: { organizer: { select: { email: true } } }
        });

        if (!volunteer || !event) {
            return res.status(404).json({ message: "Data volunteer atau event tidak ditemukan." });
        }

        // Lakukan pembatalan dan update jumlah partisipan dalam satu transaksi
        await prisma.$transaction(async (tx) => {
            await tx.eventRegistration.delete({
                where: { volunteer_id_event_id: { volunteer_id: volunteerId, event_id: eventId } }
            });
            
            await tx.event.update({
                where: { event_id: eventId },
                data: { currentParticipants: { decrement: 1 } }
            });
        });

        // Kirim notifikasi email ke organizer
        await sendCancellationNotificationEmail(event.organizer.email, event.title, `${volunteer.firstName} ${volunteer.lastName}`);

        res.status(200).json({ message: "Pendaftaran berhasil dibatalkan." });
    } catch (error) {
        // Error P2025 berarti pendaftaran tidak ditemukan
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Anda tidak terdaftar di event ini." });
        }
        console.error(`Error in cancelRegistration: ${error.message}`);
        console.error(error);
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