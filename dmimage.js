const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Replace with your bot token
const BOT_TOKEN = '7831874636:AAHS4n21kfr8o4hf4w9P6k3vJ6BQzcnArfo'; // Replace with your actual bot token
const YOUR_USER_ID = 7442373348; // Replace with your Telegram user ID

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


