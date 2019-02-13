const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	editMessageFunction = async function editMessageFunction(message, command, args){
		let errMsg = `Please enter a channel followed by the message ID and new message. \`${command} <channel> <messageID> message\``;
		
		if (args.length === 0) {
			message.reply(errMsg).catch(console.error);
			return;
		}

		let chan = args[0];
		const matches = args[0].match(new RegExp(`<#(\\d+)>`));

		if (matches) {
			chan = matches[1];
		}

		chan = message.guild.channels.get(chan);

		let msgID = args[1];

		msgID = await chan.fetchMessage(msgID).catch(console.error);

		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1).slice(args[1].length + 1);

		if (!chan.permissionsFor(bot.user).has("VIEW_CHANNEL")) {
			message.channel.send("I am not able to `READ_MESSAGES` for that channel").catch(console.error);
			return;
		}

		if (!chan.permissionsFor(bot.user).has("SEND_MESSAGES")) {
			message.channel.send("I am not able to `SEND_MESSAGES` in that channel").catch(console.error);
			return;
		}

		msgID.edit(msg).catch(console.error);
	};

};