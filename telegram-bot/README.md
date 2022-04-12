# telegram-bot

## 一、安装依赖
```shell
npm i
npm i pm2 -g
pm2 start index-prod.js --name bot
```

## 二、两种模式
- index.js 本地使用 polling 轮询
- index-prod.is 线上使用 webhook 