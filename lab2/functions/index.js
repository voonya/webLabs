const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

const rateLimit = {
  time: 30,
  maxCount: 5,
  ipCache: new Map(),
};

const mailCredent = functions.config().mail;
let transporter = null;

if (mailCredent) {
  transporter = nodemailer.createTransport({
    host: mailCredent.host,
    port: mailCredent.port,
    secure: false,
    auth: {
      user: mailCredent.login,
      pass: mailCredent.pass,
    },
  });
}

exports.sendmail = functions.https.onRequest((req, res) => {
  if (!transporter) {
    functions.logger.log('Mail credential is undefined');
    return res
      .status(500)
      .json({ error: { code: 500, detail: 'Mail credential is undefined' } });
  }

  const ipReq = req.headers['fastly-client-ip'];

  let userData = rateLimit.ipCache.get(ipReq);
  let timeNow = new Date();
  if (!userData) {
    userData = { time: timeNow - rateLimit.time * 1000, count: 0 };
  }

  if (
    timeNow - userData.time < rateLimit.time * 1000 ||
    userData.count == rateLimit.maxCount
  ) {
    res.statusMessage = 'Server error';
    return res
      .status(429)
      .json({ error: { code: 429, detail: 'To many reqests try later' } });
  }

  userData.time = timeNow;
  userData.count += 1;
  rateLimit.ipCache.set(ipReq, userData);

  if (!Object.keys(req.body ?? {})) {
    return res.status(400).json({ error: { code: 400, detail: 'No message' } });
  }

  const lines = Object.entries(req.body)
    .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
    .join('\n');

  const htmlLines = sanitizeHtml(`<p><b>Message from form:</b></p>${lines}`);

  const mailOptions = {
    from: `Contact form <${mailCredent.login}>`,
    to: mailCredent.to,
    subject: 'Message contact form',
    html: htmlLines,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      functions.logger.log('Error: ', error);
      res.status(500).json({ error: { code: 500, detail: error.message } });
      return;
    }
    return res.status(200).json({ data: 'ok' });
  });
});
