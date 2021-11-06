const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // This property is named pass not password which is in the tutor's code
    }
    // Activate in gmail "less secure app" option(if you're using gmail as service which comes with nodemailer in opposite of mailtrap)
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Parsa <hello@parsa.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
