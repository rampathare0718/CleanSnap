const nodemailer = require("nodemailer");

// =========================================================
// Reusable Email Sender
// =========================================================
// Uses SMTP credentials from environment variables.
// For Gmail:
//   EMAIL_HOST = smtp.gmail.com
//   EMAIL_PORT = 587
//   EMAIL_USER = youraddress@gmail.com
//   EMAIL_PASS = a 16-character Gmail "App Password"
//                (NOT your normal Gmail password — generate one at
//                https://myaccount.google.com/apppasswords, requires
//                2-Step Verification to be enabled on the account)
// =========================================================

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"CleanSnap" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
};

module.exports = sendEmail;