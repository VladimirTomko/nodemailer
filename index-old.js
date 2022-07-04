import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import htmlToText from "html-to-text";
import nodemailer from "nodemailer";
import cors from "cors";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = 8800;

app.options("*", cors());
app.use("/mail", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

route.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

route.post("/vietown-new", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.VIETOWN_SMTP_USERNAME,
      pass: process.env.VIETOWN_SMTP_PASSWORD,
    },
    secure: true,
  });
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
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/vietown-status", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.VIETOWN_SMTP_USERNAME,
      pass: process.env.VIETOWN_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name, status } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvojej objednávke sa zmenil stav na: </p>
  <h3>${status}</h3>
  <p>Dobrú chuť ti praje tím Vietown!</p>`;

  const mailData = {
    from: "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Zmena stavu objednávky - ${status.toUpperCase()}`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/vietown-new-account", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.VIETOWN_SMTP_USERNAME,
      pass: process.env.VIETOWN_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Ďakujeme za registráciu.</p>
  <p>Ako bonus sme ti na účet pripísali 10% zľavu na ďalšiu objednávku, ktorá sa ti automaticky pripíše.</ú>
  <p>Dobrú chuť ti praje tím Vietown!</p>`;

  const mailData = {
    from: "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Nový účet - VIETOWN`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/vietown-refferal", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.VIETOWN_SMTP_USERNAME,
      pass: process.env.VIETOWN_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name, invitedName } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvoj kamarát ${invitedName} sa zaregistroval cez tvoj link a obidvaja ste od nás získali 10% zľavu na ďalšiu objednávku!</p>
    <p>Dobrú chuť ti praje tím Vietown!</p>`;

  const mailData = {
    from: "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Získal si zľavu 10% - VIETOWN`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/euphoria-new", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EUPHORIA_SMTP_USERNAME,
      pass: process.env.EUPHORIA_SMTP_PASSWORD,
    },
    secure: true,
  });
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
  <p>Dobrú chuť ti praje tím Euphoria!</p>`;

  const mailData = {
    from: "Euphoria <restauracia@euphoria-food.sk>",
    to: email,
    subject: "Nová objednávka - EUPHORIA",
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/euphoria-status", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EUPHORIA_SMTP_USERNAME,
      pass: process.env.EUPHORIA_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name, status } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvojej objednávke sa zmenil stav na: </p>
  <h3>${status}</h3>
  <p>Dobrú chuť ti praje tím Euphoria!</p>`;

  const mailData = {
    from: "Euphoria <restauracia@euphoria-food.sk>",
    to: email,
    subject: `Zmena stavu objednávky - ${status.toUpperCase()}`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/euphoria-new-account", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EUPHORIA_SMTP_USERNAME,
      pass: process.env.EUPHORIA_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Ďakujeme za registráciu.</p>
  <p>Ako bonus sme ti na účet pripísali 10% zľavu na ďalšiu objednávku, ktorá sa ti automaticky pripíše.</ú>
  <p>Dobrú chuť ti praje tím Euphoria!</p>`;

  const mailData = {
    from: "Euphoria <restauracia@euphoria-food.sk>",
    to: email,
    subject: `Nový účet - EUPHORIA`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});

route.post("/euphoria-refferal", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EUPHORIA_SMTP_USERNAME,
      pass: process.env.EUPHORIA_SMTP_PASSWORD,
    },
    secure: true,
  });
  const { email, name, invitedName } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvoj kamarát ${invitedName} sa zaregistroval cez tvoj link a obidvaja ste od nás získali 10% zľavu na ďalšiu objednávku!</p>
    <p>Dobrú chuť ti praje tím Euphoria!</p>`;

  const mailData = {
    from: "Euphoria <restauracia@euphoria-food.sk>",
    to: email,
    subject: `Získal si zľavu 10% - EUPHORIA`,
    text: htmlToText.htmlToText(htmlMessage),
    html: htmlMessage,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      res.status(500).send({ success: false });
      return console.log(error);
    }
    res.status(200).send({ success: true, message_id: info.messageId });
  });
});
