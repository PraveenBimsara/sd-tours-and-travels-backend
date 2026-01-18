const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = async ({ name, email, phone, subject, message }) => {
  // ADMIN EMAIL
  await transporter.sendMail({
    from: `"SD Tours & Travel Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Message: ${subject}`,
    html: `
      <h3>New Contact Message</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b><br/>${message}</p>
    `,
  });

  // AUTO REPLY
  await transporter.sendMail({
    from: `"SD Tours & Travel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'We received your message',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for contacting SD Tours & Travel. We’ll reply shortly.</p>
    `,
  });
};
