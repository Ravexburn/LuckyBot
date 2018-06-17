const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Post message to starboard

	starboardUpdate = function starboardUpdate(reaction) {
		const guild = reaction.message.guild;
		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;
		if (!serverSettings.starboardOn) return;
		if (!serverSettings.starboardChannelID) return;
		if (reaction.emoji.name != serverSettings.starboardEmoji) return;
		if (reaction.count != serverSettings.starboardNumber) return;

		const starboardChannelID = serverSettings.starboardChannelID;

		if (!guild.channels.has(starboardChannelID)) {
			return;
		}
		const boardChannel = guild.channels.get(starboardChannelID);
		if (serverSettings.starboardOn === false) return;

		let channel = reaction.message.channel;
		if (channel == boardChannel) return;

		let author = reaction.message.author.username;
		let image = reaction.message.author.displayAvatarURL;
		let msg = reaction.message.content;

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setThumbnail(image)
			.setTitle(author)
			.setFooter("#" + channel.name)
			.setDescription(msg);
		boardChannel.send(embed);
	};
};