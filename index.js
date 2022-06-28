import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { htmlToText } from "html-to-text";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 3001;
app.use("/api/mail", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

route.post("/vietown-new", (req, res) => {
  const { email, name, total, items, isDelivery, paymentType } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Ďakujeme ti za objednávku!</p>
  <p>Objednal si si:</p>
  <ul>
  ${items.map((item) => "<li>" + item + "</li>").join("")}
  </ul>
  <p><b>Celková cena je: ${total}€</b></p>
  <p>Vybral/a si si platbu <b>${
    paymentType === "cash" ? "v hotovosti" : "kartou"
  }</b> a <b>${
    isDelivery ? "objednávku ti donesieme" : "po objednávku si prídeš osobne"
  }</b>.</p>
  <p>Dobrú chuť ti praje tím Vietown!</p>`;

  const mailData = {
    from: "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: "Nová objednávka - VIETOWN",
    text: htmlToText(htmlMessage),
    html: htmlMessage,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.VIETOWN_SMTP_HOST,
    port: process.env.VIETOWN_SMTP_PORT,
    auth: {
      user: process.env.VIETOWN_SMTP_USERNAME,
      pass: process.env.VIETOWN_SMTP_PASSWORD,
    },
    secure: true,
  });

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/vietown-status", (req, res) => {
  const { email, name, isDelivery } = req.body;
  const mailData = {
    from: "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: "Vaša objednávka",
    text: "Hello, this is text",
    html:
      "<b>Hey " +
      name +
      "</b><br> This is our first message sent with Nodemailer",
  };

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.USERNAME, pass: process.env.PASSWORD },
    secure: true,
  });

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});
