const Discord = require("discord.js");
const Notifications = require("./notifications_sql");
const notify = new Notifications();
const Ignorenoti = require("./notifications_ignore");
const ignorenoti = new Ignorenoti();

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../../functions/functions.js")(bot);

	notifySet = async function notifySet(serverSettings, message) {

		const guild = message.guild;

		const prefix = (serverSettings.prefix ? serverSettings.prefix : bot.botSettings.prefix);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);

		const user = message.author;

		// Commands for notifications

		if ((command === `${prefix}notify`)) {

			let embed, msg, keyword, channelID, perms, allowed;

			if (args.length === 0) {
				notificationEmbed(message, prefix, embed);
				return;
			}

			switch (args[0]) {

				// Lists the notification on server

				case "list":
					localKeywordList(message, guild, user, msg);
					break;

				// Clears notification on server

				case "clear":
					localClearKeywords(message, guild, user);
					break;

				// Adds per server notification

				case "add":
					localAddKeywords(message, args, guild, user, prefix, embed, keyword);
					break;

				// Removes per server notification

				case "remove":
					localRemoveKeywords(message, args, guild, user, prefix, embed, keyword);
					break;

				// Start of global notifications 	

				case "global":
					if (args.length === 1) {
						notificationEmbed(message, prefix, embed);
						return;
					}
					keyword = "";
					switch (args[1]) {

						// Lists all global notificatons 

						case "list":
							globalKeywordList(message, user, msg);
							break;

						// Clears all global notifications

						case "clear":
							globalClearKeywords(message, guild, user);
							break;

						// Adds a global notificaton

						case "add":
							globalAddKeywords(message, args, user, prefix, embed, keyword);
							break;

						// Removes global notification

						case "remove":
							globalRemoveKeywords(message, args, user, prefix, embed, keyword);
							break;

						default:
							notificationEmbed(message, prefix, embed);
							break;
					}
					break;

				// Toggles ignore between channel and server

				case "ignore":
					switch (args[1]) {
						case "channel":
						case "chan":
							globalIgnoreChannel(message, user);
							break;

						case "guild":
						case "server":
							globalIgnoreServer(message, user, guild);
							break;

						default:
							notificationEmbed(message, prefix, embed);
							break;

					}
					break;

				// Allows a server to ignore a channel for notifications

				case "serverignore":
					serverIgnoreServer(message, guild, channelID, perms, allowed);
					break;

				default:
					notificationEmbed(message, prefix, embed);
					break;
			}
		}
	};

	// Notifications
	notifyPing = async function notifyPing(message) {

		const guild = message.guild;

		try {
			let ignored = await ignorenoti.isGuildIgnoredChannel(guild.id, message.channel.id);
			if (ignored) {
				console.log("Guild Ignored the Channel");
				return;
			}
		} catch (error) {
			console.log(error.message);
		}

		const keywordsCollection = new Discord.Collection();
		const notifications = new Discord.Collection();
		try {
			await notify.forEachKeyword(async (keyword, userID) => {
				let ignored = await ignorenoti.isUserIgnoredChannel(userID, message.channel.id);

				if (ignored) {
					console.log("User Ignored the Channel");
					return;
				}

				try {
					let ignored = await ignorenoti.isUserIgnoredGuild(userID, guild.id);

					if (ignored) {
						console.log("User Ignored the Guild");
						return;
					}
				} catch (error) {
					console.log(error.message);
				}

				let userSet = keywordsCollection.get(keyword);
				if (!userSet) {
					userSet = new Set();
				}
				userSet.add(userID);
				keywordsCollection.set(keyword, userSet);
			});
		} catch (error) {
			console.log(error.message);
		}

		try {
			await notify.forEachKeyword(async (keyword, userID) => {
				await ignorenoti.isUserIgnoredChannel(userID, message.channel.id);

				let userSet = keywordsCollection.get(keyword);
				if (!userSet) {
					userSet = new Set();
				}
				userSet.add(userID);
				keywordsCollection.set(keyword, userSet);

			}, guild.id);
		} catch (error) {
			console.log(error.message);
		}

		await keywordsCollection.forEach((userSet, keyword) => {
			const cleaned_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(`\\b(${cleaned_keyword})\\b`, "ig");
			let msg = message.content;
			if (msg.search(regex) !== -1) {
				userSet.forEach((userID) => {
					if (message.author.id === userID) return;
					const member = guild.member(userID);
					if (!member) return;
					const canRead = message.channel.permissionsFor(member).has("VIEW_CHANNEL");
					if (!canRead) return;
					let keywordSet = notifications.get(userID);
					if (!keywordSet) {
						keywordSet = new Set();
					}
					keywordSet.add(keyword);
					notifications.set(userID, keywordSet);
				});
			}
		});

		if (!notifications) return;
		if (notifications.size === 0) return;
		notifications.forEach((keywordSet, userID) => {
			const member = guild.members.get(userID);
			if (!member) return;
			let msg = message.content.replace(/`/g, "'");
			const keywords = Array.from(keywordSet).map(key => `\`${key}\``).join(", ");
			member.send(`:round_pushpin: User **${message.author.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}** **(${message.author})** has mentioned ${keywords} in ${message.channel} on \`${guild.name}:\` \`\`\`${msg}\`\`\``).catch(console.error);
		});
	};
};

