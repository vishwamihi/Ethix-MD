import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
    if (['alive', 'uptime', 'runtime'].includes(cmd)) {

  const uptimeMessage = `𝐈'𝐌 𝐀𝐋𝐖𝐀𝐘𝐒 𝐀𝐋𝐈𝐕𝐄 !

𝗛𝗲𝘆 𝗗𝗔𝗥𝗞-𝗥𝗜𝗢-𝗠𝗗 𝗶𝘀 𝗼𝗻 𝗮𝗹𝗶𝘃𝗲 𝗺𝗼𝗱𝗲🦜

📡 ᴘʟᴀᴛꜰᴏʀᴍᴇ: Linux
🎓  ʀᴜɴᴛɪᴍᴇ: ${days}d ${hours}h ${minutes}m ${seconds}s

> 𝗧𝘆𝗽𝗲 .𝗺𝗲𝗻𝘂 𝘁𝗼 𝗴𝗲𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗹𝗶𝘀𝘁📃

"Amidst the complexity of technology, small developers find beauty in simplicity, crafting elegant solutions that make a big difference."

> *Follow us*
https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k

> 𝐃𝐀𝐑𝐊-𝐑𝐈𝐎-𝐁𝐑𝐎𝐓𝐇𝐄𝐑𝐒 </>🇱🇰`;

  const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MENU",
            id: `.menu`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "Follow us",
            id: `https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k`
          })
        }
        ];

  const msg = generateWAMessageFromContent(m.from, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: uptimeMessage
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "*🦜 ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ*"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            gifPlayback: true,
            subtitle: "",
            hasMediaAttachment: true
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons
          }),
          contextInfo: {
                  mentionedJid: [m.sender], 
                  forwardingScore: 999,
                  isForwarded: false,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '',
                  newsletterName: "DARK-RIO-MD",
                  serverMessageId: 143
                }
              }
        }),
      },
    },
  }, {});

  await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });
    }
};

export default alive;
