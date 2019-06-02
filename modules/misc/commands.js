const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("./customcommands.js")(bot);

	commands = async function commands(serverSettings, message) {

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		const prefix = serverSettings.prefix;

		command = command.slice(prefix.length).toLowerCase();
		//TODO command list
		const guild = message.guild;

		if (!cmds.has(guild.id)) return;

		const custom = cmds.get(guild.id);

		let msg = custom[command];
		if (!msg) return;

		message.channel.send(msg);

	};

};