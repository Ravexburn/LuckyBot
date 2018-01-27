const Discord = require("discord.js");
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {
    /**
     * User Info
     * @param {Message} message 
     */
    userInfo = function userInfo(message) {

        let target = message.member;
        if (message.mentions.members != null && message.mentions.members.size !== 0) {
            target = message.mentions.members.first();
        }
        if (!target) return;
        let member = target;
        let color = "#a8e8eb";
        let avatarURL = member.user.displayAvatarURL.split("?")[0];
        if (member.colorRole) { color = member.colorRole.color; }
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.tag, avatarURL)
            .setColor(color)
            .setThumbnail(avatarURL)
            .addField("ID", member.user.id, true);


        let status = member.presence.status;
        status = status.replace("online", "<:online:401474727299776512> Online").replace("offline", "<:offline:401474711671799829> Offline").replace("idle", "<:away:401474693741150215> Idle").replace("dnd", "<:dnd:401474738071011329> Do Not Disturb");

        embed.addField("Status", status, true);
        embed.addField("Account Created On", member.user.createdAt.toLocaleString(), true);
        embed.addField("Joined Server On", member.joinedAt.toLocaleString(), true);
        if (member.presence.game) {
            const game = member.presence.game;
            let fieldString;
            let gameString;
            if (game.streaming) {
                fieldString = "Streaming";
                gameString = `[${game.name}](${game.url})`;
            }
            else {
                fieldString = "Playing";
                gameString = game.name;
            }
            embed.addField(fieldString, gameString, true);
        }
        
        if (member.roles) {
            let roleString = member.roles.array().join(", ");
            embed.addField("Roles", roleString);
        }

        message.channel.send(embed);

        return;
    }

    /**
     * Server Info
     * @param {Message} message 
     */
    serverInfo = function serverInfo(message) {

        let embed = new Discord.RichEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setColor("#a8e8eb")
            .setThumbnail(message.guild.iconURL)
            .addField("Server created on", message.guild.createdAt.toLocaleString(), true)
            .addField("Owner", message.guild.owner.user.tag, true)
            .addField("Region", message.guild.region, true)
            .addField("Members", message.guild.memberCount, true)
            .addField("Roles", message.guild.roles.size, true)
            .addField("Text Channels", message.guild.channels.array().filter(channel => channel.type === "text").length, true)
            .addField("Voice Channels", message.guild.channels.array().filter(channel => channel.type === "voice").length, true)
            .setFooter(`Server ID: ${message.guild.id}`);

        message.channel.send(embed);

        return;
    }
    /**
     * Bot Info
     * @param {Message} message 
     */
    botInfo = function botInfo(message) {
        let time = bot.uptime;
        time = Math.floor(time / 1000);
        let seconds = time % 60;
        time = Math.floor(time / 60);
        let minutes = time % 60;
        time = Math.floor(time / 60);
        let hours = time % 24;
        time = Math.floor(time / 24);
        let days = time;
        let date = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        let trello = "https://trello.com/b/0uytHSPL";
        let git = "https://github.com/Ravexburn/LuckyBot";
        let embed = new Discord.RichEmbed()
            .setAuthor("About Lucky Bot", bot.user.displayAvatarURL)
            .setColor("#a8e8eb")
            .setThumbnail(bot.user.displayAvatarURL)
            .addField("Authors", "Rave#0737 and OrigamiCoder#1375", true)
            .addField("Websites", `[Trello](${trello}) [Github](${git})`, true)
            .addField("Servers", bot.guilds.size, true)
            .addField("Uptime", date, true)
            .addField("Bot Joined Server On", message.guild.joinedAt.toLocaleString(), true)
            .addField("Bot ID", bot.user.id, true);
        message.channel.send(embed);
    }

}