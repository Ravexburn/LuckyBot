const serverid = require("./serverlist.json");
const Discord = require("discord.js");
const link2 = "https://github.com/Ravexburn/LuckyBot";
let servers = serverid.servers;

module.exports = (bot = Discord.Client) => {

    whitelist = function whitelist(guild) {

        if (servers.hasOwnProperty(guild.id)) {
            const element = servers[guild.id];

            const chan = serverLogging();
            if (!chan) {
                return;
            }

            let embed = new Discord.RichEmbed()
                .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
                .setColor("#1ccc8b")
                .setDescription(`:exclamation: Lucky Bot has joined: \*\*${guild.name}\*\* \`(#${guild.id})\`. Owner: \*\*${guild.owner.user.tag}\*\*\n
:white_check_mark: This server is on the whitelist.`);
            chan.send(embed);
            return;
        }
        
        else {
            guild.leave();
            let embed = new Discord.RichEmbed()
                .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
                .setColor("#1ccc8b")
                .setDescription(`:exclamation: Lucky Bot has joined: \*\*${guild.name}\*\* \`(#${guild.id})\`. Owner: \*\*${guild.owner.user.tag}\*\*\n
:x: This server is not on the whitelist.`);
            chan.send(embed);
            return;
        }

    };

    function serverLogging() {
        let serverGuild = "176137665069056000";
        let serverChan = "411245974854434828";
        const guild = bot.guilds.get(serverGuild);
        if (!guild) return null;
        const chan = guild.channels.get(serverChan);
        if (!chan) return null;

        return chan;
    }

}


