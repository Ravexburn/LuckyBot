const Discord = require("discord.js");
const MAX_CHAR = 1024;


module.exports = (bot = Discord.Client) => {

    bot.centlog = true;

    //Message Log

    bot.on("message", async message => {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

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
            embed.setImage(message.attachments.first().url);
        }
        let color = "#a8e8eb";
        let member = message.guild.members.get(message.author.id);
        if (member.colorRole) { color = member.colorRole.color; }
        embed.setColor(color);
        chan.send(embed);

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

    });

    //Message Edits

    bot.on("messageUpdate", (oldMessage, message) => {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

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
        let color = "#a8e8eb";
        let member = message.guild.members.get(message.author.id);
        if (member.colorRole) { color = member.colorRole.color; }
        embed.setColor(color);
        chan.send(embed);

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
    });

    //Deleted Message

    bot.on("messageDelete", async message => {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

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
        let color = "#a8e8eb";
        let member = message.guild.members.get(message.author.id);
        if (member.colorRole) { color = member.colorRole.color; }
        embed.setColor(color);
        chan.send(":warning: Message has been removed:", embed);

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
    });




}