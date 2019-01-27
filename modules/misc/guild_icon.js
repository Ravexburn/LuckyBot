const Discord = require("discord.js");

module.exports = () => {

	guildIcon = function guildIcon(message) {

		let embed = new Discord.RichEmbed()
			.setAuthor(`Icon for ${message.guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
			.setColor("#a8e8eb")
			.setImage(message.guild.iconURL);
		message.channel.send(embed).catch(console.error);

	};

};