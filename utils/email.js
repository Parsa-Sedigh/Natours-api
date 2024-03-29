const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// const sendEmail = async options => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     // service: 'Gmail',
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD, // This property is named pass not password which is in the tutor's code
//     }
//     // Activate in gmail "less secure app" option(if you're using gmail as service which comes with nodemailer in opposite of mailtrap)
//   });
//
//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Parsa <hello@parsa.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//
//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

////////////////

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Parsa <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // create a transporter for send-grid:
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        }
      });
    }

    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD // This property is named pass not password which is in the tutor's code
      }
      // Activate in gmail "less secure app" option(if you're using gmail as service which comes with nodemailer in opposite of mailtrap)
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML for the email based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
};
