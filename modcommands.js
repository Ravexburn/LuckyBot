const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
//const invite = "https://discord.gg/JNtn7e3";
const invite = "";

module.exports = (bot = Discord.Client) => {

    //Admin and Mod Settings

    bot.on("message", async message => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
        let allowed = false;

        for (i = 0; i < perms.length; i++) {
            if (message.guild.member(message.author).hasPermission(perms[i])) allowed = true;
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
            if (args.length === 0) {
                message.channel.send(message.author + "To set prefix please use " + command + " <prefix>")
                    .then(message => message.delete(10 * 1000));
                message.delete(10 * 1000);
                return;
            }
            const newPrefix = args[0];
            serverSettings.prefix = newPrefix;
            bot.setServerSettings(message.guild.id, serverSettings);
            message.channel.send("**Prefix has been set to: **" + newPrefix);
            return;
        }

        //Starting logs, roles, join, and music

        if ((command === `${prefix}start`)) {
            if (args.length === 0) {
                message.channel.send(`\`\`\`md\nTo use start please use one of the following subcommands: \n${command} <help|messagelogs|logs|roles|music>\`\`\``);
                return;
            }
            switch (args[0].toLowerCase()) {

                case "help":

                    message.channel.send("<:monkaS:372547459840475146> h-help");
                    break;

                case "logs":
                case "messagelogs":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now logging in: " + chan);
                        serverSettings.channelID = chan.id;
                        serverSettings.editChannelID = chan.id;
                        serverSettings.deleteChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);
                        if (bot.centlog === false) return;
                        if (serverSettings.centEnabled !== "") return;
                        message.author.send(`Would you like this to also be added to Neo-Mod cord as a backup? You have two minutes to respond. ${invite} (yes/no)`)
                            .then(directmsg => {
                                directmsg.channel.awaitMessages(response => response.author.id === message.author.id, { max: 1, time: 120000, errors: ['time'] })
                                    .then(collected => {
                                        switch (collected.first().content.toLowerCase()) {
                                            case "yes":
                                            case "y":
                                            case "ok":
                                            case "okay":
                                            case "k":
                                            case "sure":
                                            case "yea":
                                            case "yeah":

                                                const neoGuildID = "367509256884322305"; 

                                                if (!bot.guilds.has(neoGuildID)) {
                                                    directmsg.channel.send("An error has occurred and will not log in Neo-Mod.");
                                                    console.log("Couldn't get guild REEEEEEEEE");
                                                    return;
                                                }
                                                serverSettings.centGuildID = neoGuildID;
                                                bot.setServerSettings(message.guild.id, serverSettings);
                                                const neoGuild = bot.guilds.get(neoGuildID);
                                                let neoChanID = serverSettings.centChanID;
                                                let neoChan;
                                                if (neoChanID !== "") {
                                                    if (neoGuild.channels.has(neoChanID)) {
                                                        neoChan = neoGuild.channels.get(neoChanID);
                                                    }
                                                }

                                                if (!neoChan) {
                                                    let name = message.guild.name;
                                                    name = name.replace(/\s+/g, "_").replace(/[^-\w]+/g, "");
                                                    neoGuild.createChannel(name, `text`).then(channel => {
                                                        neoChan = channel;
                                                        serverSettings.centChanID = neoChan.id;
                                                        bot.setServerSettings(message.guild.id, serverSettings);
                                                    }).catch(() => {
                                                        console.error();
                                                    });
                                                }


                                                serverSettings.centEnabled = "true";
                                                message.author.send(`Message logs have also been enabled on Neo-Mod cord. ${invite}Contact Rave on how to view them.`);
                                                if (message.author.id !== message.guild.ownerID) {
                                                    message.guild.owner.send(`Message logs have also been enabled on Neo-Mod cord. ${invite}Contact Rave on how to view them.`);
                                                }
                                                break;

                                            case "no":
                                            case "nope":
                                            case "na":
                                            case "never":
                                            case "n":
                                                serverSettings.centEnabled = "false";
                                                message.author.send(`Will not log in Neo-Mod cord.`);
                                                break;

                                            default:
                                                serverSettings.centEnabled = "false";
                                                message.author.send(`Will not log in Neo-Mod cord.`);
                                                break;

                                        }

                                    }).catch(() => {
                                        directmsg.channel.send("No response, will not log.");
                                    })

                            }).catch(() => {
                                console.error();
                            });

                    } else {

                        message.channel.send(`Please mention a channel ${command} ${args[0]} <#channelname>`);

                    }

                    break;

                case "roles":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now doing roles in: " + chan);
                        serverSettings.roleChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {

                        message.channel.send(`Please mention a channel ${command} <roles> <#channelname>`);

                    }
                    break;

                case "welcome":

                    message.channel.send(`Please use *welcome channel <#channelname> to set a welcome channel`);
                    break;

                case "join":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now logging joins and leaves in: " + chan);
                        serverSettings.joinChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {

                        message.channel.send(`Please mention a channel ${command} <join> <#channelname>`);

                    }

                    break;

                case "music":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now accepting music commands in: " + chan);
                        serverSettings.musicChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {

                        message.channel.send(`Please mention a channel ${command} <music> <#channelname>`);

                    }
                    break;

                case "edit":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now logging edits in: " + chan);
                        serverSettings.editChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {

                        message.channel.send(`Please mention a channel ${command} ${args[0]} <#channelname>`);

                    }

                    break;

                case "delete":

                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Now logging deletes in: " + chan);
                        serverSettings.deleteChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {

                        message.channel.send(`Please mention a channel ${command} ${args[0]} <#channelname>`);

                    }

                    break;
                default:

                    message.channel.send(`\`\`\`md\nTo use start please use one of the following subcommands: \n${command} <help|messagelogs|logs|roles|music>\`\`\``);

                    break;
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

                case "channel":
                    if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
                        let chan = message.mentions.channels.first();
                        message.channel.send("Welcome channel set to: " + chan);
                        serverSettings.welcomeChannelID = chan.id;
                        bot.setServerSettings(message.guild.id, serverSettings);

                    } else {
                        message.channel.send(`Please mention a channel ${command} <channel> <#channelname>`);

                    }

                    break;

                case "message":
                    if (args.length == 1) {
                        message.channel.send("Please enter a welcome message: ({user} tags the new user, {server} is server name)");
                        return;
                    }
                    let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);
                    message.channel.send("Welcome message set as: " + msg)
                    serverSettings.welcomeMessage = msg;
                    bot.setServerSettings(message.guild.id, serverSettings);
                    break;

                default:
                    message.channel.send(`\`\`\`md\nTo use welcome please use one of the following subcommands: \n${command} <help|channel|message>\`\`\``);

                    break;
            }
        }

        //Kick command

        if ((command === `${prefix}kick`)) {
            if (args.length === 0) {
                message.channel.send(`Please do ${command} <user> [reason]`);
                return;
            }

            let member_id = null;
            const matches = args[0].match(new RegExp(`<@(\\d+)>`));

            if (matches) {
                member_id = matches[1];
            }

            if (!member_id) {
                member_id = args[0];
            }

            let member = null;

            if (message.guild.members.has(member_id)) {
                member = message.guild.members.get(member_id);
            }

            if (member === message.member) {
                message.channel.send("You can't kick yourself");
                return;
            }

            let allowed = true;

            if (member) {
                for (i = 0; i < perms.length; i++) {
                    if (member.hasPermission(perms[i])) allowed = false;
                }
            }

            if (!allowed) {
                message.channel.send("You can't kick that person")
                return;
            }

            let reason = args.slice(1).join(" ");

            member.kick(reason).then((member) => {

                message.channel.send(`**${member.displayName}** has been kicked for ${reason}`);

            }).catch(() => {

                message.channel.send("Failed to kick");
            });
        }

        //Ban Command

        if ((command === `${prefix}ban`)) {
            if (args.length === 0) {
                message.channel.send(`Please do ${command} <user> [days] [reason]`);
                return;
            }

            let member_id = null;
            const matches = args[0].match(new RegExp(`<@(\\d+)>`));

            if (matches) {
                member_id = matches[1];
            }

            if (!member_id) {
                member_id = args[0];
            }

            let member = null;

            if (message.guild.members.has(member_id)) {
                member = message.guild.members.get(member_id);
            }

            if (member === message.member) {
                message.channel.send("You can't ban yourself");
                return;
            }

            let allowed = true;

            if (member) {
                for (i = 0; i < perms.length; i++) {
                    if (member.hasPermission(perms[i])) allowed = false;
                }
            }

            if (!allowed) {
                message.channel.send("You can't ban that person")
                return;
            }

            let reason = args.slice(1).join(" ");
            let days = 0;
            if (isNaN(args[1])) {
                reason = args.slice(1).join(" ");
            } else {
                days = parseInt(args[1]);
                reason = args.slice(2).join(" ");
            }

            message.guild.ban(member_id, { days, reason }).then((user) => {

                message.channel.send(`**${user}** has been banned`);

            }).catch(() => {

                message.channel.send("Failed to ban user");
            });
        }
    });

    //Intial Settings (Owner Only)

    bot.on("message", async message => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (![botSettings.Owner_id, botSettings.Owner_id2].includes(message.author.id)) return;

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        let prefix = botSettings.prefix;
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

    });

}