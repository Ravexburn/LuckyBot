const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Lists the servers LB is in.

	serverList = function serverList(message) {
		let i = 1;
		const limit = 25;
		let arr = bot.guilds.array().sort();
		while (arr.length > 0) {
			let list = arr.slice(0, limit).map(guild => `\`${i++}. ${guild.name} - <${guild.id}>\n\``);
			message.channel.send(list);
			arr = arr.slice(limit);
		}
	};

	//Tells LB to leave a server.

	serverLeave = function serverLeave(message, args) {
		if (args.length < 2) {
			let i = 1;
			const limit = 25;
			let arr = bot.guilds.array().sort();
			while (arr.length > 0) {
				let list = arr.slice(0, limit).map(guild => `\`${i++}. ${guild.name} - <${guild.id}>\n\``);
				message.channel.send(list);
				arr = arr.slice(limit);
			}
			let author = message.author;
			message.channel.send("You have 60 seconds to choose a server to leave")
				.then(() => {
					message.channel.awaitMessages(response => response.author.id === author.id, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
							message.channel.send(`Acknowledged ${collected.first().content}`);
							let input = collected.first().content;

							if (input.length < 18) {
								let num = parseInt(input);

								if (num === isNaN) {
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
	};

	//Checks what's enabled on a server

	serverModSettings = function serverModSettings(message, args) {
		if (args.length === 1) {
			let serverSettings = bot.getServerSettings(message.guild.id);
			if (!serverSettings) { message.channel.send(`Could not get settings for this server.`); return; }
			let list = ["prefix", "logsOn", "autoRoleOn", "welcomeOn", "roleChannelID"];
			let embed = new Discord.RichEmbed()
				.setTitle(`Settings for ${message.guild.name}`)
				.setColor("#228B22");
			for (const key of list) {
				embed.addField(key, serverSettings[key]);
			}
			message.channel.send(embed);
			return;
		} else if (args.length === 2) {
			let id = args[1];
			if (!bot.guilds.has(id)) return;
			let guild = bot.guilds.get(id);
			let serverSettings = bot.getServerSettings(id);
			if (!serverSettings) { message.channel.send(`Could not get settings for this server.`); return; }
			let list = ["prefix", "logsOn", "autoRoleOn", "welcomeOn", "rolesOn"];
			let embed = new Discord.RichEmbed()
				.setTitle(`Settings for ${guild.name}`)
				.setColor("#228B22");
			for (const key of list) {
				embed.addField(key, serverSettings[key] + "­");
			}
			message.channel.send(embed);
			return;
		}
	};
};