const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

const rateLimit = {
  time: 30,
  ipCache: new Map(),
};

exports.sendmail = functions.https.onRequest((req, res) => {
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
  } else {
    functions.logger.log('Mail credential is undefined');
    return res.status(500).json({ error: 'Mail credential is undefined' });
  }
  const ipReq = req.headers['fastly-client-ip'];
  const now = new Date();
  let reqUser = {};

  if (rateLimit.ipCache.get(ipReq) === undefined) {
    rateLimit.ipCache.set(ipReq, { time: new Date() });
  } else {
    reqUser = rateLimit.ipCache.get(ipReq);
    functions.logger.log(ipReq);
    functions.logger.log(now - reqUser.time);
    if (now - reqUser.time <= rateLimit.time * 1000) {
      return res.status(429).json({ error: 'Too many request!' });
    }
  }
  reqUser = rateLimit.ipCache.get(ipReq);
  reqUser.time = new Date();
  rateLimit.ipCache.set(ipReq, reqUser);

  if (!Object.keys(req.body ? req.body : {} === req.body ?? {})) {
    return res.status(400).json({ error: 'No message!' });
  }
  const lines = Object.entries(req.body)
    .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
    .join('\n');
  const htmlLines = sanitizeHtml(`<p><b>Message from form:</b></p>${lines}`);

  const mailOptions = {
    from: `Contact form <${mailCredent.login}>`, //
    to: mailCredent.to, // list of receivers
    subject: 'Message contact form', // Subject line
    html: htmlLines, // html body
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      functions.logger.log('Error: ', error);
      return res.status(500).json({ code: 500, error: error.message });
    }
    return res.status(200).json({ data: 'ok' });
  });
});
