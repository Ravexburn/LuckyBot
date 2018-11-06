const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../misc/color.js")(bot);
	require("../misc/horoscope.js")(bot);

	miscCommands = async function miscCommands(message) {

		if (message.system) return;
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;

		const serverSettings = bot.getServerSettings(message.guild.id);
		if (!serverSettings) return;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		let prefix = serverSettings.prefix;
		if (!command.startsWith(prefix)) return;

		if ((command === `${prefix}color`) || (command === `${prefix}colour`)) {
			switch (args[0]) {
				case "rand":
				case "random":
				case "r":
				case "ran":
					colorRandom(message);
					break;

				default:
					color(message, args);
					return;
			}
		}

		if ((command === `${prefix}horoscope`) || (command === `${prefix}hs`)) {

			switch (args[0]) {

				default:
				case "today":
				case "day":
					time = "today";
					horoInfo(message, time, prefix);
					break;

				case "set":
				case "save":
					horoscopeSet(message, args);
					break;

				case "tomorrow":
					time = "tomorrow";
					horoInfo(message, time, prefix);
					break;

				case "yesterday":
					time = "yesterday";
					horoInfo(message, time, prefix);
					break;

				case "list":
					horoList(message);
					break;
			}
		}

	};
};