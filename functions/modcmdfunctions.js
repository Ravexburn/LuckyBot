const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	/**
     * Sets greeter message
     * @param {Message} message 
     */
	welMsg = function welMsg(message, command, args, serverSettings) {
		if (args.length === 1) {
			message.channel.send("Please enter a greeter message: ({mention} tags the new user, {server} is server name, {user} shows user tag)");
			return;
		}
		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);
		message.channel.send("Greeter message set as: " + msg);
		serverSettings.welcomeMessage = msg;
		bot.setServerSettings(message.guild.id, serverSettings);
	};

};
