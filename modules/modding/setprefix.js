const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Allows a user to set a prefix for the server.

	setPrefix = function setPrefix(message, command, args, serverSettings) {
		args = args.filter(arg => arg.trim().length > 0);
		if (args.length === 0) {
			message.reply(`To set prefix please use ${command} <prefix>`).catch(console.error);
			return;
		}
		const newPrefix = args[0];
		serverSettings.prefix = newPrefix;
		bot.setServerSettings(message.guild.id, serverSettings);
		message.channel.send(`**Prefix has been set to:** \`${newPrefix}\``).catch(console.error);
		return;
	};
	
};