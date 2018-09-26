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

						msg += `**These settings will be logged in: ${chan}.**`;

						embed.setDescription(msg);
						message.channel.send(embed);

					}).catch((error) => {
						message.channel.send("Command time out, please use command again to set up message logs.");
						console.log(error);
					});
			}).catch((error) => {
				console.log(error);
			});
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
		message.channel.send("This feature is currently disabled sorry for the inconvenience");
		return;
		if (args.length === 1){
			message.channel.send("Please provide a link for your image. For `gifv` links remove the `v`.");
			return;
		}
		let image = args[1];
		message.channel.send(`Welcome image set ${image}`);
		serverSettings.welcomeImage = image;
		bot.setServerSettings(message.guild, serverSettings);
	};

	/**
     * Starboard channel
     * @param {Message} message 
     */
	starboardChan = function starboardChan(message, serverSettings, command) {
		if (message.mentions.channels != null && message.mentions.channels.size !== 0) {
			let chan = message.mentions.channels.first();
			message.channel.send("Starboard channel set to: " + chan);
			serverSettings.starboardChannelID = chan.id;
			bot.setServerSettings(message.guild.id, serverSettings);
		} else {
			message.channel.send(`Please mention a channel ${command} <channel> <#channelname>`);
		}
	};
};
