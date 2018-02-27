const Discord = require("discord.js");
const link = "https://trello.com/b/0uytHSPL";
const link2 = "https://github.com/Ravexburn/LuckyBot";

module.exports = (bot = Discord.Client) => {

    require("./../functions/helpfunctions.js")(bot);
    require("./../functions/infofunctions.js")(bot);

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
            console.log("Crash at userinfo");
            userInfo(message, args);
        }

        //Server Info Settings

        if (command === `${prefix}serverinfo`) {
            console.log("Crash at serverinfo");
            serverInfo(message);
        }

        //Bot Info

        if (command === `${prefix}botinfo`) {
            console.log("Crash at botinfo");
            botInfo(message);
        }

        //Trello

        if (command === `${prefix}trello`) {
            console.log("Crash at trello");
            message.channel.send(`View upcoming features here: ${link}`);
        }

        //Github

        if ((command === `${prefix}github`) || (command === `${prefix}git`)) {
            console.log("Crash at git");
            message.channel.send(`View upcoming features here: ${link2}`);
        }

        //Command help

        if (command === `${prefix}help`) {
            console.log("Crash at help");
            let embed = new Discord.RichEmbed()
                .setTitle("List of Commands")
                .setColor("#17487d")
                .setFooter("If you have any other questions please contact Rave#0737");
            generalHelp(message, prefix, embed);
            notifyHelp(message, prefix, embed);
            commandsHelp(message, prefix, embed);
            rolesHelp(message, prefix, embed);
            sendEmbed(message, embed);
        }

        //Suggestions

        if (command === `${prefix}suggestion` || command === `${prefix}suggest` || command === `${prefix}sgt`) {
            console.log("Crash at suggestion");
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
            console.log("Crash at issue");
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