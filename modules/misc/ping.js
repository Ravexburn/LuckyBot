const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	botPing = async function botPing(message) {

		message.channel.send("Checking ping.").then(msg => {
			let ping = msg.createdTimestamp - message.createdTimestamp;
			msg.edit(`Bot Latency: \`${ping} ms\` \nAPI Latency: \`${Math.round(bot.ping)} ms\``);
		}).catch((error) => {
			console.log(error);
		});

	};

};