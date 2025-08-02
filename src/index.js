const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors'); 
// Inisialisasi
dotenv.config();
const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Import Rute
const volunteerRoutes = require('./routes/volunteer.routes');
const organizerRoutes = require('./routes/organizer.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');
const articleRoutes = require('./routes/article.routes');
const eventRoutes = require('./routes/event.routes');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const imageRoutes = require('./routes/image.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');

// Gunakan Rute dengan prefix
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Definisi Port
const PORT = process.env.PORT || 3000;

// Jalankan server
app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
});