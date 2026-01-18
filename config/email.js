// email.js
const nodemailer = require('nodemailer');

// Create a single transporter for all emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-char app password, no spaces
  },
});

// Verify SMTP connection
transporter.verify((err, success) => {
  if (err) console.error('SMTP connection error:', err);
  else console.log('SMTP ready to send emails');
});

// Send booking confirmation to customer
const sendBookingConfirmation = async (bookingData) => {
  try {
    const { customerInfo, travelDetails, tourTitle, tourType } = bookingData;

    const startDate = new Date(travelDetails.startDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const endDate = travelDetails.endDate 
      ? new Date(travelDetails.endDate).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
      : null;

    const totalPeople = travelDetails.numberOfPeople.adults + travelDetails.numberOfPeople.children;

    // Customer email HTML
    const customerEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#1B365D;">🎉 Booking Confirmation</h2>
        <p>Dear ${customerInfo.name},</p>
        <p>Thank you for choosing SD Tours & Travel! We've received your booking inquiry and will contact you within 24 hours.</p>
        <p><strong>Tour:</strong> ${tourTitle}</p>
        <p><strong>Tour Type:</strong> ${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        ${endDate ? `<p><strong>End Date:</strong> ${endDate}</p>` : ''}
        <p><strong>Travelers:</strong> ${travelDetails.numberOfPeople.adults} Adult(s), ${travelDetails.numberOfPeople.children} Child(ren)</p>
        <p><strong>Total People:</strong> ${totalPeople}</p>
        ${travelDetails.specialRequests ? `<p><strong>Special Requests:</strong> ${travelDetails.specialRequests}</p>` : ''}
        <p>Contact us: +94 77 887 5696 | <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
      </div>
    `;

    // Plain text version
    const customerEmailText = `
Booking Confirmation - SD Tours & Travel

Dear ${customerInfo.name},

Thank you for choosing SD Tours & Travel! We've received your booking inquiry and will contact you within 24 hours.

Tour: ${tourTitle}
Tour Type: ${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}
Start Date: ${startDate}
${endDate ? `End Date: ${endDate}` : ''}
Travelers: ${travelDetails.numberOfPeople.adults} Adult(s), ${travelDetails.numberOfPeople.children} Child(ren)
${travelDetails.specialRequests ? `Special Requests: ${travelDetails.specialRequests}` : ''}

Contact us: +94 77 887 5696 | ${process.env.EMAIL_USER}
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Must match Gmail
      to: customerInfo.email,
      subject: `Booking Confirmation - ${tourTitle}`,
      text: customerEmailText,
      html: customerEmailHTML,
    });

    console.log('Booking confirmation email sent to customer.');
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
};

// Send notification to admin
const sendAdminNotification = async (bookingData) => {
  try {
    const { customerInfo, travelDetails, tourTitle, tourType, _id } = bookingData;

    const startDate = new Date(travelDetails.startDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const endDate = travelDetails.endDate 
      ? new Date(travelDetails.endDate).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'N/A';

    const adminEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto;">
        <h2 style="color:#1B365D;">🔔 New Booking Received</h2>
        <p><strong>Booking ID:</strong> ${_id}</p>
        <p><strong>Tour:</strong> ${tourTitle}</p>
        <p><strong>Tour Type:</strong> ${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Travelers:</strong> ${travelDetails.numberOfPeople.adults} Adult(s), ${travelDetails.numberOfPeople.children} Child(ren)</p>
        <p><strong>Customer Name:</strong> ${customerInfo.name}</p>
        <p><strong>Customer Email:</strong> ${customerInfo.email}</p>
        <p><strong>Customer Phone:</strong> ${customerInfo.phone}</p>
        ${customerInfo.whatsapp ? `<p><strong>WhatsApp:</strong> ${customerInfo.whatsapp}</p>` : ''}
        ${customerInfo.country ? `<p><strong>Country:</strong> ${customerInfo.country}</p>` : ''}
        ${travelDetails.specialRequests ? `<p><strong>Special Requests:</strong> ${travelDetails.specialRequests}</p>` : ''}
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Booking: ${tourTitle} - ${customerInfo.name}`,
      html: adminEmailHTML,
    });

    console.log('Admin notification email sent.');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

module.exports = { sendBookingConfirmation, sendAdminNotification };
