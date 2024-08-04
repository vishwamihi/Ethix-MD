import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'alwaysonline') {
    if (!isCreator) return m.reply("*💀 𝐎𝐍𝐋𝐘 𝐎𝐖𝐍𝐄𝐑𝐒*");
    let responseMessage;

    if (text === 'on') {
      config.ALWAYS_ONLINE = true;
      responseMessage = "𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 𝙸𝚂 𝚆𝙾𝚁𝙺𝙸𝙽𝙶";
    } else if (text === 'off') {
      config.ALWAYS_ONLINE = false;
      responseMessage = "𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 𝙸𝚂 𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶";
    } else {
      responseMessage = "𝚄𝚂𝙰𝙶𝙴:\n- `alwaysonline on`: 𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 𝚆𝙾𝚁𝙺𝙸𝙽𝙶\n- `alwaysonline off`: 𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default alwaysonlineCommand;
