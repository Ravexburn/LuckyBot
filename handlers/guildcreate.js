const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/whitelist.js")(bot);

	guildCreateHandler = function guildCreateHandler(guild) {

		//Functions

		whitelist(guild);

	};
};