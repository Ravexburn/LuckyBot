const Discord = require("discord.js");
const Notifications = require("./notifications_sql");
const notify = new Notifications();
const Ignorenoti = require("./notifications_ignore");
const ignorenoti = new Ignorenoti();

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../../functions/functions.js")(bot);

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

			let embed;
			let msg;
			let keyword;
			let channelID;
			let perms;
			let allowed;

			if (args.length === 0) {
				notificationEmbed(message, prefix, embed);
				return;
			}

			switch (args[0]) {

				//Lists the notification on server

				case "list":
					notify.tableExists(guild.id)
						.then(exists => {
							if (!exists) {
								message.reply("A message has been sent to your direct messages.");
								user.send(":warning: You don't have any keywords! :warning:");
								return Promise.reject("Table doesn't exist");
							}
						})
						.then(() => { return notify.getUserKeywords(user.id, guild.id); })
						.then(keywords => {
							if (keywords.size === 0) {
								message.reply("A message has been sent to your direct messages.");
								user.send(":warning: You don't have any keywords! :warning:");
								return;
							}
							msg = "";
							for (let item of keywords) {
								msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;

							}
							message.reply("A message has been sent to your direct messages.");
							user.send(`:round_pushpin: Keywords for the server: \`${guild.name}\` : \n${msg}`);


						}).catch(() => {
							console.error;
						});

					break;

				//Clears notification on server

				case "clear":
					notify.tableExists(guild.id)
						.then(exists => {
							if (!exists) {
								message.reply("Can't find the keyword.");
								return Promise.reject("Table doesn't exist");
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
					break;

				//Adds per server notification

				case "add":
					if (args.length === 1) {
						notificationEmbed(message, prefix, embed);
						return;
					}
					keyword = args.slice(1).join(" ").toLowerCase();
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
					break;

				//Removes per server notification

				case "remove":
					if (args.length === 1) {
						notificationEmbed(message, prefix, embed);
						return;
					}
					keyword = args.slice(1).join(" ").toLowerCase();
					notify.tableExists(guild.id)
						.then(exists => {
							if (!exists) {
								message.reply("Can't find the keyword.");
								return Promise.reject("Table doesn't exist");
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

					break;

				case "global":
					if (args.length === 1) {
						notificationEmbed(message, prefix, embed);
						return;
					}
					keyword = "";
					switch (args[1]) {

						//Lists all global notificatons 

						case "list":
							notify.tableExists()
								.then(exists => {
									if (!exists) {
										message.reply("A message has been sent to your direct messages.");
										user.send(":warning: You don't have any keywords! :warning:");
										return Promise.reject("Table doesn't exist");
									}
								})
								.then(() => { return notify.getUserKeywords(user.id); })
								.then(keywords => {
									if (keywords.size === 0) {
										message.reply("A message has been sent to your direct messages.");
										user.send(":warning: You don't have any keywords! :warning:");
										return;
									}
									msg = "";
									for (let item of keywords) {
										msg += ((msg.length === 0) ? "" : "\n") + `\`${item}\``;
									}
									message.reply("A message has been sent to your direct messages.");
									user.send(`:earth_americas: Global Keywords: \n${msg}`);
								}).catch(() => {
									console.error;
								});
							break;

						//Clears all global notifications

						case "clear":
							notify.tableExists(guild.id)
								.then(exists => {
									if (!exists) {
										message.reply("Can't find the keyword.");
										return Promise.reject("Table doesn't exist");
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
							break;

						//Adds a global notificaton

						case "add":
							if (args.length === 2) {
								notificationEmbed(message, prefix, embed);
								return;
							}
							keyword = args.slice(2).join(" ").toLowerCase();
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

						//Removes global notification

						case "remove":
							if (args.length === 2) {
								notificationEmbed(message, prefix, embed);
								return;
							}
							keyword = args.slice(2).join(" ").toLowerCase();
							notify.tableExists()
								.then(exists => {
									if (!exists) {
										message.reply("Can't find the keyword.");
										return Promise.reject("Table doesn't exist");
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
							notificationEmbed(message, prefix, embed);
							break;
					}
					break;

				//Toggles ignore between channel and server

				case "ignore":
					switch (args[1]) {
						case "channel":
						case "chan":
							if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
								channel = message.mentions.channels.first();
							} else {
								message.channel.send(`Please mention a channel to ignore.`);
							}
							channelID = channel.id;
							ignorenoti.userToggleIgnoreChannel(user.id, channel.id)
								.then((result) => {
									switch (result) {
										case 1:
											message.author.send(`You will no longer receive notifications from ${channel}`);
											break;
										case -1:
											message.author.send(`You will now receive notifications from ${channel}`);
											break;

										default:
											notificationEmbed(message, prefix, embed);
											break;
									}
								}).catch((reason) => {
									console.log(reason);
								});
							break;

						case "guild":
						case "server":
							ignorenoti.userToggleIgnoreGuild(user.id, guild.id)
								.then((result) => {
									switch (result) {
										case 1:
											message.author.send(`You will no longer receive notifications from ${guild}`);
											break;

										case -1:
											message.author.send(`You will now receive notifications from ${guild}`);
											break;

										default:
											notificationEmbed(message, prefix, embed);
											break;
									}
								}).catch((reason) => {
									console.log(reason);
								});
							break;

						default:
							notificationEmbed(message, prefix, embed);
							break;

					}
					break;

				//Allows a server to ignore a channel for notifications

				case "serverignore":
					perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
					allowed = false;

					for (i = 0; i < perms.length; i++) {
						if (message.member.hasPermission(perms[i])) allowed = true;
					}
					if (!allowed) return;
					if (message.mentions.channels !== null && message.mentions.channels.size !== 0) {
						channel = message.mentions.channels.first();
					} else {
						message.channel.send(`Please mention a channel to ignore.`);
						return;
					}
					channelID = channel.id;
					ignorenoti.guildToggleIgnoreChannel(guild.id, channelID)
						.then((result) => {
							switch (result) {
								case 1:
									message.channel.send(`Guild members not will receive notifications from ${channel}`);
									break;
								case -1:
									message.channel.send(`Guild members will now receive notifications from ${channel}`);
									break;

								default:
									notificationEmbed(message, prefix, embed);
									break;
							}
						}).catch((reason) => {
							console.log(reason);
						});
					break;

				default:
					notificationEmbed(message, prefix, embed);
					break;
			}
		}
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

		if (message.content.startsWith(prefix)) return;

		ignorenoti.isGuildIgnoredChannel(guild.id, message.channel.id)
			.then((ignored) => {
				if (ignored) {
					return Promise.reject("Guild Ignored the Channel");
				}
			}).then(() => {
				const keywordsCollection = new Discord.Collection();
				const notifications = new Discord.Collection();
				return notify.forEachKeyword((keyword, userID) => {
					return ignorenoti.isUserIgnoredChannel(userID, message.channel.id)
						.then((ignored) => {
							if (ignored) {
								return Promise.reject("User Ignored the Channel");
							}
						}).then(() => {
							return ignorenoti.isUserIgnoredGuild(userID, guild.id);
						}).then((ignored) => {
							if (ignored) {
								return Promise.reject("User Ignored the Guild");
							}
						}).then(() => {
							let userSet = keywordsCollection.get(keyword);
							if (!userSet) {
								userSet = new Set();
							}
							userSet.add(userID);
							keywordsCollection.set(keyword, userSet);
						}).catch((reason) => {
							if (reason !== "User Ignored the Guild") {
								console.log(reason);
							}
						});
				}).then(() => {
					return notify.forEachKeyword((keyword, userID) => {
						return ignorenoti.isUserIgnoredChannel(userID, message.channel.id)
							.then((ignored) => {
								if (ignored) {
									return Promise.reject("User Ignored the Channel");
								}
							}).then(() => {
								let userSet = keywordsCollection.get(keyword);
								if (!userSet) {
									userSet = new Set();
								}
								userSet.add(userID);
								keywordsCollection.set(keyword, userSet);
							}).catch((reason) => {
								if (reason !== "User Ignored the Channel") {
									console.log(reason);
								}
							});
					}, guild.id);
				}).then(() => {
					return keywordsCollection.forEach((userSet, keyword) => {
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
				}).then(() => {
					if (!notifications) return;
					if (notifications.size === 0) return;
					notifications.forEach((keywordSet, userID) => {
						const member = guild.members.get(userID);
						if (!member) return;
						let msg = message.content.replace(/`/g, "'");
						const keywords = Array.from(keywordSet).map(key => `\`${key}\``).join(", ");
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
						member.send(`:round_pushpin: User **${message.author.username}** **(${message.author})** has mentioned ${keywords} in ${message.channel} on \`${guild.name}:\` \`\`\`${msg}\`\`\``);
					});
				}).catch(() => {
					console.error;
				});
			}).catch((reason) => {
				if (reason !== "Guild Ignored the Channel") {
					console.log(reason);
				}
			});
	};
};

notificationEmbed = function notificationEmbed(message, prefix, embed) {
	embed = new Discord.RichEmbed();
	notifyHelp(prefix, embed);
	sendEmbed(message, embed);
};