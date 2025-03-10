const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https'); // For pinging your bot's URL

// Replace with your bot token
const BOT_TOKEN = process.env.BOT_TOKEN;
const YOUR_USER_ID = process.env.USER_ID; // Replace with your Telegram user ID
// const BOT_TOKEN = '7831874636:AAHS4n21kfr8o4hf4w9P6k3vJ6BQzcnArfo'; // Replace with your actual bot token
// const YOUR_USER_ID = 7442373348; // Replace with your Telegram user ID
// const YOUR_USER_ID = 7575062666; // Replace with your Telegram user ID

// Initialize the bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Create a map to track users and the timeout for message reset
const userMessagesSent = new Map();
const messageTimeout = 12 * 1000;

// Listen for messages
bot.on('message', async (msg) => {
  const senderName = msg.chat.first_name || 'Unknown';
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
      const downloadDir = path.join(__dirname, 'downloads');
      fs.mkdirSync(downloadDir, { recursive: true }); // Create directory if it doesn't exist

      const filePath = await bot.downloadFile(fileId, downloadDir);
      console.log(`File downloaded to: ${filePath}`);

      // Send the photo to your user ID
      bot.sendPhoto(YOUR_USER_ID, filePath);
    } catch (error) {
      console.error('Error downloading or sending the photo:', error);
    }
  }
});

// Notify that the bot is running
console.log('Bot is running...');

// Get the port from the environment or default to 3000
const PORT = process.env.PORT || 3000;

// Create an HTTP server to listen on the specified port
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running.\n');
  })
  .listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });

// Function to ping your bot's URL every 15 seconds
const pingURL = () => {
  const url = `https://${process.env.PROJECT_DOMAIN}.glitch.me/`; // Replace with your Glitch project URL
  https.get(url, (res) => {
    console.log(`Pinged ${url} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`Error pinging ${url}:`, err);
  });
};

// Start pinging the bot every 15 seconds
setInterval(pingURL, 15000);


// const TelegramBot = require('node-telegram-bot-api');
// const fs = require('fs');
// const path = require('path');
// const http = require('http');

// // Replace with your bot token
// // const BOT_TOKEN = process.env.TELEGRAM_TOKEN
// const BOT_TOKEN = '7831874636:AAHS4n21kfr8o4hf4w9P6k3vJ6BQzcnArfo'; // Replace with your actual bot token
// // const YOUR_USER_ID = 7442373348; // Replace with your Telegram user ID
// const YOUR_USER_ID = 7575062666; // Replace with your Telegram user ID

// // Initialize the bot
// const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// // Create a map to track users and the timeout for message reset
// const userMessagesSent = new Map();
// const messageTimeout = 12 * 1000;

// // Listen for messages
// bot.on('message', async (msg) => {
//   const senderName = msg.chat.first_name || 'Unknown';
//   const chatId = msg.chat.id;

//   // Check if the message contains a photo
//   if (msg.photo) {
//     // Check if we already sent a message for this user
//     if (!userMessagesSent.has(chatId)) {
//       // Mark that we have sent the message and send the description
//       userMessagesSent.set(chatId, true);
//       bot.sendMessage(YOUR_USER_ID, `New photo received from ${senderName}:`);

//       // Reset the flag after the timeout
//       setTimeout(() => {
//         userMessagesSent.delete(chatId); // Remove the flag after the timeout
//       }, messageTimeout);
//     }

//     // Get the highest resolution photo
//     const fileId = msg.photo[msg.photo.length - 1].file_id;

//     try {
//       // Download the file to a local directory
//       const downloadDir = path.join(__dirname, 'downloads');
//       fs.mkdirSync(downloadDir, { recursive: true }); // Create directory if it doesn't exist

//       const filePath = await bot.downloadFile(fileId, downloadDir);
//       console.log(`File downloaded to: ${filePath}`);

//       // Send the photo to your user ID
//       bot.sendPhoto(YOUR_USER_ID, filePath);
//     } catch (error) {
//       console.error('Error downloading or sending the photo:', error);
//     }
//   }
// });

// // Notify that the bot is running
// console.log('Bot is running...');

// // Get the port from Heroku environment or default to 3000
// const PORT = process.env.PORT || 3000;

// // Create an HTTP server to listen on the specified port
// http
//   .createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Bot is running.\n');
//   })
//   .listen(PORT, () => {
//     console.log(`HTTP server running on port ${PORT}`);
//   });




