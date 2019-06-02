const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Regex for detecting URLs in message
	const IMAGE_URL_REGEX = /((http(s?):)?([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)(:(orig|large))?)/g;

	/**
	 * Post message to starboard or update it if it gets more reactions
	 * @param {MessageReaction} reaction 
	 */
	starboardUpdate = async function starboardUpdate(serverSettings, reaction) {
		let message = reaction.message;
		const {
			guild,
			author,
			attachments,
			channel,
			id
		} = message;

		const {
			starboardOn,
			starboardChannelID,
			starboardNumber
		} = serverSettings;

		//Don't pin if starboard is not toggled
		if (starboardOn === false) return;

		//If the defined starboard channel doesn't exist, don't pin
		if (!starboardChannelID || !guild.channels.has(starboardChannelID)) return;
		const boardChannel = guild.channels.get(starboardChannelID);

		//Only pin if the right emoji is used and there are enough of them
		if (reaction.count < starboardNumber) return;

		//Don't allow pinning of messages from the starboard itself
		if (channel == boardChannel) return;

		let messageContent = message.cleanContent;
		let messageAttachments = Array.from(attachments.array());
		let embedImage = messageAttachments.size > 0 ? messageAttachments.shift(0).url : '';

		//Extract Excess Image URLs out of post and send directly in Starboard outside the embed so that previews appear
		let extraImages = getExtraImages(messageAttachments, messageContent);

		//If image URL present, but no attachment, set the first image as the RichEmbed's image
		if (embedImage == '' && extraImages.length > 0) {
			embedImage = extraImages.shift(0);
		}

		let embed = await createEmbed(author, channel, reaction, message, guild, id, messageContent, embedImage);
		sendOrUpdateEmbed(boardChannel, message, embed, reaction, author, extraImages);
	};

	/**
	 * Is emoji already added?
	 */
	function alreadyExists(emoji, starboardEmoji) {
		return starboardEmoji.includes(emoji.name) || starboardEmoji.includes(emoji);
	}

	function considerApplyingUserRoleColorToEmbed(guild, author, embed) {
		return guild.fetchMember(author).then(guildMember => {
			//Set embed color to the member's main role color if applicable 
			if (guildMember.colorRole != null) {
				embed.setColor(guildMember.colorRole.color);
			}
		});
	}

	function considerSendingExcessImageAttachments(extraImages, boardChannel) {
		if (extraImages.length > 0) {
			extraImages.forEach(image => boardChannel.send(image));
		}
	}

	async function createEmbed(author, channel, reaction, message, guild, id, messageContent, embedImage) {
		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setAuthor(`${author.username} in #${channel.name}`, author.displayAvatarURL)
			.setFooter(`⭐${reaction.count} • ${message.id}`)
			.setTimestamp(new Date())
			.setDescription(`[View Message](https://discordapp.com/channels/${guild.id}/${channel.id}/${id})\n\n${messageContent}`)
			.setImage(embedImage);
		await considerApplyingUserRoleColorToEmbed(guild, author, embed);
		return embed;
	}

	function getExtraImages(messageAttachments, messageContent) {
		let extraImages = [];
		messageAttachments.forEach(attachment => extraImages.push(attachment.url));
		messageContent.replace(IMAGE_URL_REGEX, function (url) {
			extraImages.push(url);
			return url;
		});
		return extraImages;
	}

	/**
	 * Retrieve the embed for a message already posted to starboard
	 * @param {TextChannel} boardChannel The channel assigned to the starboard 
	 * @param {Number} id Posted message id
	 */
	async function getExistingPinnedMessageIds(boardChannel, id) {
		let existing = [];

		await boardChannel.fetchMessages({
			limit: 100
		}).then((msgs) => {
			msgs.forEach(msg => {
				if (msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.includes(id)) {
					existing.push(msg.id);
				}
			});
		});

		return existing;
	}

	async function sendOrUpdateEmbed(boardChannel, message, embed, reaction, author, extraImages) {
		//If the message has already been pinned to starboard, simply update the number of stars
		let existingPinnedMessageIds = await getExistingPinnedMessageIds(boardChannel, message.id);
		if (existingPinnedMessageIds.length == 0) {
			boardChannel.send(embed);
			considerSendingExcessImageAttachments(extraImages, boardChannel);
			return;
		}

		let existingPinnedMessageId = existingPinnedMessageIds.shift();
		deleteDuplicates(boardChannel, existingPinnedMessageIds);

		boardChannel.fetchMessage(existingPinnedMessageId)
			.then(existingMessage => updateExistingPin(existingMessage, reaction, author, boardChannel))
			.then(() => deleteDuplicates(boardChannel, getExistingPinnedMessageIds(boardChannel, message.id)));
	}

	function deleteDuplicates(boardChannel, existingPinnedMessageIds) {
		for (let i = 0; i < existingPinnedMessageIds.length; i++) {
			boardChannel.fetchMessage(existingPinnedMessageIds[i])
				.then(message => message.delete());
		}
	}

	/**
	 * Set starboard emoji
	 * @param {Message} message 
	 */
	setStarboardEmoji = function setStarboardEmoji(message, serverSettings, arg) {
		let addPrompt;
		let removePrompt;
		switch (arg) {
			case "add":
				addPrompt = message.author + " Please react to this message with the emoji you would like to add." +
					`\nCurrent emoji: "${[].concat(serverSettings.starboardEmoji).join('", "')}"`;
				message.channel.send(addPrompt).then(function (msg) {
					var filter = (reaction, user) => user.id == message.author.id;
					msg.awaitReactions(filter, {
						max: 1,
						time: 60000,
						errors: ['time']
					}).then(collected => {
						let newEmoji = collected.first().emoji;
						if (!alreadyExists(newEmoji, serverSettings.starboardEmoji)) {
							serverSettings.starboardEmoji = [newEmoji.name].concat(serverSettings.starboardEmoji);
							bot.setServerSettings(message.guild.id, serverSettings);
							message.channel.send(`**"${newEmoji}" has been added to the starboard emoji.**`);
						} else {
							message.channel.send(`**"${newEmoji}" was already added to the starboard emoji.**`);
						}
					});
				});
				return;
			case "remove":
				removePrompt = message.author + " Please react to this message with the emoji you would like to remove." +
					`\nCurrent emoji: "${[].concat(serverSettings.starboardEmoji).join('", "')}"`;
				message.channel.send(removePrompt).then(function (msg) {
					var filter = (reaction, user) => user.id == message.author.id;
					msg.awaitReactions(filter, {
						max: 1,
						time: 60000,
						errors: ['time']
					}).then(collected => {
						let removedEmoji = collected.first().emoji;
						if (alreadyExists(removedEmoji, serverSettings.starboardEmoji)) {
							serverSettings.starboardEmoji.splice(serverSettings.starboardEmoji.indexOf(removedEmoji.name), 1);
							bot.setServerSettings(message.guild.id, serverSettings);
							message.channel.send(`**"${removedEmoji}" has been removed from the starboard emoji.**`);
						} else {
							message.channel.send(`**"${removedEmoji}" could not be removed from the starboard emoji.**`);
						}
					});
				});
				return;
			default:
				message.channel.send(`Current emoji: "${[].concat(serverSettings.starboardEmoji).join('", "')}"`);
				return;
		}
	};

	/**
	 * Setting starboard reaction number
	 * @param {Message} message 
	 */
	setStarboardNumber = function setStarboardNumber(message, args, serverSettings) {
		if (args.length <= 1 || isNaN(args[1])) {
			message.channel.send(message.author + " Please enter a valid number.")
				.then(message => message.delete(10 * 1000)).catch(console.error);
			message.delete(10 * 1000).catch(console.error);
			return;
		}
		const newNumber = args[1];
		serverSettings.starboardNumber = newNumber;
		bot.setServerSettings(message.guild.id, serverSettings);
		message.channel.send("**Starboard number has been set to: **" + newNumber);
		return;
	};

	/**
	 * Update the embed for a message already posted to starboard
	 */
	async function updateExistingPin(existingPinnedMessage, reaction, author, boardChannel) {
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
	}
};