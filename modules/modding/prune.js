const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {
	
	//Prunes messages from the current channel up to 99
	
	pruneMessage = function pruneMessage(message, args) {
		if (args.length === 0) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}

		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			message.channel.send("You do not have the `MANAGE_MESSAGES` permission");
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
			message.channel.send("Please enable the `MANAGE_MESSAGES` permisson to be able to prune");
			return;
		}

		let msg = args[0];
		let num = parseInt(msg) + 1;
		if (isNaN(num)) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}
		if (num > 100) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}
		message.channel.fetchMessages({ limit: num })
			.then(messages => message.channel.bulkDelete(messages))
			.catch((error) => {
				message.channel.send(error.message);
			});
	};

};