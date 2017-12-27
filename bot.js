const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const InvCache = require("./invites.js");
bot.invCache = new InvCache(bot);

require("./autorole.js")(bot);
require("./information.js")(bot);
require("./messagelogs.js")(bot);
require("./modcommands.js")(bot);
require("./notifications.js")(bot);
require("./server_settings.js")(bot);
require("./welcome.js")(bot);


//Generates join link and shows ready status

bot.on("ready", async () => {
    console.log('Ready');
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (error) {
        console.log(error.stack);
    }

    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
    bot.guilds.forEach(guild => {
        bot.invCache.guildInvites(guild).catch(console.error);
    });
});

bot.on("guildCreate", guild => {
    bot.initServerSettings(guild.id);
    bot.invCache.guildInvites(guild).catch(console.error);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
});


bot.on("guildDelete", guild => {
    bot.delServerSettings(guild.id);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    const serverSettings = bot.getServerSettings(message.guild.id);
    if (!serverSettings) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
    let prefix = serverSettings.prefix;
    if (!command.startsWith(prefix)) return;

    //User Info Settings

    if (command === `${prefix}userinfo`) {
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
        status = status.replace("online", "<:green_circle:364951150732115968> Online").replace("offline", "<:gray_circle:364951138719760387> Offline").replace("idle", "<:yellow_circle:364951165856907264> Idle").replace("dnd", ":red_circle: Do Not Disturb");

        embed.addField("Status", status, true);
        embed.addField("Account Created On", member.user.createdAt.toLocaleString(), true);
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

        embed.addField("Joined Server On", member.joinedAt.toLocaleString(), true); //to use for botinfo message.guild.joinedAt.toLocaleString()

        if (member.roles) {
            let roleString = member.roles.array().join(", ");
            embed.addField("Roles", roleString);
        }

        message.channel.send(embed);

        return;
    }

    //Server Info Settings

    if (command === `${prefix}serverinfo`) {
        let embed = new Discord.RichEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setColor("#a8e8eb")
            .setThumbnail(message.guild.iconURL)
            .addField("Server created on", message.guild.createdAt.toLocaleString(), true)
            .addField("Owner", message.guild.owner.user.tag, true)
            .addField("Region", message.guild.region, true)
            .addField("Members", message.guild.memberCount, true)
            .addField("Roles", message.guild.roles.size, true)
            .addField("Text Channels", message.guild.channels.size, true)
          //  .addField("Voice Channels", message.guild.channels.guildChannel.type("voice").size, true)
            .setFooter(`Server ID: ${message.guild.id}`);

        message.channel.send(embed);

        return;
    }

    //Bot Info

    if (command === `${prefix}botinfo`) {
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

        let embed = new Discord.RichEmbed()
            .setAuthor("About Lucky Bot", bot.user.displayAvatarURL)
            .setColor("#a8e8eb")
            .setThumbnail(bot.user.displayAvatarURL)
            .addField("Authors", "Rave#0737 and OrigamiCoder#1375", true)
            .addField("Websites", `[Trello](${trello})`, true)
            .addField("Servers", bot.guilds.size, true)
            .addField("Uptime", date, true)
            .addField("Bot Joined Server On", message.guild.joinedAt.toLocaleString(), true)
            .addField("Bot ID", "349756729396953089", true);
        message.channel.send(embed);
    }
});


//Roles

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    const serverSettings = bot.getServerSettings(message.guild.id);
    if (!serverSettings) return;

    let prefix = serverSettings.prefix;
    let valid_channel = false;
    let activeChannel;

    if (message.channel.id === serverSettings.roleChannelID) {
        valid_channel = true;
    }

    if (message.guild.channels.has(serverSettings.roleChannelID)) {
        activeChannel = message.guild.channels.get(serverSettings.roleChannelID);
    }

    if (!activeChannel) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    //Add Role

    if (command === `${prefix}addrole`) {
        if (valid_channel === false) {
            message.channel.send(message.author + " " + "**Please use this in the roles channel**" + " [" + activeChannel + "]")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        if (args.length === 0) {
            message.channel.send(message.author + " " + "**To select a role please use " + `${prefix}addrole` + " <role name>**")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        let rolename = args.join(" ");
        let target;

        if (message.guild.roles.exists("name", rolename)) {
            let role = message.guild.roles.find("name", rolename);
            let err = false;

            let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "VIEW_AUDIT_LOG", "MENTION_EVERYONE", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
            for (i = 0; i < perms.length; i++) {
                if (role.hasPermission(perms[i])) err = true;
            }

            if (err === false) {
                message.guild.members.find("id", message.author.id).addRole(role);
                message.channel.send(message.author + " " + "**Your roles have been set**")
                    .then(message => message.delete(10 * 1000));
                message.delete(10 * 1000);
                return;
            }
        }

        message.channel.send(message.author + " " + "**Please pick a valid role**")
            .then(message => message.delete(10 * 1000));
        message.delete(10 * 1000);
        return;

    }

    //Remove Role

    if ((command === `${prefix}removerole`) || (command === `${prefix}remrole`)) {
        if (valid_channel === false) {
            message.channel.send(message.author + " " + "**Please use this in the roles channel**" + " [" + activeChannel + "]")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        if (args.length === 0) {
            message.channel.send(message.author + " " + "**To remove a role please use " + `${prefix}removerole` + " or " + `${prefix}remrole` + " <role name>**")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        let rolename = args.join(" ");



        if (message.guild.roles.exists("name", rolename)) {
            message.guild.members.find("id", message.author.id).removeRole(message.guild.roles.find("name", rolename));
            message.channel.send(message.author + " " + "**Your role has been removed**")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        else {
            message.channel.send(message.author + " " + "**Please pick a valid role to remove**")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }

    }


});

bot.login(botSettings.token);



//SHIFT ALT F to format