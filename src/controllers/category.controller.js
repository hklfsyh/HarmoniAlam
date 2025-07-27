const prisma = require('../config/prisma');


// Membuat kategori baru (Admin)
const createCategory = async (req, res) => {
    const data = req.body;

    // KASUS 1: Jika data yang dikirim adalah sebuah ARRAY (untuk bulk create)
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return res.status(400).json({ message: "Array tidak boleh kosong." });
        }
        try {
            const result = await prisma.category.createMany({
                data: data,
                skipDuplicates: true,
            });
            return res.status(201).json({ message: `${result.count} kategori berhasil dibuat.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat banyak kategori." });
        }
    }

    // KASUS 2: Jika data yang dikirim adalah satu OBJEK
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const { categoryName, categoryType } = data;
        if (!categoryName || !categoryType) {
            return res.status(400).json({ message: "Nama dan tipe kategori harus diisi." });
        }
        if (categoryType !== 'article' && categoryType !== 'event') {
            return res.status(400).json({ message: "Tipe kategori harus 'article' atau 'event'." });
        }
        try {
            const newCategory = await prisma.category.create({ data: { categoryName, categoryType } });
            return res.status(201).json({ message: "Kategori berhasil dibuat", category: newCategory });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat satu kategori." });
        }
    }

    // Jika format tidak sesuai
    return res.status(400).json({ message: "Format body tidak valid. Kirim satu objek atau sebuah array objek." });
};

// Mengubah kategori (Admin)
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, categoryType } = req.body;

    try {
        const updatedCategory = await prisma.category.update({
            where: { category_id: parseInt(id) },
            data: {
                categoryName,
                categoryType,
            },
        });
        res.status(200).json({ message: "Kategori berhasil diubah", category: updatedCategory });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Kategori tidak ditemukan." });
        }
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Menghapus kategori (Admin)
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.category.delete({
            where: { category_id: parseInt(id) },
        });
        res.status(200).json({ message: "Kategori berhasil dihapus." });
    } catch (error) {
        // Error jika kategori masih digunakan oleh artikel/event
        if (error.code === 'P2003') {
            return res.status(409).json({ message: "Gagal menghapus. Kategori ini masih digunakan oleh artikel atau event." });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Kategori tidak ditemukan." });
        }
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// --- Endpoint Publik ---

// Mendapatkan semua kategori (Publik)
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const getEventCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { categoryType: 'event' }
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error getting event categories:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// GET: Mendapatkan semua kategori dengan tipe 'article' (Publik)
const getArticleCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { categoryType: 'article' }
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error getting article categories:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getEventCategories,
    getArticleCategories
};