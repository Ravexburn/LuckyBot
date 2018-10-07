const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/modding/autorole.js")(bot);
	require("../modules/modding/welcome.js")(bot);

	memberJoinHandler = function memberJoinHandler(member) {

		//Functions

		autoRoleAdd(member);
		joinMsg(member);
		welcomeMsg(member);

	};
}; 