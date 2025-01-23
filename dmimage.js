const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
// const http = require("http");
const https = require("https"); // For pinging your bot's URL

// Replace with your bot token
const BOT_TOKEN = process.env.BOT_TOKENS;
const YOUR_USER_ID = process.env.USER_ID; // Replace with your Telegram user ID

// Initialize the bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Create a map to track users and the timeout for message reset
const userMessagesSent = new Map();
const messageTimeout = 12 * 1000;

// Listen for messages
bot.on("message", async (msg) => {
  const senderName = msg.chat.first_name || "Unknown";
  const chatId = msg.chat.id;

  // Check if the message contains a photo
  if (msg.photo) {
    // Check if we already sent a message for this user
    if (!userMessagesSent.has(chatId)) {
      // Mark that we have sent the message and send the description
      userMessagesSent.set(chatId, true);
      bot.sendMessage(YOUR_USER_ID, `New photo received from ${senderName}:`);

      // Reset the flag after the timeout
      setTimeout(() => {
        userMessagesSent.delete(chatId); // Remove the flag after the timeout
      }, messageTimeout);
    }

    // Get the highest resolution photo
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    try {
      // Download the file to a local directory
      const downloadDir = path.join(__dirname, "downloads");
      fs.mkdirSync(downloadDir, { recursive: true }); // Create directory if it doesn't exist

      const filePath = await bot.downloadFile(fileId, downloadDir);
      console.log(`File downloaded to: ${filePath}`);

      // Send the photo to your user ID
      bot.sendPhoto(YOUR_USER_ID, filePath);
    } catch (error) {
      console.error("Error downloading or sending the photo:", error);
    }
  }
});

// Notify that the bot is running
console.log("Bot is running...");

const pingURL = () => {
  // const url = `https://temporal-shrouded-jersey.glitch.me/`;
  const url = `https://glitch.com/edit/#!/temporal-shrouded-jersey`;
  
  const options = {
    method: 'HEAD', // Lighter request
    timeout: 5000   // Short timeout
  };

  https.request(url, options, (res) => {
    console.log(`Pinged ${url} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`Ping error: ${err.message}`);
  }).end();
};

// Start pinging the bot every 15 seconds
setInterval(pingURL, 15000);
