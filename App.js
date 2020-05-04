//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'ここにBotのToken(botのアカウント作ったら)'
client.on('ready', () => {
  console.log('ready...')
});
//Bot自身の発言を無視する呪い
client.on('message', message => {
  if(message.author.bot){
    return;
  }
  //↓ここに後述のコードをコピペする↓
if (message.content.match(/レムリソ/)) {
  let channel = message.channel;
  let author = message.author.username;
  let reply_text =`あなたは禁止ワードを使用しました`;
  message.reply(reply_text)
      .then(message => console.log(`Sent message: ${reply_text}`))
      .catch(console.error);
  return;
}
  //↑ここに後述のコードをコピペする↑
});
client.login(token);
