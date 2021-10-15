const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const sanitizeHtml = require("sanitize-html");
// const cors = require("cors")({origin: true});
const gmail = "postmaster@sandbox687accaf48fa4a3d868bd655c80c736b.mailgun.org";

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "postmaster@sandbox687accaf48fa4a3d868bd655c80c736b.mailgun.org",
    pass: "645cf51e53e98f2c88c128e72f4964c2-2ac825a1-26a0774a",
  },
});

const rateLimit = {
  limit: 7,
  ipCache: new Map(),
};

exports.sendmail = functions.https.onRequest((req, res) => {
  console.log(req.ip);
  // /cors(req, res, ()=>{
  const ipReq = req.headers["x-forwarded-for"];
  const reqCount = rateLimit.ipCache.get(ipReq) || 0;
  rateLimit.ipCache.set(ipReq, reqCount + 1);
  if (rateLimit.ipCache.get(ipReq) > rateLimit.limit) {
    console.log("here");
    return res.status(400)
        .json({code: 400, error: "Too many request wait a hour!"});
  }

  if (!Object.keys(req.body ? req.body : {}).length) {
    return res.status(400).json({code: 400, error: "No message!"});
  }

  const lines = Object.entries(req.body)
      .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
      .join("\n");
  const htmlLines = sanitizeHtml(`<p><b>Message from form:</b></p>${lines}`);

  const mailOptions = {
    from: `Contact form <${gmail}>`, //
    to: "dlyarobot@gmail.com", // list of receivers
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
  // });
});
