const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("./../functions/helpfunctions.js")(bot);
	require("./color.js")(bot);
	require("./horoscope.js")(bot);

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

		if ((command === `${prefix}horoscope`)|| (command === `${prefix}hs`)) {
			let regsign = `Please save your sunsign by using \`${prefix}horoscope set <sunsign>\``;
			switch (args[0]) {

				default:
				case "today":
				case "day":
					time = "today";
					horoInfo(message, time);
					break;

				case "set":
				case "save":
					horoscopeSet(message, args);
					break;

				case "week":
					time = "week";
					horoInfo(message, time);
					break;

				case "month":
					time = "month";
					horoInfo(message, time);
					break;

				case "year":
					time = "year";
					horoInfo(message, time);
					break;
			}
		}




	};
};