const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	color = function color(message, args) {
		if (args.length === 0) {
			message.channel.send("Please provide a hex color or ask for a random color with `color random`");
			return;
		}

		let color = args[0].replace("#", "").toUpperCase();
		let len = color.length;
		if (len > 6 || len < 6) {
			message.reply("Please provide a 6 digit hex code");
			return;
		}

		const colorregexp = new RegExp("[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]");
		const matches = color.match(colorregexp);
		if (matches) {
			let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
			message.reply(`Color \`#${color}\``, { files: [url] });
			return;
		} else {
			message.reply("Please provide a valid hex code");
			return;
		}
	};

	colorRandom = function colorRandom(message) {
		let color = getRandomColor();
		let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
		message.reply(`Color \`#${color}\``, { files: [url] });
		return;
	};
};

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = "";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}