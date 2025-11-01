// Looking to send emails in production? Check out our Email API/SMTP product!
import Nodemailer from "nodemailer";
const { MailtrapTransport } = require("mailtrap");

const TOKEN = MAILTRAP_TOKEN;

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
    testInboxId: 4141102,
  })
);

const sender = {
  address: "hello@example.com",
  name: "Mailtrap Test",
};
const recipients = ["porsokkhy0804@gmail.com"];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
    sandbox: true,
  })
  .then(console.log, console.error);
