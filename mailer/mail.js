const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

let sendMail = ({ sendTo, subject, body }) => {
  let mailOptions = {
    from: "tanu16782@gmail.com",
    to: sendTo,
    text: body,
    subject: "Product Data",
    html: "<h3>Hi, Hope you are doing well!!</h3> <p>Please find the attached document of product data.</p>",
    attachments: [
      {
        filename: "data.json",
        path: "scraping/data.json",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
let mailer =  ({ sendTo, subject, body }) => {
    mailOptions = {
      from: "tanu@16782@gmail.com",
      to: sendTo,
      subject: subject,
      text: body,
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
  
}

module.exports = {
  sendMail,
  mailer
};
