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
    const resetUrl = `https://harmonii-alam.vercel.app/reset-password?token=${token}`; 

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

const sendNewVolunteerNotificationEmail = async (organizerEmail, eventTitle, volunteerName) => {
    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: organizerEmail,
        subject: `Pendaftar Baru untuk Event: ${eventTitle}`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Pendaftar Baru!</h2>
                <p>Halo,</p>
                <p>Seorang volunteer baru bernama <b>${volunteerName}</b> telah mendaftar di event Anda, <b>"${eventTitle}"</b>.</p>
                <p>Anda bisa melihat daftar lengkap pendaftar di dashboard Anda.</p>
                <p style="margin-top:24px;">Terima kasih,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending new volunteer notification:', error);
    }
};

/**
 * Mengirim notifikasi ke volunteer jika event diubah atau dibatalkan.
 */
const sendEventUpdateNotificationEmail = async (recipientEmail, eventTitle, updateType, reason = '') => {
    const subject = `Pemberitahuan: Event "${eventTitle}" Telah Di${updateType === 'updated' ? 'perbarui' : 'batalkan'}`;
    const body = updateType === 'updated'
        ? `<p>Ada pembaruan informasi untuk event <b>"${eventTitle}"</b> yang Anda ikuti. Silakan periksa kembali detail event di halaman kami untuk melihat perubahan terbaru.</p>`
        : `<p>Dengan berat hati kami informasikan bahwa event <b>"${eventTitle}"</b> yang akan Anda ikuti telah dibatalkan oleh penyelenggara.</p><p><b>Alasan:</b> ${reason}</p>`;

    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: subject,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:${updateType === 'updated' ? '#79B829' : '#d9534f'};text-align:center;">Pemberitahuan Event</h2>
                ${body}
                <p style="margin-top:24px;">Terima kasih,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending event update notification:', error);
    }
};

/**
 * Mengirim email ucapan terima kasih ke volunteer setelah event selesai.
 */
const sendThankYouForParticipatingEmail = async (recipientEmail, eventTitle, volunteerName) => {
    const mailOptions = {
        from: `"Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Terima Kasih Telah Berpartisipasi di Event ${eventTitle}!`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Terima Kasih, ${volunteerName}!</h2>
                <p>Kami dari tim Harmoni Alam dan penyelenggara event ingin mengucapkan terima kasih banyak atas partisipasi dan kontribusi Anda dalam event <b>"${eventTitle}"</b>.</p>
                <p>Semoga pengalaman ini bermanfaat dan kami berharap dapat bertemu Anda lagi di kegiatan selanjutnya!</p>
                <p style="margin-top:24px;">Salam hangat,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending thank you email:', error);
    }
};

const sendCancellationNotificationEmail = async (organizerEmail, eventTitle, volunteerName) => {
    const mailOptions = {
        from: `"Notifikasi Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: organizerEmail,
        subject: `Pembatalan Pendaftaran di Event: ${eventTitle}`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#d9534f;text-align:center;">Pemberitahuan Pembatalan</h2>
                <p>Halo,</p>
                <p>Seorang volunteer bernama <b>${volunteerName}</b> telah membatalkan pendaftarannya di event Anda, <b>"${eventTitle}"</b>.</p>
                <p>Satu slot kini telah tersedia. Anda bisa melihat daftar pendaftar terbaru di dashboard Anda.</p>
                <p style="margin-top:24px;">Terima kasih,<br><b>Tim Harmoni Alam</b></p>
                ${emailFooter}
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Cancellation notification sent to: ${organizerEmail}`);
    } catch (error) {
        console.error('Error sending cancellation notification:', error);
    }
};

const sendEmailFromOrganizer = async (recipientEmail, organizerName, eventTitle, subject, message) => {
    const mailOptions = {
        from: `"${organizerName} via Harmoni Alam" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: `Pesan Mengenai Event "${eventTitle}": ${subject}`,
        replyTo: process.env.ADMIN_EMAIL_RECIPIENT, // Balasan bisa diarahkan ke admin atau email organizer jika ada
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Pesan dari ${organizerName}</h2>
                <p>Anda menerima pesan dari <b>${organizerName}</b> mengenai event <b>"${eventTitle}"</b>.</p>
                <hr>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color:#888;font-size:13px;"><i>Ini adalah email otomatis yang dikirim melalui platform Harmoni Alam.</i></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email from organizer sent to: ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending email from organizer:', error);
        throw new Error('Gagal mengirim email ke volunteer.');
    }
};

const sendBroadcastEmail = async (recipientEmails, subject, message) => {
    const mailOptions = {
        from: `"Harmoni Alam (Pengumuman)" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Kirim ke diri sendiri
        bcc: recipientEmails, // Gunakan BCC untuk menyembunyikan daftar penerima
        subject: subject,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;">
                <img src="${EMAIL_LOGO}" alt="Harmoni Alam Logo" style="height:60px;display:block;margin:0 auto 16px auto;">
                <h2 style="color:#79B829;text-align:center;">Pengumuman dari Harmoni Alam</h2>
                <hr>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color:#888;font-size:13px;"><i>Ini adalah email otomatis. Mohon jangan membalas langsung ke alamat email ini.</i></p>
                ${emailFooter}
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Broadcast email sent to ${recipientEmails.length} recipients.`);
    } catch (error) {
        console.error('Error sending broadcast email:', error);
        throw new Error('Gagal mengirim email broadcast.');
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
    sendAccountDeletionEmail,
    sendNewVolunteerNotificationEmail,
    sendEventUpdateNotificationEmail,
    sendThankYouForParticipatingEmail,
    sendCancellationNotificationEmail,
    sendEmailFromOrganizer,
    sendBroadcastEmail
};