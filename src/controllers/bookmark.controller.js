// src/controllers/bookmark.controller.js
const prisma = require('../config/prisma');

/**
 * POST: Menambah atau menghapus bookmark artikel untuk volunteer.
 */
const toggleArticleBookmark = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const articleId = parseInt(req.params.id);

        // 1. Cek apakah volunteer adalah penulis artikel ini
        const author = await prisma.author.findFirst({ where: { volunteer_id: volunteerId } });
        if (author) {
            const article = await prisma.article.findFirst({ where: { article_id: articleId, author_id: author.author_id } });
            if (article) {
                return res.status(403).json({ message: "Anda tidak dapat mem-bookmark artikel Anda sendiri." });
            }
        }

        // 2. Cek apakah bookmark sudah ada
        const existingBookmark = await prisma.bookmark.findUnique({
            where: { volunteerId_articleId: { volunteerId, articleId } }
        });

        if (existingBookmark) {
            // Jika ada, hapus (unbookmark)
            await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
            return res.status(200).json({ message: "Bookmark artikel dihapus." });
        } else {
            // Jika tidak ada, buat (bookmark)
            await prisma.bookmark.create({
                data: { volunteerId, articleId }
            });
            return res.status(201).json({ message: "Artikel berhasil di-bookmark." });
        }
    } catch (error) {
        console.error(`Error in toggleArticleBookmark: ${error.message}`);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

/**
 * POST: Menambah atau menghapus bookmark event untuk volunteer.
 */
const toggleEventBookmark = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const eventId = parseInt(req.params.id);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: { volunteerId_eventId: { volunteerId, eventId } }
        });

        if (existingBookmark) {
            await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
            return res.status(200).json({ message: "Bookmark event dihapus." });
        } else {
            await prisma.bookmark.create({
                data: { volunteerId, eventId }
            });
            return res.status(201).json({ message: "Event berhasil di-bookmark." });
        }
    } catch (error) {
        console.error(`Error in toggleEventBookmark: ${error.message}`);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

/**
 * GET: Mendapatkan semua item yang di-bookmark oleh volunteer.
 */
const getMyBookmarks = async (req, res) => {
    try {
        const volunteerId = req.user.volunteerId;
        const bookmarks = await prisma.bookmark.findMany({
            where: { volunteerId },
            orderBy: { createdAt: 'desc' },
            include: {
                article: {
                    select: { article_id: true, title: true, summary: true, imagePath: true }
                },
                event: {
                    select: { event_id: true, title: true, eventDate: true, imagePath: true }
                }
            }
        });
        res.status(200).json(bookmarks);
    } catch (error) {
        console.error(`Error in getMyBookmarks: ${error.message}`);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { toggleArticleBookmark, toggleEventBookmark, getMyBookmarks };
