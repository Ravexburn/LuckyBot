const Discord = require("discord.js");
const link = "https://trello.com/b/0uytHSPL";
const link2 = "https://github.com/Ravexburn/LuckyBot";

module.exports = (bot = Discord.Client) => {

    require("./../functions/helpfunctions.js")(bot);
    require("./../functions/infofunctions.js")(bot);

    //On bot joining

   botWelcome = function botWelcome(guild) {
        let embed = new Discord.RichEmbed()
            .setTitle("User Guide")
            .setColor("#a8e8eb")
            .setDescription(`Thank you for choosing Lucky Bot created by Rave#0737 and OrigamiCoder#1375
Here are a few things this bot can do:

• Customizable bot prefix.

• Notifications about keywords.

• Allows members to set roles.

• Full or partial message logging and centralized logs.

• Kick and Ban commands.

• Welcoming members.

• And many more features to come!

If there are any questions or problems feel free to message one of the owners or check [here](${link2})!`)

        guild.owner.user.send(embed);
    };


    infoMsg = async function infoMsg(message) {
        
        if (message.system) return;
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
            userInfo(message, args);
        }

        //Server Info Settings

        if (command === `${prefix}serverinfo`) {
            serverInfo(message);
        }

        //Bot Info

        if (command === `${prefix}botinfo`) {
            botInfo(message);
        }

        //Trello

        if (command === `${prefix}trello`) {
            message.channel.send(`View upcoming features here: ${link}`);
        }

        //Github

        if ((command === `${prefix}github`) || (command === `${prefix}git`)) {
            message.channel.send(`View upcoming features here: ${link2}`);
        }

        //Command help

        if (command === `${prefix}help`) {

            generalHelp(message, prefix);
            notifyHelp(message, prefix);
            commandsHelp(message, prefix);
            rolesHelp(message, prefix);
        }

        //Mod help

        if (command === `${prefix}mod`) {

            let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];

            if (!(message.guild.member(message.author).hasPermission(perms))) return;

            let embed = new Discord.RichEmbed()
                .setTitle("Mod Commands")
                .setColor("#990000")
                .setFooter("If you have any other questions please contact Rave#0737")
                .addField(":exclamation: Basic Commands", `\*\* ${prefix}setprefix\*\* - Changes the prefix for Lucky Bot.
\*\* ${prefix}autorole\*\* - Sets a role to be added to a user when they join the server.
\*\* ${prefix}ban <user> [days] [reason]\*\* - Bans a <user> and removes the messages from [days] for [reason]. Days default is 0.     
\*\* ${prefix}kick <user> [reason]\*\* - Kicks a <user> for [reason]`)
                .addField("Welcome Commands", `\*\* ${prefix}welcome\*\* - Shows a list of commands for welcome.
\*\* ${prefix}welcome help\*\* - Shows a detailed list of commands for welcome.
\*\* ${prefix}welcome channel <channel name>\*\* - Sets the channel the bot should welcome new members in.
\*\* ${prefix}welcome message <message>\*\* - Sets the message the bot says when a new member joins. Use {server} for server name and {user} for the new user. Using {mention} makes the username a mention.`)
                .addField(":checkered_flag: Start Commands", `\*\* ${prefix}start\*\* - Shows a list of commands for start.
\*\* ${prefix}start help\*\* - Shows a detailed list of commands for start.
\*\* ${prefix}start roles <channel name>\*\* - Sets the channel for the role system.
\*\* ${prefix}start logs <channel name>\*\* - Sets the channel for message logs.  
\*\* ${prefix}start join <channel name>\*\* - Sets the channel for users joining and leaving. (Message cannot be changed on this)`)
                .addField(":arrows_counterclockwise: Toggle Commands", `\*\* ${prefix}toggle\*\* - Shows a list of commands for toggles.
\*\* ${prefix}toggle image\*\* - Changes between embed disabled for images in message logs.
\*\* ${prefix}toggle logs\*\* - Turns message logs on and off.`);

            message.channel.send(`List of mod commands sent to direct messages.`);
            message.author.send(embed);
        }

        //Suggestions

        if (command === `${prefix}suggestion` || command === `${prefix}suggest` || command === `${prefix}sgt`) {

            const chan = getSuggestionChannel();
            if (!chan) {
                //Stuffs
                return;
            }
           
            let msg = args.join(" ").trim();
            if (msg === "") {
                message.channel.send(`I've got a suggestion, try adding a suggestion. \`${command} <message>\``);
                return;
            }
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
                .setTitle("Server: " + message.guild.name + "")
                .setDescription("```css\n" + msg + "\n```")
                .setFooter(message.createdAt);
            if (message.attachments != null && message.attachments.size !== 0) {
                embed.setImage(message.attachments.first().url);
            }
            let color = "#a8e8eb";
            let member = message.member;
            if (member.colorRole) { color = member.colorRole.color; }
            embed.setColor(color);
            chan.send(embed);

        }

        //Issues
        if (command === `${prefix}issue` || command === `${prefix}issues` || command === `${prefix}isu`) {

            const chan = getIssueChannel();
            if (!chan) {
                //Stuffs
                return;
            }
           
            let msg = args.join(" ").trim();
            if (msg === "") {
                message.channel.send(`I've got an issue, try adding an issue. \`${command} <message>\``);
                return;
            }
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
                .setTitle("Server: " + message.guild.name + "")
                .setDescription("```css\n" + msg + "\n```")
                .setFooter(message.createdAt);
            if (message.attachments != null && message.attachments.size !== 0) {
                embed.setImage(message.attachments.first().url);
            }
            let color = "#a8e8eb";
            let member = message.member;
            if (member.colorRole) { color = member.colorRole.color; }
            embed.setColor(color);
            chan.send(embed);

        }

    };

    function getSuggestionChannel() {
        let suggestGuild = "367509256884322305"; //367509256884322305
        let suggestChan = "367760957646307328"; //367760957646307328
        const guild = bot.guilds.get(suggestGuild);
        if (!guild) return null;
        const chan = guild.channels.get(suggestChan);
        if (!chan) return null;

        return chan;
    }

    function getIssueChannel() {
        let issueGuild = "367509256884322305"; //367509256884322305
        let issueChan = "399310698586308619"; //399310698586308619
        const guild = bot.guilds.get(issueGuild);
        if (!guild) return null;
        const chan = guild.channels.get(issueChan);
        if (!chan) return null;

        return chan;
    }
}