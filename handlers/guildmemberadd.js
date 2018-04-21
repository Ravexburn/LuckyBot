const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/autorole.js")(bot);
	require("./../modules/welcome.js")(bot);

	memberJoinHandler = function memberJoinHandler(member) {

		if (!message.member && message.guild) {
			bot.fetchMember(message.author.id);
		}

		//Functions

		autoRoleAdd(member);
		joinMsg(member);
		welcomeMsg(member);

	};
}; 