const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Timestamp console 

	bot.log = function log(obj) {
		const timeString = `[${(new Date()).toLocaleTimeString()}]`;
		console.log(timeString, obj);
	};

};