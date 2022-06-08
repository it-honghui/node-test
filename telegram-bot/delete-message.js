const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

// https://api.telegram.org/bot5218594007:AAEmv5n6VahO6UTlHxM5rkOVlyESFaJdg4c/getUpdates
const token = '5218594007:AAEmv5n6VahO6UTlHxM5rkOVlyESFaJdg4c';
const bot = new TelegramBot(token, {
    polling: true,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: 7890
        }
    }
});

bot.getMe()
    .then(console.log)
    .catch(console.err);

bot.onText(/\/hi/, function onText(msg) {
    console.log(msg.chat.id)
    console.log(msg.message_id)
    bot.sendMessage(msg.chat.id, 'How are you?');
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/del (.+)/, (msg, match) => {
    console.log(msg.chat.id)
    console.log(msg.message_id)
    bot.deleteMessage(msg.chat.id, match[1]);
});

bot.onText(/\/delall/, function onText(msg) {
    console.log(msg.chat.id)
    console.log(msg.message_id)
    for (let i = 0; i < msg.message_id; i++) {
        bot.deleteMessage(msg.chat.id, i);
    }
});

bot.onText(/\/getUpdates/, function onText(msg) {
    console.log(msg.chat.id)
    console.log(msg.message_id)
    bot.getUpdates()
        .then(console.log)
        .catch(console.err);
});