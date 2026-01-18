const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (NO SPACES)
  },
});

// Optional verification (logs only once)
transporter.verify()
  .then(() => console.log('✅ Email transporter ready'))
  .catch(err => console.error('❌ Email transporter error:', err));

const sendBookingConfirmation = async (bookingData) => {
  const { customerInfo, travelDetails, tourTitle, tourType } = bookingData;

  await transporter.sendMail({
    from: `"SD Tours & Travel" <${process.env.EMAIL_USER}>`,
    to: customerInfo.email,
    subject: `Booking Confirmation - ${tourTitle}`,
    html: `<p>Hi ${customerInfo.name}, your booking for <b>${tourTitle}</b> has been received.</p>`,
  });
};

const sendAdminNotification = async (bookingData) => {
  const { customerInfo, tourTitle, _id } = bookingData;

  await transporter.sendMail({
    from: `"SD Tours & Travel" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking Received - ${tourTitle}`,
    html: `
      <h3>New Booking</h3>
      <p><b>Booking ID:</b> ${_id}</p>
      <p><b>Name:</b> ${customerInfo.name}</p>
      <p><b>Email:</b> ${customerInfo.email}</p>
    `,
  });
};

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
};
