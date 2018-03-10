const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/autorole.js")(bot);
	require("./../modules/welcome.js")(bot);

	memberJoinHandler = function memberJoinHandler(member) {

		//Functions

		autoRoleAdd(member);
		welcomeMsg(member);
		joinMsg(member);

	};
}; 