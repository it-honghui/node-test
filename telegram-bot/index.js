const TelegramBot = require('node-telegram-bot-api');

const token = 'your token';
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/boy/, function onLoveText(msg) {
    bot.sendMessage(msg.chat.id, 'Are you a boy?');
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});