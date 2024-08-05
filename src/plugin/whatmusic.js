import fs from 'fs';
import acrcloud from 'acrcloud';

// Initialize ACRCloud client with your credentials
const acr = new acrcloud({
host: 'identify-eu-west-1.acrcloud.com',
access_key: '716b4ddfa557144ce0a459344fe0c2c9',
access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
});

const shazam = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['shazam', 'find', 'whatmusic'];
    if (!validCommands.includes(cmd)) return;
    
    const quoted = m.quoted || {}; 

    if (!quoted || (quoted.mtype !== 'audioMessage' && quoted.mtype !== 'videoMessage')) {
      return m.reply('𝒀𝒐𝒖 𝒂𝒔𝒌𝒆𝒅 𝒂𝒃𝒐𝒖𝒕 𝒎𝒖𝒔𝒊𝒄. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒒𝒖𝒐𝒕𝒆𝒅 𝒂𝒖𝒅𝒊𝒐 𝒐𝒓 𝒗𝒊𝒅𝒆𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝒊𝒅𝒆𝒏𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏.');
    }

    const mime = m.quoted.mimetype;
    try {
      const media = await m.quoted.download();
      const filePath = `./${Date.now()}.mp3`;
      fs.writeFileSync(filePath, media);

      m.reply('𝑰𝒅𝒆𝒏𝒕𝒊𝒇𝒚𝒊𝒏𝒈 𝒕𝒉𝒆 𝒎𝒖𝒔𝒊𝒄, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...');

      const res = await acr.identify(fs.readFileSync(filePath));
      const { code, msg } = res.status;

      if (code !== 0) {
        throw new Error(msg);
      }

      const { title, artists, album, genres, release_date } = res.metadata.music[0];
      const txt = `𝗗𝗔𝗥𝗞-𝗥𝗜𝗢-𝗠𝗗 𝗥𝗘𝗦𝗨𝗟𝗧
      • 💌 𝗧𝗜𝗧𝗟𝗘: ${title}
      • 👨‍🎤 𝗔𝗥𝗧𝗜𝗦𝗧: ${artists ? artists.map(v => v.name).join(', ') : 'NOT FOUND'}
      • 💾 𝗔𝗟𝗕𝗨𝗠: ${album ? album.name : 'NOT FOUND'}
      • 🌐 𝗚𝗘𝗡𝗥𝗘: ${genres ? genres.map(v => v.name).join(', ') : 'NOT FOUND'}
      • 📆 𝗥𝗘𝗟𝗘𝗔𝗦𝗘 𝗗𝗔𝗧𝗘: ${release_date || 'NOT FOUND'}
      `.trim();

      fs.unlinkSync(filePath);
      m.reply(txt);
    } catch (error) {
      console.error(error);
      m.reply('𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒅𝒖𝒓𝒊𝒏𝒈 𝒎𝒖𝒔𝒊𝒄 𝒊𝒅𝒆𝒏𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏.');
    }
  } catch (error) {
    console.error('Error:', error);
    m.reply('𝑨𝒏 𝑬𝒓𝒓𝒐𝒓 𝑶𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝑾𝒉𝒊𝒍𝒆 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝑻𝒉𝒆 𝑪𝒐𝒎𝒎𝒂𝒏𝒅.');
  }
};

export default shazam;
