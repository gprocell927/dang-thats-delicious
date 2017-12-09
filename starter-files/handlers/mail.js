const nodemailer = require('nodemailer'); // interfaces with SMTP, will send email for you
const pug = require('pug');
const juice = require('juice'); // give it HTML with style tags, it will create inline CSS
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');


// create a transport ( a way that you interface with different ways of sending email)
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html)
  return inlined;
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Gabi Procell <noprely@gabi.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
