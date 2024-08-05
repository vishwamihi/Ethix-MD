import config from '../../config.cjs';

const gcEvent = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'welcome') {
    if (!m.isGroup) return m.reply("*𝙾𝙽𝙻𝚈 𝙾𝚆𝙽𝙴𝚁 𝙲𝙰𝙽 𝚄𝚂𝙴 𝙸𝙽 𝙶𝚁𝙾𝚄𝙿 ❗");
    const groupMetadata = await Matrix.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*𝙱𝙾𝚃 𝙼𝚄𝚂𝚃 𝙱𝙴 𝙰𝙽 𝙰𝙳𝙼𝙸𝙽 𝚃𝙾 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❗*");
    if (!senderAdmin) return m.reply("*𝚈𝙾𝚄 𝙼𝚄𝚂𝚃 𝙱𝙴 𝙰𝙽 𝙰𝙳𝙼𝙸𝙽 𝚃𝙾 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❗*");
    let responseMessage;

    if (text === 'on') {
      config.WELCOME = true;
      responseMessage = "𝚆𝙴𝙻𝙲𝙾𝙼𝙴 & 𝙻𝙴𝙵𝚃 𝙸𝚂 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ✅";
    } else if (text === 'off') {
      config.WELCOME = false;
      responseMessage = "𝚆𝙴𝙻𝙲𝙾𝙼𝙴 & 𝙻𝙴𝙵𝚃 𝙸𝚂 𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ❌";
    } else {
      responseMessage = "Usage:\n- `WELCOME on`: 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 & 𝙻𝙴𝙵𝚃 𝙸𝚂 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ✅\n- `WELCOME off`: 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 & 𝙻𝙴𝙵𝚃 𝙸𝚂 𝙽𝙾𝚃 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 ❌";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: '𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕.' }, { quoted: m });
    }
  }
};

export default gcEvent;
