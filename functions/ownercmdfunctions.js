const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	// Lists the servers LB is in.

	serverList = function serverList(message) {
		let i = 1;
		let list = bot.guilds.array().sort().map(guild => `${i++}. ${guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} - ${guild.id} - \*\*Member count: ${guild.memberCount}\*\*`);
		let pages = toEmbedPages(list);
		embed = new Discord.RichEmbed()
			.setTitle(`${bot.user.username} Servers`)
			.setColor("#57A80D");
		embedPages(message, embed, pages);
	};

	// Tells LB to leave a server.

	serverLeave = async function serverLeave(message, args) {
		if (args.length < 2) {
			let i = 1;
			let list = bot.guilds.array().sort().map(guild => `${i++}. ${guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} - ${guild.id} - \*\*Member count: ${guild.memberCount}\*\*`);
			let pages = toEmbedPages(list);
			embed = new Discord.RichEmbed()
				.setTitle(`${bot.user.username} Servers`)
				.setColor("#57A80D");
			embedPages(message, embed, pages);
			let author = message.author;
			try {
				await message.channel.send("You have 60 seconds to choose a server to leave").catch(console.error);
				let collected = await message.channel.awaitMessages(response => response.author.id === author.id, { max: 1, time: 60000, errors: ['time'] });
				message.channel.send(`Acknowledged ${collected.first().content}`).catch(console.error);
				let input = collected.first().content;
				try {
					if (input.length < 18) {

						let num = parseInt(input);

						if (isNaN(num)) {
							message.channel.send("Not a valid server has letters in id <:yfist:378373231079587840>").catch(console.error);
							return;
						}

						message.channel.send("Not a valid server less than 18 numbers <:yfist:378373231079587840>").catch(console.error);
						return;

					} else {

						let id = input;
						if (!bot.guilds.has(id)) {
							message.channel.send("Bot is not in that server <:yfist:378373231079587840>").catch(console.error);
							return;
						}

						let guild = bot.guilds.get(id);
						guild.leave().catch(console.error);
						message.channel.send(`Successfully left \`${guild}\``).catch(console.error);
					}
				} catch (error) {
					console.log(error.message);
				}
				return;
			} catch (error) {
				console.log(error.message);
			}
		}

		if (args[1].length > bot.guilds.size.toString().length) {

			let id = args[1];
			if (!bot.guilds.has(id)) {
				message.channel.send("Bot is not in that server <:yfist:378373231079587840>").catch(console.error);
				return;
			}

			let guild = bot.guilds.get(id);
			guild.leave().catch(console.error);
			message.channel.send(`Successfully left \`${guild}\``).catch(console.error);

		}
	};

	// Checks what's enabled on a server and other info

	serverModSettings = function serverModSettings(message, args) {
		if (args.length === 1) {
			let guild = message.guild;
			let serverSettings = bot.getServerSettings(guild.id);
			if (!serverSettings) {
				message.channel.send(`Could not get settings for this server.`).catch(console.error);
				return;
			}
			guildembed(message, serverSettings, guild);
		} else if (args.length === 2) {
			let id = args[1];
			if (!bot.guilds.has(id)) return;
			let guild = bot.guilds.get(id);
			let serverSettings = bot.getServerSettings(id);
			if (!serverSettings) {
				message.channel.send(`Could not get settings for this server.`).catch(console.error);
				return;
			}
			guildembed(message, serverSettings, guild);
		}
	};

	// Embed for info

	guildembed = function guildembed(message, serverSettings, guild) {
		emote(serverSettings, guild);
		let embed = new Discord.RichEmbed()
			.setTitle(`Settings for ${guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
			.setThumbnail(guild.iconURL)
			.addField("Owner", guild.owner.user.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), true)
			.addField("Server ID", guild.id, true)
			.addField("Server Prefix", serverSettings.prefix, true)
			.addField("Member Count", guild.memberCount, true)
			.addField("Server Creation", guild.createdAt.toLocaleString(), true)
			.addField("Adblock Enabled", adblockemote, true)
			.addField("Server Available", guildemote, true)
			.setTimestamp();
		message.channel.send(embed).catch(console.error);
		return;
	};

	// Condition for t/f

	function emote(serverSettings, guild) {
		if (serverSettings.adBlocktoggle === true) {
			adblockemote = ":white_check_mark:";
		} else {
			adblockemote = ":x:";
		}
		if (guild.available === true) {
			guildemote = ":white_check_mark:";
		} else {
			guildemote = ":x:";
		}
	}
};