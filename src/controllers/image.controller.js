// src/controllers/image.controller.js
const prisma = require('../config/prisma');
const { deleteFromGCS } = require('../utils/gcsUploader');

/**
 * DELETE: Menghapus satu gambar galeri.
 */
const deleteImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);

        // 1. Cari gambar untuk mendapatkan URL-nya
        const imageToDelete = await prisma.image.findUnique({
            where: { id: imageId }
        });

        if (!imageToDelete) {
            return res.status(404).json({ message: "Gambar tidak ditemukan." });
        }

        // 2. Hapus file dari Google Cloud Storage
        await deleteFromGCS(imageToDelete.url);

        // 3. Hapus record dari database
        await prisma.image.delete({
            where: { id: imageId }
        });

        res.status(200).json({ message: "Gambar berhasil dihapus." });
    } catch (error) {
        console.error(`Error in deleteImage: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { deleteImage };
