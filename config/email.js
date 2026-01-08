const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send booking confirmation email to customer
const sendBookingConfirmation = async (bookingData) => {
  const transporter = createTransporter();

  const { customerInfo, travelDetails, tourTitle, tourType } = bookingData;

  // Format dates
  const startDate = new Date(travelDetails.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const endDate = travelDetails.endDate 
    ? new Date(travelDetails.endDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const totalPeople = travelDetails.numberOfPeople.adults + travelDetails.numberOfPeople.children;

  // Customer email HTML
  const customerEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
        }
        .booking-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #FF6B35;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #1B365D;
        }
        .value {
          color: #555;
        }
        .footer {
          background: #1B365D;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #FF6B35;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 25px;
          margin: 20px 0;
        }
        .highlight {
          background: #FFF3E0;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 3px solid #F7931E;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Booking Confirmation</h1>
        <p>Thank you for choosing SD Tours & Travel!</p>
      </div>
      
      <div class="content">
        <p>Dear ${customerInfo.name},</p>
        
        <p>We're excited to confirm that we've received your booking inquiry! Our team will review your request and contact you within 24 hours to finalize the details.</p>
        
        <div class="booking-details">
          <h2 style="color: #1B365D; margin-top: 0;">Your Booking Details</h2>
          
          <div class="detail-row">
            <span class="label">Tour:</span>
            <span class="value">${tourTitle}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Tour Type:</span>
            <span class="value">${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Start Date:</span>
            <span class="value">${startDate}</span>
          </div>
          
          ${endDate ? `
            <div class="detail-row">
              <span class="label">End Date:</span>
              <span class="value">${endDate}</span>
            </div>
          ` : ''}
          
          <div class="detail-row">
            <span class="label">Travelers:</span>
            <span class="value">${travelDetails.numberOfPeople.adults} Adult(s), ${travelDetails.numberOfPeople.children} Child(ren)</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Total People:</span>
            <span class="value">${totalPeople}</span>
          </div>
          
          ${customerInfo.country ? `
            <div class="detail-row">
              <span class="label">Country:</span>
              <span class="value">${customerInfo.country}</span>
            </div>
          ` : ''}
          
          ${travelDetails.specialRequests ? `
            <div class="detail-row">
              <span class="label">Special Requests:</span>
              <span class="value">${travelDetails.specialRequests}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="highlight">
          <strong>📞 Contact Information</strong><br>
          Email: ${customerInfo.email}<br>
          Phone: ${customerInfo.phone}<br>
          ${customerInfo.whatsapp ? `WhatsApp: ${customerInfo.whatsapp}<br>` : ''}
        </div>
        
        <div style="text-align: center;">
          <p><strong>What's Next?</strong></p>
          <p>Our travel experts will contact you shortly to:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Confirm availability for your selected dates</li>
            <li>Provide detailed pricing information</li>
            <li>Answer any questions you may have</li>
            <li>Customize your itinerary if needed</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/94774064437" class="button">💬 Chat with Us on WhatsApp</a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Need immediate assistance?</strong><br>
          Call us: +94 77 406 4437<br>
          Email: info@sdtours.lk
        </p>
      </div>
      
      <div class="footer">
        <p><strong>SD Tours & Travel</strong></p>
        <p>Creating Unforgettable Sri Lankan Adventures</p>
        <p style="font-size: 12px; margin-top: 15px;">
          This is an automated confirmation email. Please do not reply directly to this email.
        </p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const customerEmailText = `
Booking Confirmation - SD Tours & Travel

Dear ${customerInfo.name},

Thank you for choosing SD Tours & Travel! We've received your booking inquiry and will contact you within 24 hours.

YOUR BOOKING DETAILS:
- Tour: ${tourTitle}
- Tour Type: ${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}
- Start Date: ${startDate}
${endDate ? `- End Date: ${endDate}` : ''}
- Travelers: ${travelDetails.numberOfPeople.adults} Adult(s), ${travelDetails.numberOfPeople.children} Child(ren)
${customerInfo.country ? `- Country: ${customerInfo.country}` : ''}
${travelDetails.specialRequests ? `- Special Requests: ${travelDetails.specialRequests}` : ''}

CONTACT INFORMATION:
- Email: ${customerInfo.email}
- Phone: ${customerInfo.phone}
${customerInfo.whatsapp ? `- WhatsApp: ${customerInfo.whatsapp}` : ''}

WHAT'S NEXT?
Our travel experts will contact you shortly to confirm availability, provide pricing, and answer any questions.

Need immediate assistance?
Call: +94 77 406 4437
WhatsApp: https://wa.me/94774064437

Best regards,
SD Tours & Travel Team
  `;

  // Send email to customer
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: customerInfo.email,
    subject: `Booking Confirmation - ${tourTitle}`,
    text: customerEmailText,
    html: customerEmailHTML,
  });
};

// Send notification email to admin
const sendAdminNotification = async (bookingData) => {
  const transporter = createTransporter();

  const { customerInfo, travelDetails, tourTitle, tourType, _id } = bookingData;

  const startDate = new Date(travelDetails.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const endDate = travelDetails.endDate 
    ? new Date(travelDetails.endDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  const adminEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background: #1B365D;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background: #f9f9f9;
        }
        .booking-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .urgent {
          background: #FFF3CD;
          border-left: 4px solid #FFA500;
          padding: 15px;
          margin: 15px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }
        td:first-child {
          font-weight: bold;
          width: 40%;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔔 New Booking Received!</h1>
      </div>
      
      <div class="content">
        <div class="urgent">
          <strong>⚡ Action Required:</strong> A new booking inquiry has been submitted and requires your attention.
        </div>
        
        <div class="booking-box">
          <h2 style="margin-top: 0; color: #1B365D;">Booking Information</h2>
          <table>
            <tr>
              <td>Booking ID:</td>
              <td>${_id}</td>
            </tr>
            <tr>
              <td>Tour:</td>
              <td><strong>${tourTitle}</strong></td>
            </tr>
            <tr>
              <td>Tour Type:</td>
              <td>${tourType === 'tour' ? 'Multi-Day Tour' : 'Day Tour'}</td>
            </tr>
            <tr>
              <td>Start Date:</td>
              <td>${startDate}</td>
            </tr>
            <tr>
              <td>End Date:</td>
              <td>${endDate}</td>
            </tr>
            <tr>
              <td>Adults:</td>
              <td>${travelDetails.numberOfPeople.adults}</td>
            </tr>
            <tr>
              <td>Children:</td>
              <td>${travelDetails.numberOfPeople.children}</td>
            </tr>
          </table>
        </div>
        
        <div class="booking-box">
          <h2 style="margin-top: 0; color: #1B365D;">Customer Details</h2>
          <table>
            <tr>
              <td>Name:</td>
              <td>${customerInfo.name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td><a href="mailto:${customerInfo.email}">${customerInfo.email}</a></td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td><a href="tel:${customerInfo.phone}">${customerInfo.phone}</a></td>
            </tr>
            ${customerInfo.whatsapp ? `
              <tr>
                <td>WhatsApp:</td>
                <td><a href="https://wa.me/${customerInfo.whatsapp.replace(/[^0-9]/g, '')}">${customerInfo.whatsapp}</a></td>
              </tr>
            ` : ''}
            ${customerInfo.country ? `
              <tr>
                <td>Country:</td>
                <td>${customerInfo.country}</td>
              </tr>
            ` : ''}
          </table>
        </div>
        
        ${travelDetails.specialRequests ? `
          <div class="booking-box">
            <h2 style="margin-top: 0; color: #1B365D;">Special Requests</h2>
            <p>${travelDetails.specialRequests}</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <p><strong>📞 Contact the customer within 24 hours to confirm the booking!</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email to admin
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Admin email
    subject: `🔔 New Booking: ${tourTitle} - ${customerInfo.name}`,
    html: adminEmailHTML,
  });
};

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
};