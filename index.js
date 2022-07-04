import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import htmlToText from "html-to-text";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = 8800;
app.use("/mail", route);

const transporter = nodemailer.createTransport({
  host: process.env.VIETOWN_SMTP_HOST,
  port: process.env.VIETOWN_SMTP_PORT,
  auth: {
    user: process.env.VIETOWN_SMTP_USERNAME,
    pass: process.env.VIETOWN_SMTP_PASSWORD,
  },
  secure: true,
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

route.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

route.post("/vietown-new", (req, res) => {
  const { email, name, total, items, isDelivery, paymentType, isEuphoria } =
    req.body;
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
  <p>Dobrú chuť ti praje tím ${isEuphoria ? "Euphoria" : "Vietown"}!</p>`;

  const mailData = {
    from: isEuphoria
      ? "Euphoria <restauracia@euphoria-food.sk"
      : "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Nová objednávka - ${isEuphoria ? "EUPHORIA" : "VIETOWN"}`,
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
  const { email, name, status, isEuphoria } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvojej objednávke sa zmenil stav na: </p>
  <h3>${status}</h3>
  <p>Dobrú chuť ti praje tím ${isEuphoria ? "Euphoria" : "Vietown"}!</p>`;

  const mailData = {
    from: isEuphoria
      ? "Euphoria <restauracia@euphoria-food.sk"
      : "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Zmena stavu objednávky - ${status}`,
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
  const { email, name, isEuphoria } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Ďakujeme za registráciu.</p>
  <p>Ako bonus sme ti na účet pripísali 10% zľavu na ďalšiu objednávku, ktorá sa ti automaticky pripíše.</ú>
  <p>Dobrú chuť ti praje tím ${isEuphoria ? "Euphoria" : "Vietown"}!</p>`;

  const mailData = {
    from: isEuphoria
      ? "Euphoria <restauracia@euphoria-food.sk"
      : "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Nový účet - ${isEuphoria ? "EUPHORIA" : "VIETOWN"}`,
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
  const { email, name, invitedName, isEuphoria } = req.body;
  const htmlMessage = `<h3>Ahoj ${name}</h3>
  <p>Tvoj kamarát ${invitedName} sa zaregistroval cez tvoj link a obidvaja ste od nás získali 10% zľavu na ďalšiu objednávku!</p>
  <p>Dobrú chuť ti praje tím ${isEuphoria ? "Euphoria" : "Vietown"}!</p>`;

  const mailData = {
    from: isEuphoria
      ? "Euphoria <restauracia@euphoria-food.sk"
      : "Vietown <restauracia@vietown.sk>",
    to: email,
    subject: `Získal si zľavu 10% - ${isEuphoria ? "EUPHORIA" : "VIETOWN"}`,
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
