const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: functions.config().mail.login,
    pass: functions.config().mail.pass,
  },
});

const rateLimit = {
  time: 30,
  ipCache: new Map(),
};

exports.sendmail = functions.https.onRequest((req, res) => {
  const ipReq = req.headers["fastly-client-ip"];
  const now = new Date();
  let reqUser = {};
  if (rateLimit.ipCache.get(ipReq) === undefined) {
    rateLimit.ipCache.set(ipReq, {time: new Date()});
  } else {
    reqUser = rateLimit.ipCache.get(ipReq);
    console.log(ipReq);
    console.log(now-reqUser.time);
    if (now - reqUser.time <= rateLimit.time * 1000) {
      return res.status(400)
          .json({error: "Too many request!"});
    }
  }
  reqUser = rateLimit.ipCache.get(ipReq);
  reqUser.time = new Date();
  rateLimit.ipCache.set(ipReq, reqUser);

  if (!Object.keys(req.body ? req.body : {}).length) {
    return res.json({code: 400, error: "No message!"});
  }

  const lines = Object.entries(req.body)
      .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
      .join("\n");
  const htmlLines = sanitizeHtml(`<p><b>Message from form:</b></p>${lines}`);

  const mailOptions = {
    from: `Contact form <${functions.config().mail.login}>`, //
    to: functions.config().mail.to, // list of receivers
    subject: "Message contact form", // Subject line
    html: htmlLines, // html body
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error: ", error);
      return res.status(500).json({code: 500, error: error.message});
    }
    return res.status(200).json({data: "ok"});
  });
});
