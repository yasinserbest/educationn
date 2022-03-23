const nodemailer = require("nodemailer");

exports.sendMail = (req, res, next) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_SIFRE,
    },
  });

  // setup email data with unicode symbols

  let mailOptions = {
    from: `${req.body.name}`,
    to: process.env.GMAIL,
    subject: `${req.body.subject}- ${req.body.email}`,
    text: "Hello world?", // plain text body
    html: `${req.body.message}`,
  };

  // send mail with defined transport object
  //console.log(req.body);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new AppError("Birşeyler ters gitti!", 404));
    }
    res.status(201).json({
      status: "success",
    });
  });
};
