const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendContactEmail = async ({ name, email, phone, subject, message }) => {
  // Email to ADMIN
  await sgMail.send({
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL_FROM,
    subject: `New Contact Message: ${subject}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p>${message}</p>
    `,
  });

  // Auto reply to USER
  await sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'We received your message',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for contacting SD Tours & Travel. We will get back to you shortly.</p>
      <br/>
      <p>Best regards,<br/>SD Tours & Travel</p>
    `,
  });
};
