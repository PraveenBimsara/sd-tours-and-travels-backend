const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendBookingConfirmation = async (bookingData) => {
  const { customerInfo, tourTitle } = bookingData;

  const msg = {
    to: customerInfo.email,
    from: process.env.EMAIL_FROM,
    subject: `Booking Confirmation - ${tourTitle}`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Hi ${customerInfo.name},</p>
      <p>We have received your booking inquiry for <strong>${tourTitle}</strong>.</p>
      <p>Our team will contact you within 24 hours.</p>
      <br/>
      <p>SD Tours & Travel</p>
    `,
  };

  await sgMail.send(msg);
};

const sendAdminNotification = async (bookingData) => {
  const { customerInfo, tourTitle, _id } = bookingData;

  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL_FROM,
    subject: `New Booking - ${tourTitle}`,
    html: `
      <h3>New Booking Received</h3>
      <p><strong>Booking ID:</strong> ${_id}</p>
      <p><strong>Name:</strong> ${customerInfo.name}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
    `,
  };

  await sgMail.send(msg);
};

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
};
