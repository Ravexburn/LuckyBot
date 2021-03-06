const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Prunes messages from the current channel up to 99

	pruneMessage = async function pruneMessage(message, args) {
		if (args.length === 0) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`").catch(console.error);
			return;
		}

		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			message.channel.send("You do not have the `MANAGE_MESSAGES` permission").catch(console.error);
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
			message.channel.send("Please enable the `MANAGE_MESSAGES` permisson to be able to prune").catch(console.error);
			return;
		}

		let msg = args[0];
		let num = parseInt(msg) + 1;
		if (isNaN(num)) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`").catch(console.error);
			return;
		}
		if (num > 100) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`").catch(console.error);
			return;
		}
		try {
			let messages = await message.channel.fetchMessages({ limit: num });
			await message.channel.bulkDelete(messages);
		} catch (error) {
			message.channel.send(error.message).catch(console.error);
		}
	};

};