const transporter = require('../utils/mailer');

/**
 * Send booking confirmation email to customer
 */
exports.sendBookingConfirmationEmail = async ({
  customerEmail,
  customerName,
  bookingId,
  tourTitle,
  travelDate,
  totalPrice,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: 'Your Booking Confirmation – SD Tours & Travel',
    html: `
      <h2>Thank you for your booking, ${customerName}!</h2>
      <p>Your booking has been successfully received.</p>

      <h3>Booking Details</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${bookingId}</li>
        <li><strong>Tour:</strong> ${tourTitle}</li>
        <li><strong>Travel Date:</strong> ${travelDate}</li>
        <li><strong>Total Price:</strong> $${totalPrice}</li>
      </ul>

      <p>We will contact you shortly with more details.</p>

      <p>
        Best regards,<br/>
        <strong>SD Tours & Travel</strong>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send admin notification email
 */
exports.sendAdminBookingNotification = async ({
  bookingId,
  customerName,
  customerEmail,
  tourTitle,
  travelDate,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Booking Received',
    html: `
      <h2>New Booking Alert</h2>

      <ul>
        <li><strong>Booking ID:</strong> ${bookingId}</li>
        <li><strong>Customer:</strong> ${customerName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Tour:</strong> ${tourTitle}</li>
        <li><strong>Travel Date:</strong> ${travelDate}</li>
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);
};
