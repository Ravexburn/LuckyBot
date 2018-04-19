const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	color = function color(message, args) {

		if (args.length === 0) {
			message.channel.send("Please provide a hex color");
			return;
		}

		let hex = args[0];
		let color = hex.replace("#", "");
		let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
		
		message.reply(`Color \`${hex}\``,{files: [url]});
	};

};