const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Add reaction listener for starboard

	starboardListen = function starboardListen(message) {
		const guild = message.guild;
		const serverSettings = bot.getServerSettings(guild.id);

		if (!serverSettings.starboardOn || serverSettings.starboardChannelID === "") return;

		const starboardEmoji = serverSettings.starboardEmoji;

		const listener = message.createReactionCollector(r => r.emoji.name == serverSettings.starboardEmoji, { time: 600000 });
		listener.on('collect', reaction => {
			if (listener.collected.first().count == serverSettings.starboardNumber) {
				starboardPost(message);
			}
		});
	};

	//Post message to starboard

	starboardPost = function starboardPost(message) {
		const guild = message.guild;
		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;
		if (!serverSettings.starboardChannelID) return;
		const starboardChannelID = serverSettings.starboardChannelID;

		if (!guild.channels.has(starboardChannelID)) {
			return;
		}
		const boardChannel = guild.channels.get(starboardChannelID);
		if (serverSettings.starboardOn === false) return;

		let channel = message.channel;
		if (channel == boardChannel) return;

		let author = message.author.username;
		let image = message.author.displayAvatarURL;
		let timestamp = message.createdAt;
		let msg = message.content;

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setThumbnail(image)
			.setTitle(author)
			.setFooter("#" + channel.name)
			.setDescription(msg);
		boardChannel.send(embed);
	};
};