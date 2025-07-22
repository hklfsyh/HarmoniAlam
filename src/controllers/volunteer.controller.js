const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            const volunteer = await tx.volunteer.create({ data: { firstName, lastName, email, password: hashedPassword } });
            await tx.author.create({ data: { volunteer_id: volunteer.volunteer_id } });
            return volunteer;
        });
        const { password: _, ...volunteerWithoutPassword } = newVolunteer;
        res.status(201).json({ message: "Registrasi volunteer berhasil", volunteer: volunteerWithoutPassword });
    } catch (error) {
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

        const isPasswordValid = await bcrypt.compare(password, volunteer.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Email atau password salah" });

        const token = jwt.sign({ volunteerId: volunteer.volunteer_id, type: 'volunteer' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: "Login berhasil", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await prisma.volunteer.findMany({
            select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                // Hitung jumlah pendaftaran event yang terhubung dengan volunteer ini
                _count: {
                    select: { eventRegistrations: true }
                }
            }
        });

        // Format ulang hasil agar lebih mudah dibaca di frontend
        const formattedVolunteers = volunteers.map(volunteer => ({
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
// Melihat detail satu volunteer (Admin)
const getVolunteerById = async (req, res) => {
    const { id } = req.params;
    const volunteerId = parseInt(id);

    try {
        // Menjalankan semua query secara paralel
        const [
            volunteer,
            upcomingRegistrations,
            completedRegistrations
        ] = await Promise.all([
            // 1. Ambil data dasar volunteer + total event yang diikuti
            prisma.volunteer.findUnique({
                where: { volunteer_id: volunteerId },
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
            }),
            // 2. Ambil daftar pendaftaran untuk event yang akan datang
            prisma.eventRegistration.findMany({
                where: {
                    volunteer_id: volunteerId,
                    event: { status: 'upcoming' } // Filter berdasarkan status event
                },
                include: {
                    event: { // Sertakan detail eventnya
                        select: { event_id: true, title: true, eventDate: true }
                    }
                }
            }),
            // 3. Ambil daftar pendaftaran untuk event yang sudah selesai
            prisma.eventRegistration.findMany({
                where: {
                    volunteer_id: volunteerId,
                    event: { status: 'completed' } // Filter berdasarkan status event
                },
                include: {
                    event: {
                        select: { event_id: true, title: true, eventDate: true }
                    }
                }
            })
        ]);

        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer tidak ditemukan." });
        }

        // Susun ulang data untuk response yang rapi
        const response = {
            profile: {
                volunteer_id: volunteer.volunteer_id,
                firstName: volunteer.firstName,
                lastName: volunteer.lastName,
                email: volunteer.email,
                createdAt: volunteer.createdAt,
            },
            stats: {
                totalEventsParticipated: volunteer._count.eventRegistrations,
            },
            upcomingEvents: upcomingRegistrations.map(reg => reg.event), // Ambil detail event saja
            completedEvents: completedRegistrations.map(reg => reg.event), // Ambil detail event saja
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
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
                createdAt: true
            }
        });
        if (!profile) return res.status(404).json({ message: "Profil tidak ditemukan." });
        res.status(200).json(profile);
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