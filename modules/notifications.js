const Discord = require("discord.js");
const Notifications = require("./notifications_sql");
const notify = new Notifications();
//const Ignorenoti = require("./notifications_ignore.js");
//const ignorenoti = new Ignorenoti();

module.exports = (bot = Discord.Client) => {

    require("./../functions/helpfunctions.js")(bot);

    notifySet = async function notifySet(message) {
        if (message.system) return;
        if (message.author.bot) return;

        if (message.channel.type === "dm") {
            return;
        }

        const guild = message.guild;

        if (!bot.hasServerSettings(guild.id)) {
            bot.initServerSettings(guild.id);
        }
        const serverSettings = bot.getServerSettings(guild.id);
        const prefix = (serverSettings.prefix ? serverSettings.prefix : bot.botSettings.prefix);

        if (!message.content.startsWith(prefix)) return;

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        const user = message.author;

        //Commands for notifications

        if ((command === `${prefix}notify`)) {
            switch (args.length) {

                case 0:
                notifyHelp(message, prefix);
                    break;

                case 1:
                    if (args[0] === "list") {

                        notify.tableExists(guild.id)
                            .then(exists => {
                                if (!exists) {
                                    message.reply("A message has been sent to your direct messages.");
                                    user.send(":warning: You don't have any keywords! :warning:");
                                    throw Error("Table doesn't exist");
                                }
                            })
                            .then(() => { return notify.getUserKeywords(user.id, guild.id); })
                            .then(keywords => {
                                if (keywords.size === 0) {
                                    message.reply("A message has been sent to your direct messages.");
                                    user.send(":warning: You don't have any keywords! :warning:");
                                    return;
                                }
                                let msg = "";
                                for (let item of keywords) {
                                    msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;

                                }
                                message.reply("A message has been sent to your direct messages.");
                                user.send(`:round_pushpin: Keywords for the server: \`${guild.name}\` : \n${msg}`);


                            }).catch(() => {
                                console.error;
                            });

                    }

                    else if (args[0] === "clear") {
                        notify.tableExists(guild.id)
                            .then(exists => {
                                if (!exists) {
                                    message.reply("Can't find the keyword.");
                                    throw Error("Table doesn't exist");
                                }
                            }).then(() => { return notify.removeAllUserKeywords(user.id, guild.id); })
                            .then(success => {
                                if (success) {
                                    message.reply(`Removed all keywords on \`${guild.name}\``);
                                    message.delete(1 * 1000);
                                    return;
                                }
                                else {
                                    message.reply("You do not have keywords on this server.");
                                    message.delete(1 * 1000);
                                    return;
                                }
                            })
                            .catch(() => {
                                console.error;

                            });
                    }

                    else if (args[0] === "add") {
                        message.reply("Missing keyword. *notify add <keyword>");
                    }

                    else if (args[0] === "remove") {
                        message.reply("Missing keyword. *notify remove <keyword>");
                    }
                    else if (args[0] === "ignore") {
                        message.reply("Missing channel or server id. *notify ignore <channel> or <server id>");
                    }

                    else if (args[0] === "help") {
                        notifyHelp(message, prefix);
                    }
                    break;

                case 2:
                    if (args[0] === "global") {
                        let keyword = "";
                        switch (args[1]) {

                            case "list":
                                notify.tableExists()
                                    .then(exists => {
                                        if (!exists) {
                                            message.reply("A message has been sent to your direct messages.");
                                            user.send(":warning: You don't have any keywords! :warning:");
                                            throw Error("Table doesn't exist");
                                        }
                                    })
                                    .then(() => { return notify.getUserKeywords(user.id); })
                                    .then(keywords => {
                                        if (keywords.size === 0) {
                                            message.reply("A message has been sent to your direct messages.");
                                            user.send(":warning: You don't have any keywords! :warning:");
                                            return;
                                        }
                                        let msg = "";
                                        for (let item of keywords) {
                                            msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;

                                        }
                                        message.reply("A message has been sent to your direct messages.");
                                        user.send(`:earth_americas: Global Keywords: \n${msg}`);


                                    }).catch(() => {
                                        console.error;

                                    });
                                break;

                                case "clear":
                                notify.tableExists(guild.id)
                                .then(exists => {
                                    if (!exists) {
                                        message.reply("Can't find the keyword.");
                                        throw Error("Table doesn't exist");
                                    }
                                }).then(() => { return notify.removeAllUserKeywords(user.id); })
                                .then(success => {
                                    if (success) {
                                        message.reply(`Removed all global keywords.`);
                                        message.delete(1 * 1000);
                                        return;
                                    }
                                    else {
                                        message.reply("You do not have any global keywords.");
                                        message.delete(1 * 1000);
                                        return;
                                    }
                                })
                                .catch(() => {
                                    console.error;
    
                                });

                            default:
                            notifyHelp(message, prefix);
                                break;
                        }
                    }

                    else if (args[0] === "add") {
                        let keyword = args[1].toLowerCase();
                        notify.tableExists(guild.id)
                            .then(exists => {
                                if (!exists) {
                                    return notify.createTable(guild.id);
                                }
                            })
                            .then(() => { return notify.addUserKeyword(user.id, keyword, guild.id); })
                            .then(success => {
                                if (success) {
                                    message.reply("Added the keyword.");
                                    user.send(`\`${keyword}\` has been added to the server: \`${guild.name}\``);
                                    message.delete(1 * 1000);
                                    return;
                                }
                                else {
                                    message.reply("You already have this keyword.");
                                    message.delete(1 * 1000);
                                    return;
                                }
                            })

                            .catch(() => {
                                console.error;

                            });
                        return;


                    } else if (args[0] === "remove") {
                        let keyword = args[1].toLowerCase();
                        notify.tableExists(guild.id)
                            .then(exists => {
                                if (!exists) {
                                    message.reply("Can't find the keyword.");
                                    throw Error("Table doesn't exist");
                                }
                            }).then(() => { return notify.removeUserKeyword(user.id, keyword, guild.id); })
                            .then(success => {
                                if (success) {
                                    message.reply("Removed the keyword.");
                                    user.send(`\`${keyword}\` has been removed from the server: \`${guild.name}\``);
                                    message.delete(1 * 1000);
                                    return;
                                }
                                else {
                                    message.reply("The keyword does not exist.");
                                    message.delete(1 * 1000);
                                    return;
                                }
                            })

                            .catch(() => {
                                console.error;

                            });
                        return;
                    }
                    break;

                case 3:
                    if (args[0] === "global") {
                        let keyword = "";
                        switch (args[1]) {

                            case "add":
                                keyword = args[2].toLowerCase();
                                notify.tableExists()
                                    .then(exists => {
                                        if (!exists) {
                                            return notify.createTable();
                                        }
                                    })
                                    .then(() => { return notify.addUserKeyword(user.id, keyword); })
                                    .then(success => {
                                        if (success) {
                                            message.reply("Added the keyword.");
                                            user.send(`\`${keyword}\` has been added to your \`Global Keywords\``);
                                            message.delete(1 * 1000);
                                            return;
                                        }
                                        else {
                                            message.reply("You already have this keyword.");
                                            message.delete(1 * 1000);
                                            return;
                                        }
                                    })
                                    .catch(() => {
                                        console.error;

                                    });


                                break;

                            case "remove":
                                keyword = args[2].toLowerCase();
                                notify.tableExists()
                                    .then(exists => {
                                        if (!exists) {
                                            message.reply("Can't find the keyword.");
                                            throw Error("Table doesn't exist");
                                        }
                                    }).then(() => { return notify.removeUserKeyword(user.id, keyword); })
                                    .then(success => {
                                        if (success) {
                                            message.reply("Removed the keyword.");
                                            user.send(`\`${keyword}\` has been removed from the server: \`Global Keywords\``);
                                            message.delete(1 * 1000);
                                            return;
                                        }
                                        else {
                                            message.reply("The keyword does not exist.");
                                            message.delete(1 * 1000);
                                            return;
                                        }
                                    })

                                    .catch(() => {
                                        console.error;

                                    });

                                break;

                            default:
                            notifyHelp(message, prefix);
                                break;
                        }

                    } else if (args[0] === "ignore") {
                        switch (args[1]) {

                            case "channel":
                            case "chan":
                            let channel = null;
            
                            if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
                                channel = message.mentions.channels.first();
                            }
                            
                            if (!channel) return;
                                break;

                            case "server":
                                break;

                            default:
                                break;
                        }


                    }

                    break;

                default:
                notifyHelp(message, prefix);
                    break;
            }

        }


      /*   if (command === `${prefix}serverignore`) {
            let channel = null;
            
            if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
                channel = message.mentions.channels.first();
            }
            
            if (!channel) return;

            ignorenoti.guildIgnoreChan(guild.id, channel.id);
            message.channel.send(`Now ignoring \`${channel}\` for notifications.`)
            return;
        }
 */
    };

    //Notiifcations

    notifyPing = async function notifyPing(message) {
        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        const guild = message.guild;

        if (!bot.hasServerSettings(guild.id)) {
            bot.initServerSettings(guild.id);
        }
        const serverSettings = bot.getServerSettings(guild.id);
        const prefix = (serverSettings.prefix ? serverSettings.prefix : bot.botSettings.prefix);

        if (message.content.startsWith(prefix)) {

            let messageArray = message.content.split(" ");
            let command = messageArray[0];
            if ((command === `${prefix}notify`)) return;

        }

        const notifications = new Discord.Collection();
        return notify.forEachKeyword((keyword, userID) => {
            let userSet = notifications.get(keyword);
            if (!userSet) {
                userSet = new Set();
            }
            userSet.add(userID);
            notifications.set(keyword, userSet);
        }).then(() => {
            return notify.forEachKeyword((keyword, userID) => {
                let userSet = notifications.get(keyword);
                if (!userSet) {
                    userSet = new Set();
                }
                userSet.add(userID);
                notifications.set(keyword, userSet);
            }, guild.id);
        }).then(() => {
            notifications.forEach((userSet, keyword) => {
                const regex = new RegExp(`\\b(${keyword})\\b`, "ig");
                let msg = message.content;
                if (msg.search(regex) !== -1) {
                    userSet.forEach((userID) => {
                        if (message.author.id === userID) return;
                        const member = guild.member(userID);
                        if (!member) return;
                        const canRead = message.channel.permissionsFor(member).has("READ_MESSAGES");
                        if (!canRead) return;
                        member.send(`:round_pushpin: User **(${message.author})** has mentioned \`${keyword}\` in ${message.channel} on \`${guild.name}:\` \`\`\`${msg}\`\`\``);
                    })

                }
            })

        }).catch(() => {
            console.error;
        })
    };
};