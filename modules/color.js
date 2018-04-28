const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	color = function color(message, args) {

		if (args.length === 0) {
			message.channel.send("Please provide a hex color or ask for a random color with `color random`");
			return;
		}

		let color = args[0].replace("#", "");
		if (["random", "rand", "r", "ran"].includes(color)) {
			color = getRandomColor();
		}
		let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
		message.reply(`Color \`${color}\``, { files: [url] });

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