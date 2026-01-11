const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = async ({ name, email, phone, subject, message }) => {
  await transporter.verify();

  // Email to ADMIN
  await transporter.sendMail({
    from: `"SD Tours & Travel Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Message: ${subject}`,
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  });

  // Auto-reply to USER
  await transporter.sendMail({
    from: `"SD Tours & Travel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'We received your message',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
      <br/>
      <p>Best regards,<br/>Your Team</p>
    `,
  });
};
