const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/modding/messagelogs.js")(bot);

	delHandler = async function delHandler(message) {

		//Functions

		delLog(message);

	};
};