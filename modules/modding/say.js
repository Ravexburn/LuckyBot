const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("../../functions/functions.js")(bot);

	//Makes the bot send a message in a channel

	sayFunction = function sayFunction(message, command, args) {
		let errMsg = `Please enter a channel followed by a message. \`${command} <channel> message\``;

		if (args.length === 0) {
			message.reply(errMsg).catch(console.error);
			return;
		}

		let chan = args[0];
		const matches = args[0].match(new RegExp(`<#(\\d+)>`));

		if (matches) {
			chan = matches[1];
		}

		if (!message.guild.channels.has(chan)) {
			message.reply(errMsg).catch(console.error);
			return;
		}
		
		chan = message.guild.channels.get(chan);

		let image;
		if (message.attachments.size > 0) {
			image = { file: message.attachments.first().url };
		}

		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);

		if (!chan.permissionsFor(bot.user).has("VIEW_CHANNEL")) {
			message.channel.send("I am not able to `READ_MESSAGES` for that channel").catch(console.error);
			return;
		}

		if (!chan.permissionsFor(bot.user).has("SEND_MESSAGES")) {
			message.channel.send("I am not able to `SEND_MESSAGES` in that channel").catch(console.error);
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
			message.reply(errMsg).catch(console.error);
			return;
		}
	};

};