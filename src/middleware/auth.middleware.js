const jwt = require('jsonwebtoken');
require('dotenv').config();
const prisma = require('../config/prisma');

const verifyToken = (req, res, next, requiredType) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid." });
        }

        // Cek jika tipe token sesuai dengan yang dibutuhkan
        if (decoded.type !== requiredType && !decoded.isAdmin) {
             return res.status(403).json({ message: `Akses ditolak. Hanya untuk ${requiredType}.` });
        }
        
        // Khusus untuk Admin
        if (requiredType === 'admin' && !decoded.isAdmin) {
            return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
        }

        req.user = decoded; // Menyimpan data user (apapun tipenya) di request
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    // Memanggil fungsi verifyToken dengan tipe 'admin'
    // Dan melakukan pengecekan khusus isAdmin
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "Token tidak ditemukan." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token tidak valid." });
        if (!decoded.isAdmin) return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
        
        req.user = decoded;
        next();
    });
};

const verifyOrganizer = (req, res, next) => {
    // 1. Ambil dan verifikasi token (Otentikasi)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid." });
        }
        
        // 2. Cek apakah tipe token adalah 'organizer'
        if (decoded.type !== 'organizer' || !decoded.organizerId) {
            return res.status(403).json({ message: "Akses ditolak. Token ini bukan milik organizer." });
        }
        
        try {
            // 3. Cek status di database (Otorisasi)
            const organizer = await prisma.organizer.findUnique({
                where: { organizer_id: decoded.organizerId }
            });

            if (!organizer || organizer.status !== 'approved') {
                return res.status(403).json({ message: "Akses ditolak. Hanya untuk organizer yang aktif." });
            }
            
            // Jika semua berhasil, simpan info user dan lanjutkan
            req.user = decoded;
            next();

        } catch (error) {
            return res.status(500).json({ message: "Kesalahan saat memverifikasi status organizer." });
        }
    });
};

const verifyOrganizerProfileAccess = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid." });
        }
        
        if (decoded.type !== 'organizer' || !decoded.organizerId) {
            return res.status(403).json({ message: "Akses ditolak. Token ini bukan milik organizer." });
        }
        
        try {
            const organizer = await prisma.organizer.findUnique({
                where: { organizer_id: decoded.organizerId }
            });

            if (!organizer) {
                return res.status(404).json({ message: "Organizer tidak ditemukan." });
            }

            // Izinkan akses jika statusnya adalah salah satu dari berikut ini
            const allowedStatuses = ['pending', 'rejected', 'approved'];
            if (!allowedStatuses.includes(organizer.status)) {
                return res.status(403).json({ message: `Akses ditolak. Akun Anda saat ini berstatus '${organizer.status}'.` });
            }
            
            req.user = decoded;
            next();

        } catch (error) {
            return res.status(500).json({ message: "Kesalahan saat memverifikasi status organizer." });
        }
    });
};

const verifyVolunteer = (req, res, next) => {
    verifyToken(req, res, next, 'volunteer');
};

const verifyAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('--- [verifyAuthenticated] MIDDLEWARE STARTED ---');
    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token ? 'Token exists' : 'No token');
    console.log('JWT_SECRET exists:', process.env.JWT_SECRET ? 'Yes' : 'No');

    if (token == null) {
        console.log('No token provided');
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT verification failed:', err.message);
            console.log('Error details:', err);
            return res.status(403).json({ message: "Token tidak valid." });
        }
        
        console.log('JWT decoded successfully:', decoded);
        
        // Simpan decoded payload ke request agar bisa diakses di controller
        req.user = decoded;
        next();
    });
};

const verifyAuthorOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params; // ID Artikel
        const user = req.user; // Dari middleware verifyAuthenticated

        console.log('--- [verifyAuthorOrAdmin] MIDDLEWARE STARTED ---');
        console.log('Request headers authorization:', req.headers.authorization);
        console.log('User from req.user:', user);
        console.log('Article ID from params:', id);
        console.log('Request method:', req.method);
        console.log('Request path:', req.path);

        // Cek apakah req.user ada
        if (!user) {
            console.log('ERROR: req.user is undefined - middleware verifyAuthenticated might not have run');
            return res.status(401).json({ message: "User tidak terautentikasi." });
        }

        // 1. Cek jika user adalah Admin
        if (user.isAdmin) {
            console.log('User is admin, access granted.');
            return next(); // Admin boleh melakukan apa saja
        }

        // 2. Cari artikel untuk mendapatkan author_id-nya
        const article = await prisma.article.findUnique({
            where: { article_id: parseInt(id) },
            select: { author_id: true }
        });
        console.log('Article found:', article);

        if (!article) {
            console.log('Article not found.');
            return res.status(404).json({ message: "Artikel tidak ditemukan." });
        }

        // 3. Cari author_id milik user yang sedang login
        const author = await prisma.author.findFirst({
            where: {
                OR: [
                    { volunteer_id: user.volunteerId },
                    { organizer_id: user.organizerId },
                ],
            }
        });
        console.log('Author found for user:', author);
        console.log('User volunteerId:', user.volunteerId);
        console.log('User organizerId:', user.organizerId);

        // 4. Bandingkan author_id
        if (author && author.author_id === article.author_id) {
            console.log('User is the owner of the article, access granted.');
            return next(); // User adalah pemilik artikel, izinkan
        }

        // Jika bukan keduanya, tolak akses
        console.log('Access denied: user is not the owner of the article.');
        console.log('Expected author_id:', article.author_id);
        console.log('User author_id:', author ? author.author_id : 'No author found');
        return res.status(403).json({ message: "Akses ditolak. Anda bukan pemilik artikel ini." });

    } catch (error) {
        console.error('Error in verifyAuthorOrAdmin:', error);
        return res.status(500).json({ message: "Kesalahan otorisasi." });
    }
};

const verifyOrganizerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (user.isAdmin) {
            return next();
        }

        if (user.type !== 'organizer' || !user.organizerId) {
            return res.status(403).json({ message: "Akses ditolak. Hanya untuk organizer atau admin." });
        }

        const event = await prisma.event.findUnique({
            where: { event_id: parseInt(id) },
            select: { organizer_id: true }
        });

        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        const organizer = await prisma.organizer.findUnique({
            where: { organizer_id: user.organizerId },
            select: { status: true }
        });

        if (!organizer || organizer.status !== 'approved') {
            return res.status(403).json({ message: "Akses ditolak. Hanya untuk organizer yang aktif." });
        }

        if (event.organizer_id === user.organizerId) {
            return next();
        }

        return res.status(403).json({ message: "Akses ditolak. Anda bukan pemilik event ini." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Kesalahan otorisasi." });
    }
};

const verifyEventOwner = async (req, res, next) => {
    try {
        const { id } = req.params; // ID Event
        const user = req.user;     // Didapat dari middleware verifyAuthenticated

        // Jika user adalah Admin, langsung izinkan
        if (user.isAdmin) {
            return next();
        }

        // Jika bukan admin, pastikan dia adalah organizer
        if (!user.organizerId) {
            return res.status(403).json({ message: "Akses ditolak. Anda bukan seorang organizer." });
        }

        // Cari event di database
        const event = await prisma.event.findUnique({
            where: { event_id: parseInt(id) },
            select: { organizer_id: true }
        });

        if (!event) {
            return res.status(404).json({ message: "Event tidak ditemukan." });
        }

        // Bandingkan ID pemilik event dengan ID organizer yang login
        if (event.organizer_id === user.organizerId) {
            return next(); // Izin diberikan
        }

        // Jika bukan keduanya, tolak
        return res.status(403).json({ message: "Akses ditolak. Anda bukan pemilik event ini." });
    } catch (error) {
        console.error("Authorization error in verifyEventOwner:", error);
        return res.status(500).json({ message: "Kesalahan otorisasi." });
    }
};

const verifyImageOwner = async (req, res, next) => {
    try {
        const imageId = parseInt(req.params.id);
        const user = req.user;

        if (user.isAdmin) return next(); // Admin boleh lanjut

        const image = await prisma.image.findUnique({
            where: { id: imageId },
            include: {
                article: { include: { author: true } },
                event: { include: { organizer: true } }
            }
        });

        if (!image) return res.status(404).json({ message: "Gambar tidak ditemukan." });

        if (image.article) { // Jika gambar milik artikel
            const author = await prisma.author.findFirst({
                where: { OR: [{ volunteer_id: user.volunteerId }, { organizer_id: user.organizerId }] }
            });
            if (author && author.author_id === image.article.author_id) {
                return next();
            }
        } else if (image.event) { // Jika gambar milik event
            if (user.organizerId && user.organizerId === image.event.organizer_id) {
                return next();
            }
        }

        return res.status(403).json({ message: "Akses ditolak. Anda bukan pemilik gambar ini." });
    } catch (error) {
        console.error("Authorization error in verifyImageOwner:", error);
        return res.status(500).json({ message: "Kesalahan otorisasi." });
    }
};
module.exports = {
    verifyAdmin,
    verifyOrganizer,
    verifyVolunteer,
    verifyAuthenticated,
    verifyAuthorOrAdmin,
    verifyOrganizerOrAdmin,
    verifyEventOwner,
    verifyOrganizerProfileAccess,
    verifyImageOwner
};