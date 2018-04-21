const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/messagelogs.js")(bot);

	delHandler = async function delHandler(message) {

		if (!message.member && message.guild) {
			guild.fetchMember(message.author.id);
		}

		//Functions

		delLog(message);

	};
};