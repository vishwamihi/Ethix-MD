import config from '../../config.cjs';

const autodlCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autodl') {
    if (!isCreator) return m.reply("*💀 𝐎𝐍𝐋𝐘 𝐎𝐖𝐍𝐄𝐑𝐒**");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_DL = true;
      responseMessage = 𝙰𝚄𝚃𝙾-𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙸𝚂 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ✅";
    } else if (text === 'off') {
      config.AUTO_DL = false;
      responseMessage = "𝙰𝚄𝚃𝙾-𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙸𝚂  𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ❌ ";
    } else {
      responseMessage = "Usage:\n- `autodl on`: 𝙰𝚄𝚃𝙾-𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙸𝚂 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ✅\n- `autodl off`: 𝙰𝚄𝚃𝙾-𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙸𝚂  𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ❌";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: '𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕.' }, { quoted: m });
    }
  }
};

export default autodlCommand;
