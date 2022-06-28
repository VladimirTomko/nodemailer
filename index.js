import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import htmlToText from "html-to-text";
import cors from "cors";

//const express = require("express");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// const htmlToText = require("html-to-text");
// const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = 8800;
app.use("/mail", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

route.get("/", (req, res) => {
  res.status(200).send("Hello World");
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
    text: htmlToText.htmlToText(htmlMessage),
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
