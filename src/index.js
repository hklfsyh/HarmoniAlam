const express = require("express");
const dotenv = require("dotenv");

// Inisialisasi
dotenv.config();
const app = express();

// Middleware global
app.use(express.json());

// Import Rute
const volunteerRoutes = require('./routes/volunteer.routes');
const organizerRoutes = require('./routes/organizer.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');

// Gunakan Rute dengan prefix
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

// Definisi Port
const PORT = process.env.PORT || 3000;

// Jalankan server
app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
});