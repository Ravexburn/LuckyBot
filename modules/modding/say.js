const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Makes the bot send a message in a channel

	sayFunction = function sayFunction(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please enter a channel followed by a message. \`${command} <channel> message\``);
			return;
		}
		let chan = message.mentions.channels.first();
		if (!chan) {
			message.channel.send(`Please enter a channel followed by a message. \`${command} <channel> message\``);
			return;
		}
		let image;
		if (message.attachments.size > 0) {
			image = { file: message.attachments.first().url };
		}
		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);

		if (!chan.permissionsFor(bot.user).has("VIEW_CHANNEL")) {
			message.channel.send("I am not able to `READ_MESSAGES` for that channel");
			return;
		}

		if (!chan.permissionsFor(bot.user).has("SEND_MESSAGES")) {
			message.channel.send("I am not able to `SEND_MESSAGES` in that channel");
			return;
		}

		if (image && msg) {
			chan.send(msg, image);
			return;
		} else if (msg && !image) {
			chan.send(msg);
			return;
		} else if (image && !msg) {
			chan.send(image);
			return;
		} else {
			message.channel.send(`Please enter a channel followed by a message and or image. \`${command} <channel> message\``);
			return;
		}
	};
	
};