import cron from 'node-cron';
import moment from 'moment-timezone';

let scheduledTasks = {};

const groupSetting = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['group'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*𝙾𝙽𝙻𝚈 𝙾𝚆𝙽𝙴𝚁 𝙲𝙰𝙽 𝚄𝚂𝙴 𝙸𝙽 𝙶𝚁𝙾𝚄𝙿 ❗*");
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*𝙱𝙾𝚃 𝙼𝚄𝚂𝚃 𝙱𝙴 𝙰𝙽 𝙰𝙳𝙼𝙸𝙽 𝚃𝙾 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❗*");
    if (!senderAdmin) return m.reply("*𝚈𝙾𝚄 𝙼𝚄𝚂𝚃 𝙱𝙴 𝙰𝙽 𝙰𝙳𝙼𝙸𝙽 𝚃𝙾 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❗*");

    const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
    if (args.length < 1) return m.reply(`𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒑𝒆𝒄𝒊𝒇𝒚 𝒂 𝒔𝒆𝒕𝒕𝒊𝒏𝒈 (𝒐𝒑𝒆𝒏/𝒄𝒍𝒐𝒔𝒆) 𝒂𝒏𝒅 𝒐𝒑𝒕𝒊𝒐𝒏𝒂𝒍𝒍𝒚 𝒂 𝒕𝒊𝒎𝒆.\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n*${prefix + cmd} 𝒐𝒑𝒆𝒏* or *${prefix + cmd} 𝒐𝒑𝒆𝒏 04:00 𝑷𝑴*`);

    const groupSetting = args[0].toLowerCase();
    const time = args.slice(1).join(' ');

    // Handle immediate setting if no time is provided
    if (!time) {
      if (groupSetting === 'close') {
        await gss.groupSettingUpdate(m.from, 'announcement');
        return m.reply("𝑮𝒓𝒐𝒖𝒑 𝒄𝒍𝒐𝒔𝒆𝒅 𝒏𝒐𝒘.");
      } else if (groupSetting === 'open') {
        await gss.groupSettingUpdate(m.from, 'not_announcement');
        return m.reply("𝑮𝒓𝒐𝒖𝒑 𝒐𝒑𝒆𝒏𝒆𝒅 𝒏𝒐𝒘.");
      } else {
        return m.reply(`𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒆𝒕𝒕𝒊𝒏𝒈. 𝑼𝒔𝒆 "𝒐𝒑𝒆𝒏" 𝒕𝒐 𝒐𝒑𝒆𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒏𝒅 "𝒄𝒍𝒐𝒔𝒆" 𝒕𝒐 𝒄𝒍𝒐𝒔𝒆 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑.\n\nExample:\n*${prefix + cmd} 𝒐𝒑𝒆𝒏* or *${prefix + cmd} 𝒄𝒍𝒐𝒔𝒆*`);
      }
    }

    // Check if the provided time is valid
    if (!/^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(time)) {
      return m.reply(`𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒕𝒊𝒎𝒆 𝒇𝒐𝒓𝒎𝒂𝒕. 𝑼𝒔𝒆 𝑯𝑯:𝒎𝒎 𝑨𝑴/𝑷𝑴 𝒇𝒐𝒓𝒎𝒂𝒕.\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n*${prefix + cmd} 𝒐𝒑𝒆𝒏 04:00 𝑷𝑴*`);
    }

    // Convert time to 24-hour format
    const [hour, minute] = moment(time, ['h:mm A', 'hh:mm A']).format('HH:mm').split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`;

    console.log(`Scheduling ${groupSetting} at ${cronTime} IST`);

    // Clear any existing scheduled task for this group
    if (scheduledTasks[m.from]) {
      scheduledTasks[m.from].stop();
      delete scheduledTasks[m.from];
    }

    scheduledTasks[m.from] = cron.schedule(cronTime, async () => {
      try {
        console.log(`Executing scheduled task for ${groupSetting} at ${moment().format('HH:mm')} IST`);
        if (groupSetting === 'close') {
          await gss.groupSettingUpdate(m.from, 'announcement');
          await gss.sendMessage(m.from, { text: "𝑮𝒓𝒐𝒖𝒑 𝒄𝒍𝒐𝒔𝒆𝒅 𝒏𝒐𝒘." });
        } else if (groupSetting === 'open') {
          await gss.groupSettingUpdate(m.from, 'not_announcement');
          await gss.sendMessage(m.from, { text: "𝑮𝒓𝒐𝒖𝒑 𝒐𝒑𝒆𝒏𝒆𝒅 𝒏𝒐𝒘." });
        }
      } catch (err) {
        console.error('Error during scheduled task execution:', err);
        await gss.sendMessage(m.from, { text: '𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒖𝒑𝒅𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒔𝒆𝒕𝒕𝒊𝒏𝒈.' });
      }
    }, {
      timezone: "Asia/colombo"
    });

    m.reply(`Group will be set to "${groupSetting}" at ${time} IST.`);
  } catch (error) {
    console.error('Error:', error);
    m.reply('𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅.');
  }
};

export default groupSetting;
