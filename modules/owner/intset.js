const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	intSet = function intSet(message) {
		bot.initServerSettings(message.guild.id);
		message.channel.send("**Server settings have been reset.**")
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10 * 1000).catch(console.error);
		return;
	};

};