// Notify embed function

notificationEmbed = function notificationEmbed(message, prefix, embed) {
	embed = new Discord.RichEmbed();
	notifyHelp(prefix, embed);
	sendEmbed(message, embed);
};

// Notify list for local keywords

localKeywordList = async function localKeywordList(message, guild, user, msg) {
	try {
		const exists = await notify.tableExists(guild.id);
		if (!exists) {
			message.reply("A message has been sent to your direct messages.").catch(console.error);
			user.send(":warning: You don't have any keywords! :warning:").catch(console.error);
		}
		await notify.getUserKeywords(user.id, guild.id);
		const keywords = await notify.getUserKeywords(user.id, guild.id);
		if (keywords.size === 0) {
			message.reply("A message has been sent to your direct messages.").catch(console.error);
			user.send(":warning: You don't have any keywords! :warning:").catch(console.error);
			return;
		}
		msg = "";
		for (let item of keywords) {
			msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;

		}
		message.reply("A message has been sent to your direct messages.").catch(console.error);
		user.send(`:round_pushpin: Keywords for the server: \`${guild.name}\` : \n${msg}`).catch(console.error);
	} catch (error) {
		console.log(error);
	}
};

// Notify clear for local keywords

localClearKeywords = async function localClearKeywords(message, guild, user) {
	try {
		const exists = await notify.tableExists(guild.id);
		if (!exists) {
			message.reply("Can't find the keyword.").catch(console.error);
		}
		const success = await notify.removeAllUserKeywords(user.id, guild.id);
		if (success) {
			message.reply(`Removed all keywords on \`${guild.name}\``).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Notify add for local words

localAddKeywords = async function localAddKeywords(message, args, guild, user, prefix, embed, keyword) {
	if (args.length === 1) {
		notificationEmbed(message, prefix, embed);
		return;
	}
	keyword = args.slice(1).join(" ").toLowerCase();
	try {
		const exists = await notify.tableExists(guild.id);
		if (!exists) {
			return await notify.createTable(guild.id);
		}
		const success = await notify.addUserKeyword(user.id, keyword, guild.id);
		if (success) {
			message.reply("Added the keyword.").catch(console.error);
			user.send(`\`${keyword}\` has been added to the server: \`${guild.name}\``).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		} else {
			message.reply("You already have this keyword.").catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Notify remove for local words

localRemoveKeywords = async function localRemoveKeywords(message, args, guild, user, prefix, embed, keyword) {
	if (args.length === 1) {
		notificationEmbed(message, prefix, embed);
		return;
	}
	keyword = args.slice(1).join(" ").toLowerCase();
	try {
		const exists = await notify.tableExists(guild.id);
		if (!exists) {
			message.reply("Can't find the keyword.").catch(console.error);
		}
		const success = await notify.removeUserKeyword(user.id, keyword, guild.id);
		if (success) {
			message.reply("Removed the keyword.").catch(console.error);
			user.send(`\`${keyword}\` has been removed from the server: \`${guild.name}\``).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		} else {
			message.reply("The keyword does not exist.").catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Notify list for global keywords

globalKeywordList = async function globalKeywordList(message, user, msg) {
	try {
		const exists = await notify.tableExists();
		if (!exists) {
			message.reply("A message has been sent to your direct messages.").catch(console.error);
			user.send(":warning: You don't have any global keywords! :warning:").catch(console.error);
		}
		const keywords = await notify.getUserKeywords(user.id);
		if (keywords.size === 0) {
			message.reply("A message has been sent to your direct messages.").catch(console.error);
			user.send(":warning: You don't have any global keywords! :warning:").catch(console.error);
			return;
		}
		msg = "";
		for (let item of keywords) {
			msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;
		}
		message.reply("A message has been sent to your direct messages.").catch(console.error);
		user.send(`:earth_americas: Global Keywords: \n${msg}`).catch(console.error);
	} catch (error) {
		console.log(error);
	}
};

// Notify clear for global keywords

globalClearKeywords = async function globalClearKeywords(message, guild, user) {
	try {
		const exists = await notify.tableExists(guild.id);
		if (!exists) {
			message.reply("Can't find the keyword.").catch(console.error);
		}
		const success = await notify.removeAllUserKeywords(user.id);
		if (success) {
			message.reply(`Removed all global keywords.`).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Notify add for global words

globalAddKeywords = async function globalAddKeywords(message, args, user, prefix, embed, keyword) {
	if (args.length === 2) {
		notificationEmbed(message, prefix, embed);
		return;
	}
	keyword = args.slice(2).join(" ").toLowerCase();
	try {
		const exists = await notify.tableExists();
		if (!exists) {
			return await notify.createTable();
		}
		const success = await notify.addUserKeyword(user.id, keyword);

		if (success) {
			message.reply("Added the keyword.").catch(console.error);
			user.send(`\`${keyword}\` has been added to your \`Global Keywords\``).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		} else {
			message.reply("You already have this keyword.").catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Notify remove for local words

globalRemoveKeywords = async function globalRemoveKeywords(message, args, user, prefix, embed, keyword) {
	if (args.length === 2) {
		notificationEmbed(message, prefix, embed);
		return;
	}
	keyword = args.slice(2).join(" ").toLowerCase();
	try {
		const exists = await notify.tableExists();
		if (!exists) {
			message.reply("Can't find the keyword.").catch(console.error);
		}
		const success = await notify.removeUserKeyword(user.id, keyword);
		if (success) {
			message.reply("Removed the keyword.").catch(console.error);
			user.send(`\`${keyword}\` has been removed from the server: \`Global Keywords\``).catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		} else {
			message.reply("The keyword does not exist.").catch(console.error);
			message.delete(1 * 1000).catch(console.error);
			return;
		}
	} catch (error) {
		console.log(error);
	}
};

// Lets user ignore a channel for notifications

globalIgnoreChannel = async function globalIgnoreChannel(message, user) {
	if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
		channel = message.mentions.channels.first();
	} else {
		message.channel.send(`Please mention a channel to ignore.`).catch(console.error);
	}
	channelID = channel.id;
	try {
		const result = await ignorenoti.userToggleIgnoreChannel(user.id, channel.id);

		switch (result) {
			case 1:
				message.author.send(`You will no longer receive notifications from ${channel}`).catch(console.error);
				break;
			case -1:
				message.author.send(`You will now receive notifications from ${channel}`).catch(console.error);
				break;

			default:
				notificationEmbed(message, prefix, embed);
				break;
		}
	} catch (error) {
		console.log(error);
	}
};

// Lets user ignore a server for notifications

globalIgnoreServer = async function globalIgnoreServer(message, user, guild) {
	try {
		const result = await ignorenoti.userToggleIgnoreGuild(user.id, guild.id);
		switch (result) {
			case 1:
				message.author.send(`You will no longer receive notifications from ${guild}`).catch(console.error);
				break;

			case -1:
				message.author.send(`You will now receive notifications from ${guild}`).catch(console.error);
				break;

			default:
				notificationEmbed(message, prefix, embed);
				break;
		}
	} catch (error) {
		console.log(error);
	}
};

// Allows a server to ignore a channel in the guild

serverIgnoreServer = async function serverIgnoreServer(message, guild, channelID, perms, allowed) {
	perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
	allowed = false;

	for (i = 0; i < perms.length; i++) {
		if (message.member.hasPermission(perms[i])) allowed = true;
	}
	if (!allowed) return;
	if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
		channel = message.mentions.channels.first();
	} else {
		message.channel.send(`Please mention a channel to ignore.`).catch(console.error);
		return;
	}
	channelID = channel.id;
	try {
		const result = await ignorenoti.guildToggleIgnoreChannel(guild.id, channelID)

		switch (result) {
			case 1:
				message.channel.send(`Guild members not will receive notifications from ${channel}`).catch(console.error);
				break;
			case -1:
				message.channel.send(`Guild members will now receive notifications from ${channel}`).catch(console.error);
				break;

			default:
				notificationEmbed(message, prefix, embed);
				break;
		}
	} catch (error) {
		console.log(error);
	}
};

//Code for embed notification with message link

/* let embed = new Discord.RichEmbed()
.setAuthor(message.author.username, message.author.displayAvatarURL.split("?")[0])
.setThumbnail(message.author.displayAvatarURL.split("?")[0])
.setTimestamp(message.createdAt)
.setColor('#124D39')
.addField("Mentioned", keywords)
.addField("Message", msg)
.addField("Channel", message.channel.toString(), true)
.addField("Guild", guild.name, true)
.addField("Context", `You can see the context of the message [here](http://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
member.send(embed); */