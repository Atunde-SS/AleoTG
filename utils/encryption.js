const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;
const encryptionAlgorithm = 'aes-256-cbc';

// Generate an encryption key based on the user's Telegram ID and a secret key
function generateEncryptionKey(telegramId) {
  const secretKey = process.env.SECRET_KEY; // Ensure this is set in your environment variables
  if (!secretKey) {
    throw new Error('SECRET_KEY environment variable is not set.');
  }
  const hash = crypto.createHash('sha256');
  hash.update(`${telegramId}${secretKey}`);
  return hash.digest('hex').substr(0, 32); // Use the first 32 bytes of the hash as the key
}

// Encrypt text using the user's Telegram ID
async function encrypt(text, telegramId) {
  const key = generateEncryptionKey(telegramId);
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv(encryptionAlgorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt text using the user's Telegram ID
async function decrypt(encryptedText, telegramId) {
  const key = generateEncryptionKey(telegramId);
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };