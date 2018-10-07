const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	serverInfo = function serverInfo(message) {

		let embed = new Discord.RichEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL)
			.setColor("#a8e8eb")
			.setThumbnail(message.guild.iconURL)
			.setURL(message.guild.iconURL)
			.addField("Server created on", message.guild.createdAt.toLocaleString(), true)
			.addField("Owner", message.guild.owner.user.tag, true)
			.addField("Region", message.guild.region, true)
			.addField("Members", message.guild.memberCount, true)
			.addField("Roles", message.guild.roles.size, true)
			.addField("Text Channels", message.guild.channels.array().filter(channel => channel.type === "text").length, true)
			.addField("Voice Channels", message.guild.channels.array().filter(channel => channel.type === "voice").length, true)
			.setFooter(`Server ID: ${message.guild.id}`);
		message.channel.send(embed);
		return;
	};

};