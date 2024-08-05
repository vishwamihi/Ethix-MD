import axios from 'axios';


const stickerCommandHandler = async (m, gss) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  
  const stickerCommands = ['cry', 'kiss', 'kill', 'kick', 'hug', 'pat', 'lick', 'bite', 'yeet', 'bully', 'bonk', 'wink', 'poke', 'nom', 'slap', 'smile', 'wave', 'awoo', 'blush', 'smug', 'dance', 'happy', 'sad', 'cringe', 'cuddle', 'shinobu', 'handhold', 'glomp', 'highfive'];

  if (stickerCommands.includes(cmd)) {
    const packname = `DARK-RIO-MD`;
    const author = 'DARK-RIO-BROTHERS';

    try {
      const { data } = await axios.get(`https://api.waifu.pics/sfw/${cmd}`);
      if (data && data.url) {
        gss.sendImageAsSticker(m.from, data.url, m, { packname, author });
      } else {
        m.reply('𝑬𝒓𝒓𝒐𝒓 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝒔𝒕𝒊𝒄𝒌𝒆𝒓.');
      }
    } catch (error) {
      console.error('Error fetching sticker:', error);
      m.reply('𝑬𝒓𝒓𝒐𝒓 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝒔𝒕𝒊𝒄𝒌𝒆𝒓.');
    }
  }
};

export default stickerCommandHandler;
