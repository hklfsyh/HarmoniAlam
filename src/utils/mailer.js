const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const EMAIL_LOGO = 'https://storage.googleapis.com/harmoni_alam/Logo_HarmoniAlam.png';
const EMAIL_ADDRESS = 'Jl. Harmoni Indah No. 123, Jakarta, Indonesia';
const EMAIL_PHONE = '+62 812-3456-7890';

const emailFooter = `
<br><hr style="border:0;border-top:1px solid #e0e0e0;margin:24px 0 12px 0;">
<div style="font-size:13px;color:#888;">
  <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:40px;vertical-align:middle;margin-bottom:8px;"><br>
  <b>Harmoni Alam</b><br>
  ${EMAIL_ADDRESS}<br>
  Telp: ${EMAIL_PHONE}<br>
  <span style="color:#aaa;font-size:12px;">Email ini dikirim otomatis, mohon tidak membalas langsung ke email ini.</span>
</div>`;

const sendVerificationEmail = async (email, token) => {
    // PENTING: Ganti localhost dengan URL frontend Anda saat produksi
    const verificationUrl = `${process.env.API_BASE_URL}/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: `"Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verifikasi Email Akun Harmoni Alam Anda',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Selamat Datang di Harmoni Alam!</h2>
                <p>Terima kasih telah mendaftar. Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>
                <div style="text-align:center;margin:24px 0;">
                    <a href="${verificationUrl}" style="padding:12px 24px;background:#79B829;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Verifikasi Akun Saya</a>
                </div>
                <p style="color:#888;font-size:13px;">Link ini akan kedaluwarsa dalam 1 jam.</p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Gagal mengirim email verifikasi.');
    }
};

const sendApprovalEmail = async (email, orgName) => {
    const mailOptions = {
        from: `"Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Selamat! Pengajuan Organizer Anda Telah Disetujui',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Selamat, ${orgName}!</h2>
                <p>Kabar baik! Pengajuan Anda untuk menjadi <b>Organizer</b> di platform Harmoni Alam telah <b>disetujui</b>.</p>
                <p>Anda sekarang dapat login ke akun Anda dan mulai membuat event serta artikel untuk menginspirasi lebih banyak orang.</p>
                <p>Terima kasih atas komitmen Anda untuk lingkungan.</p>
                <p style="margin-top:24px;">Salam hangat,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent to:', email);
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};

const sendRejectionEmail = async (email, orgName, reason) => {
    const mailOptions = {
        from: `"Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Informasi Mengenai Pengajuan Organizer Anda',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#d9534f;text-align:center;">Pengajuan Organizer Belum Disetujui</h2>
                <p>Halo <b>${orgName}</b>,</p>
                <p>Setelah melakukan peninjauan, dengan berat hati kami informasikan bahwa pengajuan Anda untuk menjadi Organizer <b>belum dapat kami setujui</b> saat ini.</p>
                <p><b>Alasan:</b> ${reason || 'Tidak ada alasan spesifik yang diberikan.'}</p>
                <p>Anda dapat meninjau kembali data Anda, memperbaikinya, dan mengajukan ulang melalui dashboard Anda.</p>
                <p style="margin-top:24px;">Terima kasih atas pengertian Anda,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Rejection email sent to:', email);
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
};

const sendAdminNotificationEmail = async (orgName, organizerId, type) => {
    const subject = type === 'new' 
        ? `Pengajuan Organizer Baru: ${orgName}` 
        : `Pengajuan Ulang Organizer: ${orgName}`;

    const body = type === 'new'
        ? `<p>Sebuah organisasi baru, <b>${orgName}</b>, telah mendaftar dan mengajukan diri sebagai organizer.</p>`
        : `<p>Organizer <b>${orgName}</b> yang sebelumnya ditolak telah memperbarui data dan mengajukan ulang.</p>`;

    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Kirim ke email admin
        subject: subject,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Notifikasi Pengajuan Organizer</h2>
                ${body}
                <p>Silakan masuk ke dashboard admin untuk meninjau pengajuan ini.</p>
                <p><b>ID Organizer:</b> ${organizerId}</p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent for ${orgName}`);
    } catch (error) {
        console.error('Error sending admin notification email:', error);
    }
};

const sendDeletionNotificationEmail = async (recipientEmail, contentTitle, contentType, reason) => {
    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Pemberitahuan: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Anda Telah Dihapus`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#d9534f;text-align:center;">Pemberitahuan Penghapusan Konten</h2>
                <p>Dengan berat hati kami informasikan bahwa ${contentType} Anda yang berjudul <b>"${contentTitle}"</b> telah dihapus dari platform kami oleh admin.</p>
                <p><b>Alasan Penghapusan:</b> ${reason || 'Tidak ada alasan spesifik yang diberikan.'}</p>
                <p>Jika Anda merasa ini adalah sebuah kekeliruan, silakan hubungi tim support kami.</p>
                <p style="margin-top:24px;">Terima kasih atas pengertian Anda,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Deletion notification sent to: ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending deletion notification email:', error);
    }
};

