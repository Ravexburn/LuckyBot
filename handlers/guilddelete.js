const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/whitelist.js")(bot);

	guildDeleteHandler = function guildDeleteHandler(guild) {

		//Functions

		serverLeave(guild);

	};
};