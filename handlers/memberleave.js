const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/modding/welcome.js")(bot);

	leaveHandler = async function leaveHandler(member) {

		//Functions

		leaveMsg(member);

	};
};