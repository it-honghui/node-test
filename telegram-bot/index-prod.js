const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const TOKEN = 'your token';
const url = 'https://gathub.cn'; // 你自己的域名
const port = 9000;

const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${url}/bot${TOKEN}`);
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Express server is listening on ${port}`);
});

bot.onText(/\/boy/, function onLoveText(msg) {
    bot.sendMessage(msg.chat.id, 'Are you a boy?');
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});