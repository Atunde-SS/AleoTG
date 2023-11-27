require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const { encrypt, decrypt } = require('./utils/encryption');

// Dynamic import for ES modules
let Account, AleoNetworkClient;
(async () => {
  const aleoSDK = await import('@aleohq/sdk');
  Account = aleoSDK.Account;
  AleoNetworkClient = aleoSDK.AleoNetworkClient;

// Check for required environment variables
if (!process.env.MONGODB_URI || !process.env.TELEGRAM_BOT_TOKEN) {
    console.error('Error: The MONGODB_URI and TELEGRAM_BOT_TOKEN environment variables must be set.');
    process.exit(1);
  }

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

// Define MongoDB user schema
const userSchema = new mongoose.Schema({
  userId: String,
  encryptedPrivateKey: String,
  publicKey: String,
  viewKey: String,
  language: { type: String, default: 'en' },
  notificationsEnabled: { type: Boolean, default: false },
});

// Method to handle wallet import and update
userSchema.statics.importOrUpdateWallet = async function(userId, privateKey, publicKey, viewKey) {
    const encryptedPrivateKey = await encrypt(privateKey, userId);
    const user = await this.findOne({ userId: userId });
    if (user) {
      user.encryptedPrivateKey = encryptedPrivateKey;
      user.publicKey = publicKey;
      user.viewKey = viewKey;
      await user.save();
    } else {
      const newUser = new this({
        userId: userId,
        encryptedPrivateKey: encryptedPrivateKey,
        publicKey: publicKey,
        viewKey: viewKey,
      });
      await newUser.save();
    }
  };

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

// Telegram bot setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const networkClient = new AleoNetworkClient('https://api.aleo.network');

// Start command
bot.onText(/^\/start$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to Panthr-B Aleo Wallet Bot!');
  });

// Help command updated with new features
bot.onText(/^\/help$/, (msg) => {
    const helpMessage = `
    Here are the commands you can use:
    /start - Welcome message and bot information
    /create_wallet - Create a new Aleo wallet
    /import_wallet <privateKey> - Import an existing Aleo wallet
    /balance <address> - Check the balance of a specified Aleo address (Coming soon)
    /send_transaction <fromPrivateKey> <toAddress> <amount> - Send a transaction from one address to another (Coming soon)
    /transaction_history <address> - Get the transaction history of a specified Aleo address (Coming soon)
    /set_language <languageCode> - Set your preferred language for bot interactions
    /toggle_notifications - Enable or disable notifications for your wallet
    /price - Get the current price of Aleo tokens (Coming soon)
    /network_stats - Display current Aleo network statistics (Coming soon)
    /ai-aleo-learn - Learn about the Aleo network with an AI teaching machine (Coming soon)
    /help - Show this help message
    `;
    bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
  });

// Create wallet command
bot.onText(/^\/create_wallet$/, async (msg) => {
  const account = new Account();
  const privateKey = account.privateKey();
  const viewKey = account.viewKey();
  const address = account.address();
  // Convert msg.from.id to a string before passing it to the encrypt function
  const encryptedPrivateKey = await encrypt(privateKey, msg.from.id.toString());

  const newUser = new User({
    userId: msg.from.id.toString(), // Ensure userId is stored as a string
    encryptedPrivateKey: encryptedPrivateKey,
    publicKey: address,
    viewKey: viewKey,
  });

  newUser.save()
    .then(() => bot.sendMessage(msg.chat.id, `Wallet created successfully!\nAddress: ${address}\nPlease write down your private key and keep it safe.`))
    .catch(err => bot.sendMessage(msg.chat.id, 'Error creating wallet. Please try again.'));
});

// Additional command handlers go here...

// AI Aleo Learn command
bot.onText(/\/ai-aleo-learn/, (msg) => {
    const comingSoonMessage = `
    *Coming soon: AI Aleo Learn*\n
    This feature will provide an interactive learning experience to teach users about the Aleo network and its capabilities. Stay tuned for updates!
    `;
    bot.sendMessage(msg.chat.id, comingSoonMessage, { parse_mode: 'Markdown' });
  });

  // Set language command
bot.onText(/\/set_language (.+)/, async (msg, match) => {
    const language = match[1].toLowerCase();
    const supportedLanguages = ['en', 'es', 'fr']; // Add more supported languages as needed
  
    if (supportedLanguages.includes(language)) {
      await User.updateOne({ userId: msg.from.id }, { language: language });
      bot.sendMessage(msg.chat.id, `Language updated to ${language}.`);
    } else {
      bot.sendMessage(msg.chat.id, `Language not supported. Please choose from the following: ${supportedLanguages.join(', ')}`);
    }
  });

  // Toggle notifications command
bot.onText(/\/toggle_notifications/, async (msg) => {
    const user = await User.findOne({ userId: msg.from.id });
    if (user) {
      const newNotificationSetting = !user.notificationsEnabled;
      await User.updateOne({ userId: msg.from.id }, { notificationsEnabled: newNotificationSetting });
      bot.sendMessage(msg.chat.id, `Notifications have been ${newNotificationSetting ? 'enabled' : 'disabled'}.`);
    } else {
      bot.sendMessage(msg.chat.id, `User not found. Please create a wallet first.`);
    }
  });

// View private key command
bot.onText(/\/view_private_key/, async (msg) => {
    const user = await User.findOne({ userId: msg.from.id });
    if (user) {
      const decryptedPrivateKey = await decrypt(user.encryptedPrivateKey, msg.from.id);
      bot.sendMessage(msg.chat.id, `Your private key is: ${decryptedPrivateKey}`);
    } else {
      bot.sendMessage(msg.chat.id, `No wallet found. Please create or import a wallet first.`);
    }
  });

  // Import wallet command
bot.onText(/^\/import_wallet (.+)$/, async (msg, match) => {
  const privateKey = match[1];
  try {
    const account = new Account(privateKey);
    const viewKey = account.viewKey();
    const address = account.address();
    // Convert msg.from.id to a string before passing it to the encrypt function
    const encryptedPrivateKey = await encrypt(privateKey, msg.from.id.toString());

    // Use the importOrUpdateWallet method to encapsulate the update or create logic
    await User.importOrUpdateWallet(msg.from.id.toString(), privateKey, address, viewKey);
    bot.sendMessage(msg.chat.id, `Wallet imported successfully!\nAddress: ${address}`);
  } catch (error) {
    bot.sendMessage(msg.chat.id, `Error importing wallet. Please check your private key and try again.`);
  }
});

  // Price tracking command
bot.onText(/\/price/, (msg) => {
    // Placeholder for price tracking logic
    bot.sendMessage(msg.chat.id, `Price tracking feature is coming soon.`);
  });
  
  // Network stats command
  bot.onText(/\/network_stats/, (msg) => {
    // Placeholder for network stats logic
    bot.sendMessage(msg.chat.id, `Network stats feature is coming soon.`);
  });

// Placeholder for balance check command
bot.onText(/\/balance (.+)/, async (msg, match) => {
  // Implement balance check logic when available
  bot.sendMessage(msg.chat.id, `Balance check feature is coming soon.`);
});

// Placeholder for send transaction command
bot.onText(/\/send_transaction (.+) (.+) (.+)/, async (msg, match) => {
  // Implement send transaction logic when available
  bot.sendMessage(msg.chat.id, `Send transaction feature is coming soon.`);
});

// Placeholder for transaction history command
bot.onText(/\/transaction_history (.+)/, async (msg, match) => {
  // Implement transaction history logic when available
  bot.sendMessage(msg.chat.id, `Transaction history feature is coming soon.`);
});

 // Connect to MongoDB and start the bot
 mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  bot.startPolling();
  console.log('Bot started');
}).on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
})();