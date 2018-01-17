const Discord = require("discord.js");
const MAX_CHAR = 1024;

module.exports = (bot = Discord.Client) => {

    bot.centlog = true;

    //Message Log

    msgLog = async function msgLog(message) {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        if (!serverSettings.logsOn) return;

        if (!serverSettings.messageLog) return;

        if (!serverSettings.channelID) return;

        const channelID = serverSettings.channelID;

        if (!message.guild.channels.has(channelID)) {
            return;
        }
        const chan = message.guild.channels.get(channelID);

        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
            .setDescription(message.content.substring(0, MAX_CHAR))
            .setFooter(message.channel.name)
            .setTimestamp(message.createdAt);
        if (message.attachments != null && message.attachments.size !== 0) {
            return;
        }
        let color = "#198219";
        embed.setColor(color);
        chan.send(embed)
            .catch((error) => {
                bot.log(error);
            });

        if (bot.centlog === false) return;
        if (serverSettings.centEnabled === "false") return;
        const neoChanID = serverSettings.centChanID;
        const neoGuildID = serverSettings.centGuildID;

        if (!bot.guilds.has(neoGuildID)) {
            return;
        }
        const neoGuild = bot.guilds.get(neoGuildID);

        if (!neoGuild.channels.has(neoChanID)) {
            return;
        }
        const neoChan = neoGuild.channels.get(neoChanID);

        embed.setFooter(`${message.guild.name} | ${message.chanel.name}`);

        neoChan.send(embed);

    };

    //Message Edits

    editLogs = async function editLogs(oldMessage, message) {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        if (!serverSettings.logsOn) return;

        if (!serverSettings.editLog) return;

        if (!serverSettings.editChannelID) return;

        const editChannelID = serverSettings.editChannelID;

        if (!message.guild.channels.has(editChannelID)) {
            return;
        }
        const chan = message.guild.channels.get(editChannelID);

        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
            .addField(":pencil: Old Message", (oldMessage.content + "­").substring(0, MAX_CHAR))
            .addField(":pencil: Edited Message", (message.content + "­").substring(0, MAX_CHAR))
            .setFooter(message.channel.name)
            .setTimestamp(message.createdAt);
        if (message.attachments != null && message.attachments.size !== 0) {
            embed.setImage(message.attachments.first().url);
        }
        let color = "#E5E500";
        embed.setColor(color);
        chan.send(embed)
            .catch((error) => {
                bot.log(error);
            });

        if (bot.centlog === false) return;
        if (serverSettings.centEnabled === "false") return;
        const neoChanID = serverSettings.centChanID;
        const neoGuildID = serverSettings.centGuildID;

        if (!bot.guilds.has(neoGuildID)) {
            return;
        }
        const neoGuild = bot.guilds.get(neoGuildID);

        if (!neoGuild.channels.has(neoChanID)) {
            return;
        }
        const neoChan = neoGuild.channels.get(neoChanID);

        embed.setFooter(`${message.guild.name} | ${message.chanel.name}`);

        neoChan.send(embed);
    };

    //Deleted Message

    delLog = async function delLog(message) {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        if (!serverSettings.logsOn) return;

        if (!serverSettings.deleteLog) return;

        if (!serverSettings.deleteChannelID) return;

        const deleteChannelID = serverSettings.deleteChannelID;

        if (!message.guild.channels.has(deleteChannelID)) {
            return;
        }
        const chan = message.guild.channels.get(deleteChannelID);

        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
            .setDescription(message.content.substring(0, MAX_CHAR))
            .setFooter(message.channel.name)
            .setTimestamp(message.createdAt);
        if (message.attachments != null && message.attachments.size !== 0) {
            embed.setImage(message.attachments.first().url);
        }
        let color = "#B20000";
        embed.setColor(color);
        chan.send(":warning: Message has been removed:", embed)
            .catch((error) => {
                bot.log(error);
            });

        if (bot.centlog === false) return;
        if (serverSettings.centEnabled === "false") return;
        const neoChanID = serverSettings.centChanID;
        const neoGuildID = serverSettings.centGuildID;

        if (!bot.guilds.has(neoGuildID)) {
            return;
        }
        const neoGuild = bot.guilds.get(neoGuildID);

        if (!neoGuild.channels.has(neoChanID)) {
            return;
        }
        const neoChan = neoGuild.channels.get(neoChanID);

        embed.setFooter(`${message.guild.name} | ${message.chanel.name}`);

        neoChan.send(":warning: Message has been removed:", embed);
    };

    //Images

    imgLog = async function imgLog(message) {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        if (!serverSettings.logsOn) return;

        if (!serverSettings.imageLog) return;

        if (!serverSettings.imageChannelID) return;

        const imageChannelID = serverSettings.imageChannelID;
        const imageEmbed = serverSettings.imageEmbed;

        if (!message.guild.channels.has(imageChannelID)) {
            return;
        }
        const chan = message.guild.channels.get(imageChannelID);

        if (message.attachments == null || message.attachments.size === 0) {
            return;
        }

        if (imageEmbed === false) {

            let image = { file: message.attachments.first().url };
            chan.send(`\*\*${message.author.tag}\*\* posted \*\*${message.channel.name}\*\* at \*\*${message.createdAt}\*\*`, image);
        }

        else {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
                .setFooter(message.channel.name)
                .setTimestamp(message.createdAt)
                .setImage(message.attachments.first().url);

            let color = "#198219";
            embed.setColor(color);
            chan.send(embed)
                .catch((error) => {
                    bot.log(error);
                });
        }

        if (bot.centlog === false) return;
        if (serverSettings.centEnabled === "false") return;
        const neoChanID = serverSettings.centChanID;
        const neoGuildID = serverSettings.centGuildID;

        if (!bot.guilds.has(neoGuildID)) {
            return;
        }
        const neoGuild = bot.guilds.get(neoGuildID);

        if (!neoGuild.channels.has(neoChanID)) {
            return;
        }
        const neoChan = neoGuild.channels.get(neoChanID);

        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
            .setFooter(`${message.guild.name} | ${message.chanel.name}`)
            .setTimestamp(message.createdAt)
            .setImage(message.attachments.first().url);

        let color = "#a8e8eb";
        let member = message.member;
        if (member.colorRole) { color = member.colorRole.color; }
        embed.setColor(color);

        neoChan.send(embed);

    };

}