const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/owner/whitelist.js")(bot);

	guildDeleteHandler = function guildDeleteHandler(guild) {

		//Functions

		guildLeave(guild);

	};
};