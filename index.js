require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies

// Webhook endpoint
app.post("/", (req, res) => {
  msgBody = JSON.stringify(req.body);
  sent_to = req.body.to;
  sent_from = req.body.from;
  sent_value = req.body.value;
  sent_hash = req.body.hash;

  // res.send(JSON.stringify(msgBody));

  console.log("Webhook triggered:", JSON.stringify(msgBody));

  let message;

  message = `${msgBody}\n$To: ${sent_to}\nFrom: ${sent_from}\nAmount: ${sent_value}\n\nDetails: https://goerli.etherscan.io/tx/${sent_hash}`;

  bot
    .sendMessage(chatId, message)
    .then(() => {
      console.log("Telegram notification sent");
      res.sendStatus(200); // Acknowledge receipt of the webhook
    })
    .catch((error) => {
      console.error("Error sending Telegram notification:", error);
      res.sendStatus(500); // Internal Server Error
    });

  // res.send(JSON.stringify(msgBody));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook listener running on port ${port}`);
});