const sendContactAdminEmail = async (senderName, senderEmail, senderRole, subject, message) => {
    const mailOptions = {
        from: `"Kontak Form Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `Pesan Baru dari ${senderRole}: ${subject}`,
        replyTo: senderEmail, // Agar admin bisa langsung membalas ke email pengguna
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Pesan Baru dari Formulir Kontak</h2>
                <p><b>Dari:</b> ${senderName} (${senderRole})<br>
                <b>Email:</b> ${senderEmail}</p>
                <hr>
                <p><b>Pesan:</b></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Contact form message sent from ${senderEmail} to admin.`);
    } catch (error) {
        console.error('Error sending contact admin email:', error);
        throw new Error('Gagal mengirim pesan ke admin.');
    }
};
const sendPasswordResetEmail = async (email, token) => {
    // PENTING: Ganti URL ini dengan halaman reset password di aplikasi frontend Anda
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`; 

    const mailOptions = {
        from: `"Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Permintaan Reset Password Akun Harmoni Alam Anda',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Permintaan Reset Password</h2>
                <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
                <div style="text-align:center;margin:24px 0;">
                    <a href="${resetUrl}" style="padding:12px 24px;background:#79B829;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Reset Password</a>
                </div>
                <p style="color:#888;font-size:13px;">Link ini akan kedaluwarsa dalam 10 menit. Jika Anda tidak meminta ini, abaikan saja email ini.</p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

const sendDirectEmailFromAdmin = async (recipientEmail, subject, message) => {
    const mailOptions = {
        from: `"Harmoni Alam (Admin)" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Pesan dari Admin Harmoni Alam: ${subject}`,
        replyTo: process.env.GMAIL_USER, // Balasan akan masuk ke email admin
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Pesan dari Admin Harmoni Alam</h2>
                <hr>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Direct email sent to: ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending direct email from admin:', error);
        throw new Error('Gagal mengirim email ke pengguna.');
    }
};

const sendAccountDeletionEmail = async (recipientEmail, userName, reason) => {
    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Pemberitahuan: Akun Harmoni Alam Anda Telah Dihapus',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#d9534f;text-align:center;">Pemberitahuan Penghapusan Akun</h2>
                <p>Halo <b>${userName}</b>,</p>
                <p>Dengan berat hati kami informasikan bahwa akun Anda di platform Harmoni Alam telah <b>dihapus</b> oleh admin.</p>
                <p><b>Alasan:</b> ${reason || 'Tidak ada alasan spesifik yang diberikan.'}</p>
                <p>Jika Anda merasa ini adalah sebuah kekeliruan, silakan hubungi tim support kami.</p>
                <p style="margin-top:24px;">Terima kasih,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Account deletion notification sent to: ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending account deletion email:', error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendAdminNotificationEmail,
    sendDeletionNotificationEmail,
    sendContactAdminEmail,
    sendPasswordResetEmail,
    sendDirectEmailFromAdmin,
    sendAccountDeletionEmail
};