const Discord = require("discord.js");
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    //Lists the servers LB is in.

    serverList = function serverList(message) {

        let msg = "```md\n"
        let i = 1;
        bot.guilds.forEach(guild => {
            msg += `${i++}. ${guild.name} - <${guild.id}>\n`;
        });
        msg += "```";
        message.channel.send(msg);

    }

    //Tells LB to leave a server.

    serverLeave = function serverLeave(message, args) {
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

    }

}