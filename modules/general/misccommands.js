const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../misc/avatar.js")(bot);
	require("../misc/color.js")(bot);
	require("../misc/guild_icon.js")(bot);
	require("../misc/horoscope.js")(bot);

	miscCommands = async function miscCommands(serverSettings, message) {

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		let prefix = serverSettings.prefix;

		if ((command === `${prefix}color`) || (command === `${prefix}colour`)) {

			if (args.length === 0) {
				message.channel.send(`Please provide a hex color or ask for a random color with \`${command} random\``).catch(console.error);
				return;
			}

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
			return;
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

				case "help":
					embed = new Discord.RichEmbed();
					horoHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
			return;
		}

		if ((command === `${prefix}avatar`) || (command === `${prefix}ava`)) {
			avatar(message, args);
			return;
		}

		if ((command === `${prefix}servericon`) || (command === `${prefix}guildicon`)) {
			guildIcon(message, args);
			return;
		}

	};

};