const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify once on startup
transporter.verify((err) => {
  if (err) {
    console.error('❌ Email transporter error:', err);
  } else {
    console.log('✅ Email transporter ready');
  }
});

module.exports = transporter;
