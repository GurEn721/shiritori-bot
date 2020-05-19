/* しりとり用チャンネルにメッセージが送信されたときの処理 A ~ F */
module.exports = async function shiritori(message) {
  const [judg, reading, previousData] = await judgMessage(message);
  switch (judg) {
    /* OK */
    case 'A':
      addMessage(message, reading);
      break;
    /* NG 文章 */
    case 'B':
      sendMessage(message, `:x:｢ **${message.content}** ｣ は文章のためNGです\n基本的なしりとりのルールすら知らないことに驚きを隠せません\nこれは社内規則違反であります\n異議申し立ての場合には印鑑とともに書面にて届け出を出して下さい${toggleFirstMessage(previousData)}`);
      break;
    /* NG 名詞以外 */
    case 'C':
      sendMessage(message, `:x:｢ **${message.content}** ｣ は名詞以外のためNGです\nあなたはクラマスに認定されました\nこの判定が不服な場合には即座に異議申し立てを行ってください${toggleFirstMessage(previousData)}`);
      break;
    /* NG 'ン'で終わる */
    case 'D':
      sendMessage(message, `:x:｢ **${message.content}** ｣ は'ン'で終っているためNGです\nこれは重大な社内規則違反であるためあなたはクラマスに認定されました\nこの判定が不服な場合にはクラマス認定審議会へ正式な書面に印鑑を添えて異議申し立てを行ってください${toggleFirstMessage(previousData)}`);
      break;
    /* NG 直前の単語とつながっていない */
    case 'E':
      sendMessage(message, `:x:｢ **${message.content}** ｣ は直前の単語とつながっていないためNGです\n この判定が不服の場合にはクラマス認定審議会に異議申し立てを行うか、クランメンバー全員に詫びダブロンを送ってください${toggleFirstMessage(previousData)}`);
      break;
    /* NG 既出 */
    case 'F':
      sendMessage(message, `:x:｢ **${message.content}** ｣ は既に答えられているためNGです\n社内規則に則ってクラマスに認定されました\nこの判定が不服な場合にはクラマス認定審議会へ正式な書面に印鑑を添えて異議申し立てを行ってください${toggleFirstMessage(previousData)}`);
      break;
    /**クラマス対策 */
    case `G`:
      sendMessage(message, `:x:｢ **${message.content}** ｣ は禁止ワードです\nあなたは社内規則の禁忌を犯しました\nあなたには一切の権利はなく弊社の代表取締役社長に任命されます${toggleFirstMessage(previousData)}`);
  }
}

function judgMessage(message){
  return new Promise(async(resolve)=>{
    const parsedContent = mecab.parseSync(message.content);
    let judg = 'A', reading = parsedContent[0][8], previousData = await getPreviousData(message);
    /* 1単語の場合 OK */
    if(parsedContent.length === 1){
      [judg, previousData] = await judgMessage2(message, judg, parsedContent[0], previousData);
    }
    /* 文章の場合 NG */
    else{
      judg = 'B';
    }
    resolve([judg, reading, previousData]);
  });
};

function judgMessage2(message, judg, parsedContent, previousData){
  console.log('2次判定処理');
  return new Promise(async(resolve)=>{
    /* 名詞の場合 OK */
    if(parsedContent[1] === '名詞'){
      [judg, previousData] = await judgMessage3(message, judg, parsedContent, previousData);
    }
    /* 名詞以外の場合 NG */
    else{
      judg = 'C';
    }
    resolve([judg, previousData]);
  });
};

function judgMessage3(message, judg, parsedContent, previousData){
  console.log('3次判定処理');
  return new Promise(async(resolve)=>{

    // TODO "ー"で終わる単語の処理

    /* 'ン'で終わらない場合 OK */
    if(parsedContent[8].slice(-1) !== 'ン'){
      [judg, previousData] = await judgMessage4(message, judg, parsedContent, previousData);
    }
    /* 'ン'で終わる場合 NG */
    else{
      judg = 'D';
    }
    resolve([judg, previousData]);
  });
};

function judgMessage4(message, judg, parsedContent, previousData){
  console.log('4次判定処理');
  return new Promise((resolve)=>{
    Message.findOne({
      where: {
        channel_id: message.channel.id
      },
      order:[['id','DESC']]
    }).then(async(previousMessage)=>{
      /* DBに単語が保存されていない場合 OK */
      if(previousMessage === null){
        judg = judg;
      }
      /* 直前の単語とつながっている場合 OK */
      else if(previousMessage.dataValues.reading.slice(-1) === parsedContent[8].slice(0, 1)){
        judg = await judgMessage5(message, judg);
        previousData = previousMessage.dataValues;
      }
      /* 直前の単語とつながっていない場合 NG */
      else{
        judg = 'E';
      }
      resolve([judg, previousData]);
    });
  });
};

function judgMessage5(message, judg){
  console.log('5次判定処理');
  return new Promise((resolve)=>{
    Message.findOne({
      where: {
        channel_id: message.channel.id,
        message: message.content
      }
    }).then(async(Previously)=>{
      /* 新規単語の場合 OK */
      if(Previously === null){
      [judg, previousData] = await judgMessage6(message, judg, parsedContent, previousData);
      }
      /* 既出単語の場合 NG */
      else{
        judg = 'F'
      }
      resolve([judg, previousData]);
    });
  });
};

function judgMessage6(message, judg, parsedContent, previousData){
  console.log('6次判定処理');
  return new Promise(async(resolve)=>{

    // TODO クラマス対策

    /* 禁止ワード以外 OK */
    if(message.content.endsWith(レムリソ || ンドソ || ンシャソ)) {
      judg = `G`;
    } else {
      judg = judg;
    }
  });
}

function sendMessage(message, text){
  message.channel.fetchMessages({limit: 100}).then(messages=>{
    let botMessages = messages.filter(m=>m.author.bot && m.embeds !== [] && m.content !== '');
    if(Array.from(botMessages)[0]){
      let botMessage = Array.from(botMessages)[0][1];
      message.channel.send(text).then(botMessage.delete());
    }else{
      message.channel.send(text);
    }
  });
};