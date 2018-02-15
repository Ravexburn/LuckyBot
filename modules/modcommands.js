const Discord = require("discord.js");
const invite = "";
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    require("./../functions/modchanfunctions.js")(bot);
    require("./../functions/modcmdfunctions.js")(bot);
    require("./../functions/modtogfunctions.js")(bot);
    require("./../functions/ownercmdfunctions.js")(bot);
    require("./relays.js")(bot);

    //Admin and Mod Settings

    modCmds = async function modCmds(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
        let allowed = false;

        for (i = 0; i < perms.length; i++) {
            if (message.member.hasPermission(perms[i])) allowed = true;
        }
        if (!allowed) return;

        let serverSettings = bot.getServerSettings(message.guild.id);

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        const prefix = serverSettings.prefix;

        if (!command.startsWith(prefix)) return;

        //Prefix

        if ((command === `${prefix}setprefix`)) {
            setPrefix(message, command, args, serverSettings);
        }

        //Starting logs, roles, join, and music

        if ((command === `${prefix}start`)) {
            if (args.length === 0) {
                message.channel.send(`\`\`\`md\nTo use start please use one of the following subcommands: \n${command} <help|messagelogs|logs|roles|music>\`\`\``);
                return;
            }
            switch (args[0].toLowerCase()) {

                //Help

                case "help":

                    message.channel.send("<:monkaS:372547459840475146> h-help");
                    break;

                //Message logging

                case "logs":
                case "messagelogs":

                    logChan(message);
                    break;

                //Roles

                case "roles":

                    rolesChan(message, serverSettings, command);
                    break;

                //Welcome

                case "welcome":

                    message.channel.send(`Please use *welcome channel <#channelname> to set a welcome channel`);
                    break;

                //Join

                case "join":

                    joinChan(message, serverSettings, command);
                    break;

                //Music to be added at a later date

                /*  case "music":
 
                 musicChan(message, serverSettings, command);
                     break; */

                //Edited messages

                case "edit":

                    editChan(message, serverSettings, command, args);
                    break;

                //Deleted messages

                case "delete":

                    delChan(message, serverSettings, command, args);
                    break;

                default:

                    message.channel.send(`\`\`\`md\nTo use start please use one of the following subcommands: \n${command} <help|messagelogs|logs|roles|music>\`\`\``);
                    break;
            }
        }

        //Toggles

        if ((command === `${prefix}toggle`)) {
            if (args.length === 0) {
                message.channel.send(`\`\`\`md\nTo use toggle please use one of the following subcommands: \n${command} <image|logs>\`\`\``);
                return;
            }
            let emote = "";
            switch (args[0].toLowerCase()) {

                //Toggle Image Embed
                case "image":

                    imgTog(message, serverSettings);
                    return;

                //Toggle Logs
                case "logs":

                    logsTog(message, serverSettings);
                    return;

                //Toggle Welcome     
                case "welcome":

                    welTog(message, serverSettings);
                    return;

                default:

                    return;
            }
        }

        //Welcome setup
        //*welcome <help|channel|message>
        //*welcome channel in #channel
        //*welcome channel #channel

        if ((command === `${prefix}welcome`)) {
            if (args.length === 0) {
                message.channel.send(`\`\`\`md\nTo use welcome please use one of the following subcommands: \n${command} <help|channel|message>\`\`\``);
                return;
            }
            switch (args[0].toLowerCase()) {

                case "help":

                    message.channel.send("<:monkaS:372547459840475146> h-help");
                    break;

                case "chan":
                case "channel":

                    welChan(message, serverSettings, command);
                    break;

                case "msg":
                case "message":

                    welMsg(message, command, args, serverSettings);
                    break;

                default:

                    message.channel.send(`\`\`\`md\nTo use welcome please use one of the following subcommands: \n${command} <help|channel|message>\`\`\``);
                    break;
            }
        }

        //Relay

        if ((command === `${prefix}relay`)) {

        }

        //Ban Command

        if ((command === `${prefix}ban`)) {
            banUser(message, command, args, perms);
        }

        //Kick command

        if ((command === `${prefix}kick`)) {
            kickUser(message, command, args, perms);
        }

        //Mute Command

        if ((command === `${prefix}mute`)) {
            muteUser(message, command, args, perms);
        }
    };

    //Intial Settings (Owner Only)

    owner = async function owner(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (![bot.botSettings.Owner_id, bot.botSettings.Owner_id2].includes(message.author.id)) return;

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        let prefix = bot.botSettings.prefix;
        if (!command.startsWith(prefix)) return;

        //Default Settings

        if ((command === `${prefix}intset`)) {

            bot.initServerSettings(message.guild.id);
            message.channel.send("**Server settings have been reset**")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }

        //Servers' info
        //Server <help|list|leave>

        if ((command === `${prefix}server`) || (command === `${prefix}getmeout`)) {
            if (args.length === 0) {
                message.channel.send(`\`\`\`md\nTo use server please use one of the following subcommands: \n${command} <help|list|leave>\`\`\``);
                return;
            }
            switch (args[0].toLowerCase()) {

                case "help":
                    message.channel.send("<:monkaS:372547459840475146> h-help");
                    break;

                case "list":
                    serverList(message);
                    break;

                case "leave":
                    serverLeave(message, args);
                    break;

                default:
                    message.channel.send(`\`\`\`md\nTo use server please use one of the following subcommands: \n${command} <help|list|leave>\`\`\``);
                    break;
            }
            return;
        }

        if ((command === `${prefix}relay`)) {
            let relay = "";
            let channels = [];
            let type = "";
            let format = "";
            switch (args[0].toLowerCase()) {

                case "list":
                    //Lists the existing relays. Shows relay type and name of servers and name of channels(?)
                    break;

                case "toggle":
                    //Toggles between the relay being in an embed or not.
                    break;

                case "start":
                    //Where a new relay starts. Requires relay name, type, and at least two channel and server ids.
                    // *relay start <relay> <type> <channel> <channel> [channel...]
                    if (args.length < 5) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    type = args[2].toLowerCase();
                    channels = args.slice(3);
                    relays.addRelay(relay, channels, type)
                        .catch((reason) => { console.log(reason); });
                    break;

                case "add":
                    //Adds a channel to an existing relay. Requires relay name, channel and server id.
                    // *relay add <relay> <channel> [channel...]
                    if (args.length < 3) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    channels = args.slice(2);
                    relays.addChannel(relay, channels)
                        .catch((reason) => { console.log(reason); });
                    break;

                case "remove":
                    //Removes a channel to an existing relay. Requires relay name, channel and server id.
                    // *relay remove <relay> <channel>
                    if (args.length < 3) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    let channel = args[2];
                    relays.removeChannel(channel)
                        .catch((reason) => { console.log(reason); });
                    break;

                case "delete":
                    //Deletes an existing relay. Requires relay name.
                    // *relay delete <relay>
                    if (args.length < 2) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    relays.removeRelay(relay)
                        .catch((reason) => { console.log(reason); });
                    break;

                case "type":
                    // *relay type <relay> <type>
                    if (args.length < 2) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    if (args.length === 2) {
                        return relays.getRelayType(relay)
                            .then((type) => {
                                message.reply(`Relay type: \`${type}\``);
                            }).catch((reason) => { console.log(reason); });
                    }
                    type = args[2].toLowerCase();
                    relays.setRelayType(relay, type)
                        .catch((reason) => { console.log(reason); });
                    break;

                case "format":
                    // *relay format <relay> <format>
                    if (args.length < 2) {
                        // TODO Feedback
                        return;
                    }
                    relay = args[1].toLowerCase();
                    if (args.length === 2) {
                        return relays.getRelayFormat(relay)
                            .then((format) => {
                                message.reply(`Relay format: \`${format}\``);
                            }).catch((reason) => { console.log(reason); });
                    }
                    format = args[2].toLowerCase();
                    relays.setRelayType(relay, format)
                        .catch((reason) => { console.log(reason); });
                    break;

                default:
                    //Relay command help
                    // TODO
                    break;
            }

        }
    };

}
