const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Regex for detecting URLs in message

	let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	//Post message to starboard or update it if it gets more reactions

	starboardUpdate = async function starboardUpdate(reaction) {
		let message = reaction.message;
		const { guild, author, attachments, channel } = message;

		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;

		const { starboardOn, starboardChannelID, starboardEmoji, starboardNumber } = serverSettings;

		//Don't pin if starboard is not toggled
		if (starboardOn === false) return;

		//If the defined starboard channel doesn't exist, don't pin
		if (!starboardChannelID || !guild.channels.has(starboardChannelID)) return;
		const boardChannel = guild.channels.get(starboardChannelID);

		//Only pin if the right emoji is used and there are enough of them
		if (![].concat(starboardEmoji).includes(reaction.emoji.name)) return;
		if (reaction.count < starboardNumber) return;

		//Don't allow pinning of messages on the starboard itself
		if (channel == boardChannel) return;

		const existingPinnedMessage = await getExistingPinnedMessage(boardChannel, message.id);

		//If the message has already been pinned to starboard, simply update the number of stars
		if (existingPinnedMessage) {
			await updateExistingPin(existingPinnedMessage, reaction, author, boardChannel);
			return;
		}

		let messageContent = message.cleanContent;
		let embedImage = attachments.size > 0 ? attachments.array()[0].url : '';

		//Extract Excess Image URLs out of post and send directly in Starboard outside the embed so that previews appear
		let extraImages = [];
		messageContent = messageContent.replace(urlRegex, function (url) {
			if (url.includes(".jpg") || url.includes(".png") || url.includes(".gif")) {
				extraImages.push(url);
				return "";
			} else {
				return url;
			}
		});

		//If image URL present, but no attachment, set the first image as the RichEmbed's image
		if (embedImage == '' && extraImages.length > 0) {
			embedImage = extraImages.shift(0);
		}

		boardChannel.send(new Discord.RichEmbed()
			.setColor("RANDOM")
			.setAuthor(`${author.username} in #${channel.name}`, author.displayAvatarURL)
			.setFooter(`⭐${reaction.count} • ${message.id}`)
			.setTimestamp(new Date())
			.setDescription(messageContent)
			.setImage(embedImage));

		//If any other images were attached to the image (max 1 in DiscordJS embed), send them to the starboard
		if (extraImages.length > 0) {
			let extraMessage = extraImages.shift(0);
			for (let i = 0; i < extraImages.length; i++) {
				extraMessage += "\n" + extraImages[i];
			}
			boardChannel.send(extraMessage);
		}
	};

	getExistingPinnedMessage = async function getExistingPinnedMessage(boardChannel, id) {
		let existing = null;

		await boardChannel.fetchMessages({ limit: 100 })
			.then((msgs) => {
				msgs.forEach(msg => {
					if (msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.endsWith(id)) {
						existing = msg;
					}
				});
			});

		return existing;
	};

	updateExistingPin = async function updateExistingPin(existingPinnedMessage, reaction, author, boardChannel) {
		let message = reaction.message;
		const pinnedEmbed = existingPinnedMessage.embeds[0];
		const priorImage = reaction.message.attachments.size > 0 ? reaction.message.attachments.array()[0].url : '';

		const editedEmbed = new Discord.RichEmbed()
			.setColor(pinnedEmbed.color)
			.setDescription(pinnedEmbed.description ? pinnedEmbed.description : '')
			.setAuthor(`${author.username} in #${message.channel.name}`, author.displayAvatarURL)
			.setFooter(`⭐${reaction.count} • ${message.id}`)
			.setTimestamp()
			.setImage(priorImage);

		const pinnedMessage = await boardChannel.fetchMessage(existingPinnedMessage.id);

		await pinnedMessage.edit(editedEmbed);
	};
};