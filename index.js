`use strict`;

/** モジュールの読み込み */
const Discord = require(`discord.js`);
const shiritori = require('./lib/shiritori');
const command = require('./lib/command');

/** clientインスタンス作成 */
const client = new Discord.Client();

/** モデルの読み込み */
const Message = require(`./models/message`);
const Channel = require(`./models/cjannel`);
Message.sync();
Channel.synt();

/* 起動時の処理 */
client.on('ready', ()=>{
  /* ログ出力 */
  console.log(`Logged in as ${client.user.tag}`);
})

/* ログイン */
const token = 'NzExMTU3MTc3NjU3ODUxOTM0.XsOr_A.Nw_mWEI1An6nB9b-RDY0YfVUwZk'; //ここにTOKENを入れる
client.login(token);

/**メッセージを受け取った時の処理 */
client.on(`message`, message => {
  /**bot自身の発言を無視する呪い */
  if(message.author.bot)
  return;
  /**しりとり用チャンネル以外の発言を無視 */
  Channel.findOne({
    where: {
      id: message.channel.id
    }
  }).then(channel => {
    /**しりとりチャンネルでの発言の場合 */
    if(channel !== null){
      /* `//`から始まる発言を無視 */
      if(message.content.startsWith(`//`)) 
      return;
      /* 最新の単語の最初の文字が'!'の場合 コマンド実行 */
      if(message.content.startsWith(`!`)){
        command(message);
        return;
      }
      shiritori(message);
    }else
    /* 最新の単語の最初の文字が'!add'の場合 コマンド実行 */
    if(message.content.startsWith('!add')){
      command(message);
    }
  });
});

