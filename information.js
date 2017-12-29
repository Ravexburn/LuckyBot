const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const link = "https://trello.com/b/0uytHSPL";
const link2 = "https://github.com/Ravexburn/LuckyBot";

module.exports = (bot = Discord.Client) => {

    //On bot joining

    bot.on("guildCreate", guild => {
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

        if (command === `${prefix}trello`) {
            message.channel.send(`View upcoming features here: ${link}`);

        }

        if ((command === `${prefix}github`) || (command === `${prefix}git`)) {
            message.channel.send(`View upcoming features here: ${link2}`);

        }

        //Command help

        if (command === `${prefix}help`) {

            let embed = new Discord.RichEmbed()
                .setTitle("List of Commands")
                .setColor("#17487d")
                .addField(":information_source: Information", `\*\* ${prefix}userinfo\*\* - Shows a user's information.
\*\* ${prefix}serverinfo\*\* - Shows the server's information.
\*\* ${prefix}botinfo\*\* - Shows Lucky Bot's information.
\*\* ${prefix}help\*\* - Shows this list of commands.
\*\* ${prefix}mod\*\* - Sends a list of mod commands in direct messages.
\*\* ${prefix}trello\*\* - Sends a link to Lucky Bot's trello page.
\*\* ${prefix}github\*\* - Sends a link to Lucky Bot's github page.
\*\* ${prefix}suggestion\*\* - Have a suggestion for Lucky Bot? Use this command to have it heard!`)
                .addField(":round_pushpin: Notificatons", `\*\* ${prefix}notify\*\* - Shows a list of commands for notifications.
\*\* ${prefix}notify help\*\* - Shows a detailed list of commands for notifications.
\*\* ${prefix}notify list\*\* - Direct messages a list of keywords for the server.
\*\* ${prefix}notify add <keyword>\*\* - Adds a <keyword> to notify you about on the server.
\*\* ${prefix}notify remove <keyword>\*\* - Removes a <keyword> you were notified about on the server.
\*\* ${prefix}notify global list\*\* - Direct messages a list of global keywords.
\*\* ${prefix}notify global add <keyword>\*\* - Adds a <keyword> to notify you about on all servers.
\*\* ${prefix}notify global remove <keyword>\*\* - Removes a <keyword> you were notified about on all servers.`)
                .addField("Roles", `\*\* ${prefix}roles\*\* - Shows a detailed list of commands for roles.
\*\*+<role> \*\* - Allows user to add the <role>.
\*\*-<role> \*\* - Allows user to remove the <role>.
:warning: When adding and removing roles, names must match role name exactly!`)
                .setFooter("If you have any other questions please contact Rave#0737");

            message.channel.send(embed);
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
\*\* ${prefix}start join <channel name>\*\* - Sets the channel for users joining and leaving. (Message cannot be changed on this)`);

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
            if (msg === ""){
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
            let member = message.guild.members.get(message.author.id);
            if (member.colorRole) { color = member.colorRole.color; }
            embed.setColor(color);
            chan.send(embed);

        }

    });

    function getSuggestionChannel() {
        let suggestGuild = "367509256884322305"; //367509256884322305
        let suggestChan = "367760957646307328"; //367760957646307328
        const guild = bot.guilds.get(suggestGuild);
        if (!guild) return null;
        const chan = guild.channels.get(suggestChan);
        if (!chan) return null;

        return chan;
    }
}