const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/messagelogs.js")(bot);

	delHandler = async function delHandler(message) {

		try {
			if (!message.member && message.guild) {
				message.guild.fetchMember(message.author.id);
			}
		} catch (error) {
			bot.log(error);
		}

		//Functions

		delLog(message);

	};
};