const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Allows a user to set a prefix for the server.

	setPrefix = function setPrefix(message, command, args, serverSettings) {
		if (args.length === 0) {
			message.channel.send(message.author + "To set prefix please use " + command + " <prefix>");
			return;
		}
		const newPrefix = args[0];
		serverSettings.prefix = newPrefix;
		bot.setServerSettings(message.guild.id, serverSettings);
		message.channel.send(`**Prefix has been set to:** \`${newPrefix}\``);
		return;
	};
	
};