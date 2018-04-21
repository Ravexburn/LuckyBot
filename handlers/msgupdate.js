const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/messagelogs.js")(bot);

	msgUpdateHandler = async function msgUpdateHandler(oldMessage, message) {

		if (!message.member && message.guild) {
			guild.fetchMember(message.author.id);
		}

		//Functions

		editLogs(oldMessage, message);

	};
};