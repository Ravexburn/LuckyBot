const Discord = require("discord.js");
const botSettings = require("./botsettings.json");

module.exports = (bot = Discord.Client) => {

    //Welcome message

    bot.on("guildMemberAdd", member => {
        if (member.user.bot) return;
        const guild = member.guild;
        const serverSettings = bot.getServerSettings(guild.id);
        if (!serverSettings) return;
        if (!serverSettings.welcomeChannelID) return;
        const welcomeChannelID = serverSettings.welcomeChannelID;

        if (!guild.channels.has(welcomeChannelID)) {
            return;
        }
        const chan = guild.channels.get(welcomeChannelID);

        if (!serverSettings.welcomeMessage) {
            serverSettings.welcomeMessage = bot.getDefaultSettings().welcomeMessage;
            bot.setServerSettings(guild.id, serverSettings);
        }

        let msg = serverSettings.welcomeMessage;
        let mention = member.user;
        let serverName = guild.name;
        let user = member.user.tag;

        msg = msg.replace("{mention}", mention).replace("{server}", serverName).replace("{user}", user);

        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(member.user.displayAvatarURL)
            .setTitle("Member Join!")
            .setDescription(msg);
        chan.send(embed);
    });

    //Join

    bot.on("guildMemberAdd", member => {
        const guild = member.guild;
        const serverSettings = bot.getServerSettings(guild.id);
        if (!serverSettings) return;
        if (!serverSettings.joinChannelID) return;
        const joinChannelID = serverSettings.joinChannelID;

        if (!guild.channels.has(joinChannelID)) {
            return;
        }
        const chan = guild.channels.get(joinChannelID);

        let user = member.user;
        let serverName = guild.name;

        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(member.user.displayAvatarURL)
            .setTitle("Member Join!")
            .setDescription(`${user} joined the server`);
        bot.invCache.usedInvite(guild).then(invite => {
            if (invite) {
                embed.setDescription(`${user} joined from ${invite.url} created by ${invite.inviter}. Uses: ${invite.uses}`);
            }
            chan.send(embed);
        }).catch(() => {
            console.error();
        });
    });

    //Leave

    bot.on("guildMemberRemove", member => {
        const guild = member.guild;
        const serverSettings = bot.getServerSettings(guild.id);
        if (!serverSettings) return;
        if (!serverSettings.joinChannelID) return;
        const joinChannelID = serverSettings.joinChannelID;

        if (!guild.channels.has(joinChannelID)) {
            return;
        }
        const chan = guild.channels.get(joinChannelID);

        let user = member.user;
        let serverName = guild.name;

        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(member.user.displayAvatarURL)
            .setTitle("Member Left!")
            .setDescription(`${user} left the server`);
        chan.send(embed);
    });
}