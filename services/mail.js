const dotenv = require("dotenv");
dotenv.config({
    path: "./config.env",
});

const api_key = process.env.API_KEY
const domain = process.env.DOMAIN
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

exports.sendMail = (to, subject, emailBody, attachment = null) => {
    const data = {
        from: "PLENTY'S <noreply@plenty.ng>",
        to: to,         // List of recipients
        subject: subject, // Subject line
        html: emailBody //HTML Body
    };

    if (attachment) {
        data.attachment = attachment;
    }
    mailgun.messages().send(data, function (error, body) {
        console.log("error", error);
        console.log(body);
    });
}
