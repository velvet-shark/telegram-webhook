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

  console.log("Webhook triggered:", JSON.stringify(msgBody));

  // const message = `Webhook triggered:\n\n${msgBody}`;

  if msgBody.from == "0x498098ca1b7447fc5035f95b80be97ee16f82597" {
    message = `ETH sent from my wallet!\nTo:${msgBody.to}\nAmount: ${msgBody.value} ETH\n\nDetails: https://goerli.etherscan.io/tx/${msgBody.hash}`;
  }

  if msgBody.to == "0x498098ca1b7447fc5035f95b80be97ee16f82597" {
    message = `ETH sent to my wallet!\nFrom:${msgBody.from}\nAmount: ${msgBody.value} ETH\n\nDetails: https://goerli.etherscan.io/tx/${msgBody.hash}`;
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
