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
  msgBody = req.body;

  console.log("Webhook triggered:", JSON.stringify(msgBody));

  // const message = `Webhook triggered:\n\n${msgBody}`;

  let message;

  if (msgBody[0].from == "0x498098ca1b7447fc5035f95b80be97ee16f82597") {
    message = `ETH sent from my wallet!\nTo:${msgBody[0].to}\nAmount: ${msgBody[0].value} ETH\n\nDetails: https://goerli.etherscan.io/tx/${msgBody[0].hash}`;
  }

  if (msgBody[0].to == "0x498098ca1b7447fc5035f95b80be97ee16f82597") {
    message = `ETH sent to my wallet!\nFrom:${msgBody[0].from}\nAmount: ${msgBody[0].value} ETH\n\nDetails: https://goerli.etherscan.io/tx/${msgBody[0].hash}`;
  }

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

  res.send(JSON.stringify(msgBody));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook listener running on port ${port}`);
});
