const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    verifyToken(req, res, next, 'organizer');
};

const verifyVolunteer = (req, res, next) => {
    verifyToken(req, res, next, 'volunteer');
};


module.exports = {
    verifyAdmin,
    verifyOrganizer,
    verifyVolunteer
};