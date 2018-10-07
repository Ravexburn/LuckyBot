const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/modding/messagelogs.js")(bot);

	msgUpdateHandler = async function msgUpdateHandler(oldMessage, message) {

		//Functions

		editLogs(oldMessage, message);

	};
};