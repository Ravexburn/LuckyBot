const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Regex for detecting URLs in message
	let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;

	/**
	 * Post message to starboard or update it if it gets more reactions
	 * @param {MessageReaction} reaction 
	 */
	starboardUpdate = async function starboardUpdate(reaction) {
		let message = reaction.message;
		const {
			guild,
			author,
			attachments,
			channel,
			id
		} = message;

		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;

		const {
			starboardOn,
			starboardChannelID,
			starboardEmoji,
			starboardNumber
		} = serverSettings;

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

		if (author.bot) return;

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
			}
			return url;
		});

		//If image URL present, but no attachment, set the first image as the RichEmbed's image
		if (embedImage == '' && extraImages.length > 0) {
			embedImage = extraImages.shift(0);
		}

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setAuthor(`${author.username} in #${channel.name}`, author.displayAvatarURL)
			.setFooter(`⭐${reaction.count} • ${message.id}`)
			.setTimestamp(new Date())
			.setDescription(`[View Message](https://discordapp.com/channels/${guild.id}/${channel.id}/${id})\n\n${messageContent}`)
			.setImage(embedImage);

		guild.fetchMember(author).then(guildMember => {
			//Set embed color to the member's main role color if applicable 
			if (guildMember.colorRole != null) {
				embed.setColor(guildMember.colorRole.color);
			}
		}).then(() => {
			boardChannel.send(embed);

			//If any other images were attached to the image (max 1 in DiscordJS embed), send them to the starboard
			if (extraImages.length > 0) {
				let extraMessage = extraImages.shift(0);
				for (let i = 0; i < extraImages.length; i++) {
					extraMessage += "\n" + extraImages[i];
				}
				boardChannel.send(extraMessage);
			}
		});
	};

	/**
	 * Retrieve the embed for a message already posted to starboard
	 * @param {TextChannel} boardChannel The channel assigned to the starboard 
	 * @param {Number} id Posted message id
	 */
	getExistingPinnedMessage = async function getExistingPinnedMessage(boardChannel, id) {
		let existing = null;

		await boardChannel.fetchMessages({
			limit: 100
		}).then((msgs) => {
			msgs.forEach(msg => {
				if (msg.embeds.length > 0 && msg.embeds[0].footer && msg.embeds[0].footer.text.endsWith(id)) {
					existing = msg;
				}
			});
		});

		return existing;
	};

	/**
	 * Update the embed for a message already posted to starboard
	 */
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
	 * Is emoji already added?
	 */
	alreadyExists = function alreadyExists(emoji, starboardEmoji) {
		return starboardEmoji.includes(emoji.name) || starboardEmoji.includes(emoji);
	};

	/**
	 * Setting starboard reaction number
	 * @param {Message} message 
	 */
	setStarboardNumber = function setStarboardNumber(message, args, serverSettings) {
		if (args.length <= 1 || isNaN(args[1])) {
			message.channel.send(message.author + " Please enter a valid number.")
				.then(message => message.delete(10 * 1000));
			message.delete(10 * 1000);
			return;
		}
		const newNumber = args[1];
		serverSettings.starboardNumber = newNumber;
		bot.setServerSettings(message.guild.id, serverSettings);
		message.channel.send("**Starboard number has been set to: **" + newNumber);
		return;
	};
};
