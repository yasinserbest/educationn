const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

//new Email(user,url).sendWelcome(); böyle kullanıcam

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_SIFRE,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    //1) render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2) Define the email options
    const mailOptions = {
      //from: this.from,
      to: this.to,
      from: process.env.GMAIL,
      subject,
      html,
      text: htmlToText.fromString(html),
      //html
    };
    //3)create a transport and send emaiş

    await this.newTransport().sendMail(mailOptions);
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Şifre yenileme anahtarınız. (10 dakika geçerli)"
    );
  }
};

/*const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Jonas Schmedtmann <hello@jonas.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
*/
