const Discord = require("discord.js");
const invite = "";
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    require("./../functions/modchanfunctions.js")(bot);
    require("./../functions/modcmdfunctions.js")(bot);
    require("./../functions/modtogfunctions.js")(bot);

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

        if ((command === `${prefix}relay`)){
            
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

        if ((command === `${prefix}mute`)){
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
                    let msg = "```md\n"
                    let i = 1;
                    bot.guilds.forEach(guild => {
                        msg += `${i++}. ${guild.name} - <${guild.id}>\n`;
                    });
                    msg += "```";
                    message.channel.send(msg);
                    break;

                case "leave":
                    if (args.length < 2) {
                        message.channel.send("Put a server id or server number <:yfist:378373231079587840>");
                        let msg = "```md\n"
                        let i = 1;
                        let guilds = [];
                        bot.guilds.forEach(guild => {
                            guilds[i] = guild;
                            msg += `${i++}. ${guild.name} - <${guild.id}>\n`;
                        });
                        msg += "```";
                        message.channel.send(msg);
                        let author = message.author;
                        message.channel.send("You have 60 seconds to choose a server to leave")
                            .then(() => {
                                message.channel.awaitMessages(response => response.author.id === author.id, { max: 1, time: 60000, errors: ['time'] })
                                    .then(collected => {
                                        message.channel.send(`Acknowledged ${collected.first().content}`);
                                        let input = collected.first().content;

                                        if (input.length < 18) {
                                            let num = parseInt(input);

                                            if (num === NaN) {
                                                message.channel.send("Not a valid server <:yfist:378373231079587840>");
                                                return;
                                            }


                                            if ((num <= 0) || (num > guilds.length)) {
                                                message.channel.send("Not a valid server <:yfist:378373231079587840>");
                                                return;
                                            }

                                            message.channel.send(`Successfully left \`${guilds[num]}\``);
                                            guilds[num].leave().catch(console.error);

                                        } else {

                                            let id = input;
                                            if (!bot.guilds.has(id)) {
                                                message.channel.send("Bot is not in that server <:yfist:378373231079587840>");
                                                return;
                                            }

                                            let guild = bot.guilds.get(id);
                                            message.channel.send(`Successfully left \`${guild}\``);
                                            guild.leave().catch(console.error);
                                        }

                                    })

                                    .catch(() => {
                                        message.channel.send("No server sent in time limit");
                                        console.error;
                                    });

                            }).catch(() => console.error);
                        return;
                    }
                    if (args[1].length > bot.guilds.size.toString().length) {


                        let id = args[1];
                        if (!bot.guilds.has(id)) {
                            message.channel.send("Bot is not in that server <:yfist:378373231079587840>");
                            return;
                        }

                        let guild = bot.guilds.get(id);
                        message.channel.send(`Successfully left \`${guild}\``);
                        guild.leave().catch(console.error);

                    }
                    break;

                default:
                    message.channel.send(`\`\`\`md\nTo use server please use one of the following subcommands: \n${command} <help|list|leave>\`\`\``);
                    break;
            }
            return;
        }

    };

}
