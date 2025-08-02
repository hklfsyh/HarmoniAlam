const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/mailer');
const { uploadToGCS, deleteFromGCS } = require('../utils/gcsUploader');
const crypto = require('crypto');

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
            const volunteer = await tx.volunteer.create({
                data: { 
                    firstName, 
                    lastName, 
                    email, 
                    password: hashedPassword,
                    isVerified: false
                },
            });

            // --- PERBAIKAN DI SINI ---
            // Buat profil penulis dan hubungkan ke volunteer baru
            await tx.author.create({
                data: {
                    volunteer: {
                        connect: {
                            volunteer_id: volunteer.volunteer_id
                        }
                    }
                }
            });
            // --------------------------

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 3600000); // 1 jam
            await tx.verificationToken.create({
                data: { 
                    token, 
                    expiresAt, 
                    volunteerId: volunteer.volunteer_id 
                }
            });

            await sendVerificationEmail(volunteer.email, token);
            return volunteer;
        });

        const { password: _, ...volunteerWithoutPassword } = newVolunteer;

        res.status(201).json({ 
            message: `Registrasi berhasil. Silakan cek email di ${newVolunteer.email} untuk verifikasi.`,
            volunteer: volunteerWithoutPassword
        });

    } catch (error) {
        console.error(`Error in registerVolunteer: ${error.message}`);
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

        if (volunteer.status === 'DELETED') {
            return res.status(403).json({ message: "Akun Anda sudah dihapus." });
        }

        const isPasswordValid = await bcrypt.compare(password, volunteer.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Email atau password salah" });

        // Tambahkan pengecekan verifikasi di sini
        if (!volunteer.isVerified) {
            return res.status(403).json({ message: "Akun belum diverifikasi. Silakan cek email Anda." });
        }

        const token = jwt.sign({ volunteerId: volunteer.volunteer_id, type: 'volunteer' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: "Login berhasil", token: token });
    } catch (error) {
        console.error(`Error in loginOrganizer: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllVolunteers = async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = { status: { not: 'DELETED' } };

        if (search) {
            whereClause.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const volunteers = await prisma.volunteer.findMany({
            where: whereClause,
            select: {
                volunteer_id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { eventRegistrations: true }
                }
            }
        });

        // Format ulang hasil agar lebih mudah dibaca di frontend
        const formattedVolunteers = volunteers.map(volunteer => ({
            volunteer_id: volunteer.volunteer_id,
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            email: volunteer.email,
            createdAt: volunteer.createdAt,
            totalEventsParticipated: volunteer._count.eventRegistrations
        }));

        res.status(200).json(formattedVolunteers);
    } catch (error) {
        console.error("Error getting all volunteers:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// Melihat detail satu volunteer (Admin)
const getVolunteerById = async (req, res) => {
    const { id } = req.params;
    const volunteerId = parseInt(id);

    try {
        // Menjalankan query untuk profil dan semua pendaftaran secara paralel
        const [
            volunteer,
            allRegistrations
        ] = await Promise.all([
            // 1. Ambil data dasar volunteer + total event yang diikuti
            prisma.volunteer.findUnique({
                where: { 
                    volunteer_id: volunteerId,
                    status: { not: 'DELETED' } // Memastikan volunteer tidak dihapus
                },
                select: {
                    volunteer_id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    isVerified: true,
                    profilePicture: true,
                    _count: {
                        select: { eventRegistrations: true }
                    }
                }
            }),
            // 2. Ambil semua pendaftaran event untuk volunteer ini dalam satu query
            prisma.eventRegistration.findMany({
                where: {
                    volunteer_id: volunteerId,
                },
                orderBy: {
                    event: {
                        eventDate: 'desc' // Urutkan berdasarkan tanggal event terbaru
                    }
                },
                include: {
                    event: {
                        select: { 
                            event_id: true, 
                            title: true, 
                            eventDate: true, 
                            eventTime: true,
                            status: true // <-- Status tetap diambil
                        }
                    }
                }
            })
        ]);

        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer tidak ditemukan." });
        }

        // 3. Susun ulang data untuk response yang rapi
        const response = {
            profile: {
                volunteer_id: volunteer.volunteer_id,
                firstName: volunteer.firstName,
                lastName: volunteer.lastName,
                email: volunteer.email,
                createdAt: volunteer.createdAt,
                isVerified: volunteer.isVerified,
                profilePicture: volunteer.profilePicture,
            },
            stats: {
                totalEventsParticipated: volunteer._count.eventRegistrations,
            },
            // Gabungkan menjadi satu array
            registeredEvents: allRegistrations.map(reg => reg.event),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting volunteer by ID:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const profile = await prisma.volunteer.findUnique({
            where: { volunteer_id: volunteerId },
            select: {
                volunteer_id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
                createdAt: true,
                author: { // Sertakan relasi author
                    select: {
                        author_id: true // Ambil author_id
                    }
                }
            }
        });
        if (!profile) return res.status(404).json({ message: "Profil tidak ditemukan." });

        // Format ulang response untuk menyertakan author_id
        const formattedProfile = {
            volunteer_id: profile.volunteer_id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            profilePicture: profile.profilePicture,
            createdAt: profile.createdAt,
            author_id: profile.author ? profile.author.author_id : null
        };

        res.status(200).json(formattedProfile);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// PATCH /api/volunteer/profile
const updateMyProfile = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const { firstName, lastName, password } = req.body;
        const file = req.file; // Ini adalah file profile picture
        const updateData = {};

        // Ambil data nama yang ada untuk path folder
        const existingProfile = await prisma.volunteer.findUnique({
            where: { volunteer_id: volunteerId },
            select: { firstName: true, lastName: true, profilePicture: true }
        });
        if (!existingProfile) {
            return res.status(404).json({ message: "Profil tidak ditemukan." });
        }

        // Isi data teks yang akan diupdate
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Proses gambar profil jika ada file baru
        if (file) {
            if (existingProfile.profilePicture) {
                await deleteFromGCS(existingProfile.profilePicture);
            }
            // Buat path folder dinamis: volunteer/NamaDepan_NamaBelakang/
            const folderPath = `volunteer/${existingProfile.firstName}_${existingProfile.lastName}/`;
            updateData.profilePicture = await uploadToGCS(file, folderPath);
        }

        const updatedProfile = await prisma.volunteer.update({
            where: { volunteer_id: volunteerId },
            data: updateData,
            select: {
                firstName: true, lastName: true, email: true, profilePicture: true
            }
        });

        res.status(200).json({ message: "Profil berhasil diubah", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating volunteer profile:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getMyRegistrations = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const registrations = await prisma.eventRegistration.findMany({
            where: { volunteer_id: volunteerId },
            orderBy: { registeredAt: 'desc' },
            include: {
                event: { // Sertakan detail event untuk setiap pendaftaran
                    select: {
                        title: true,
                        eventDate: true,
                        location: true,
                        status: true
                    }
                }
            }
        });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error getting my registrations:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { registerVolunteer, loginVolunteer, getAllVolunteers, getVolunteerById, getMyProfile, updateMyProfile, getMyRegistrations };