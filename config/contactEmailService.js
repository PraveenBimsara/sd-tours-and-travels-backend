const transporter = require('../utils/mailer');

const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: subject || 'New Contact Form Submission',
    html: `
      <h2>New Contact Message</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>

      <h3>Message</h3>
      <p>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactEmail,
};
