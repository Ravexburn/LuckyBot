const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {
	/**
     * Message logs channel and options
     * @param {Message} message 
     */
	logChan = function logChan(message) {

		let author = message.author;
		if (message.mentions.channels == null || message.mentions.channels.size === 0) {
			message.channel.send(`Please choose a channel for message logs.`);
			return;
		}
		let chan = message.mentions.channels.first();
		let embed = new Discord.RichEmbed();
		embed.setTitle(`Message Log Setup`)
			.setColor("#a8e8eb")
			.setDescription(`Please select what you would like to include in the message log.
    
1. All messages being sent.

2. Edited messages.

3. Deleted messages.

4. Images.

5. All features.

After you have made your decision react with the :floppy_disk: to save.`);

		message.channel.send(embed)
			.then(async function (message) {
				await message.react("1⃣");
				await message.react("2⃣");
				await message.react("3⃣");
				await message.react("4⃣");
				await message.react("5⃣");
				await message.react("💾");
				return message;
			}).then(function (message) {
				message.awaitReactions((reaction, user) => reaction.emoji.name === "💾" && user.id === author.id, { max: 1, time: 600000, errors: ['time'] })
					.then(() => {
						let reactions = message.reactions;
						let log = {
							messageLog: false,
							editLog: false,
							deleteLog: false,
							imageLog: false,
						};
						reactions.forEach(r => {
							if (!r.me) return;

							if (!r.users.has(author.id)) return;

							switch (r.emoji.name) {

								case "1⃣":

									log.messageLog = true;
									break;

								case "2⃣":

									log.editLog = true;
									break;

								case "3⃣":

									log.deleteLog = true;
									break;

								case "4⃣":

									log.imageLog = true;
									break;

								case "5⃣":

									log.messageLog = true;
									log.editLog = true;
									log.deleteLog = true;
									log.imageLog = true;
									break;

								default:
									break;

							}
						});

						let serverSettings = bot.getServerSettings(message.guild.id);
						//Updates logs on    
						serverSettings.logsOn = (log.messageLog || log.editLog || log.deleteLog || log.imageLog);
						//Updates features
						serverSettings.messageLog = log.messageLog;
						serverSettings.editLog = log.editLog;
						serverSettings.deleteLog = log.deleteLog;
						serverSettings.imageLog = log.imageLog;
						//Updates id
						if (serverSettings.logsOn) {
							serverSettings.channelID = chan.id;
							serverSettings.editChannelID = chan.id;
							serverSettings.deleteChannelID = chan.id;
							serverSettings.imageChannelID = chan.id;
						}
						bot.setServerSettings(message.guild.id, serverSettings);

						let embed = new Discord.RichEmbed();
						embed.setTitle(`These are the settings selected for message logs:`)
							.setColor("#a8e8eb");
						let msg = "";
						for (let value in log) {
							if (log[value]) {
								msg += `${value} = ${log[value]}\n\n`;
							}
						}

						msg += `\*\*These settings will be logged in: ${chan}.\*\*`;

						embed.setDescription(msg);
						message.channel.send(embed);

					}).catch((error) => {
						message.channel.send("Command time out, please use command again to set up message logs.");
						console.log(error);
					});
			}).catch((error) => {
				console.log(error);
			});

		//Centralized Logs

		/*    if (bot.centlog === false) return;
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
               }); */
	};

	/**
     * Roles channel
     * @param {Message} message 
     */
	rolesChan = function roleChan(message, serverSettings, command) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Now doing roles in: " + chan);
			serverSettings.roleChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} <roles> <#channelname>`);
		}
	};

	/**
     * Join and leave channel
     * @param {Message} message 
     */
	joinChan = function joinChan(message, serverSettings, command) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Now logging joins and leaves in: " + chan);
			serverSettings.joinChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} <join> <#channelname>`);
		}
	};

	/**
     * Edited messages channel
     * @param {Message} message 
     */
	editChan = function editChan(message, serverSettings, command, args) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Now logging edits in: " + chan);
			serverSettings.editChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} ${args[0]} <#channelname>`);
		}
	};

	/**
     * Deleted messages channel
     * @param {Message} message 
     */
	delChan = function delChan(message, serverSettings, command, args) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Now logging deletes in: " + chan);
			serverSettings.deleteChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} ${args[0]} <#channelname>`);
		}
	};

	/**
     * Greeter channel
     * @param {Message} message 
     */
	welChan = function welChan(message, serverSettings, command) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Greeter channel set to: " + chan);
			serverSettings.welcomeChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} <channel> <#channelname>`);
		}
	};

	welImage = function welImage(message, serverSettings, args) {
		if (args.length === 1){
			message.channel.send("Please provide a link for your image. For `gifv` links remove the `v`.");
			return;
		}
		let image = args[1];
		message.channel.send(`Welcome image set ${image}`);
		serverSettings.welcomeImage = image;
		bot.setServerSettings(message.guild, serverSettings);
	};
};
