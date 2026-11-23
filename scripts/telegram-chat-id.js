// scripts/telegram-chat-id.js
// Affiche ton TELEGRAM_CHAT_ID.
// 1. Crée un bot avec @BotFather sur Telegram et copie son token dans .env.local (TELEGRAM_BOT_TOKEN=...)
// 2. Ouvre la conversation avec ton bot et envoie-lui un message (ex : /start)
// 3. Lance : npm run telegram:chat-id

const fs = require('fs');
const path = require('path');

const envLocal = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envLocal)) {
  try { process.loadEnvFile(envLocal); } catch (e) { /* ignoré */ }
}

(async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN manquant dans .env.local');
    process.exit(1);
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await res.json();
  if (!data.ok) {
    console.error('Erreur Telegram :', data.description);
    process.exit(1);
  }
  const chats = new Map();
  data.result.forEach(u => {
    const chat = (u.message || u.channel_post || {}).chat;
    if (chat) chats.set(chat.id, chat.first_name || chat.title || chat.username || '');
  });
  if (chats.size === 0) {
    console.log('Aucun message reçu : envoie d\'abord un message à ton bot sur Telegram, puis relance.');
    return;
  }
  chats.forEach((name, id) => console.log(`TELEGRAM_CHAT_ID=${id}   (${name})`));
})();
