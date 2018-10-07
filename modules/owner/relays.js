/*
 * Relays
 * Author: OrigamiCoder
 */

const Discord = require("discord.js");
const Message = Discord.Message;
const Channel = Discord.TextChannel;

const Relays_Data = require("./relays_data");
const relays_data = new Relays_Data();

module.exports = (bot = new Discord.Client()) => {

	relays = {
        /**
         * Checks if the relay name exists in the database.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} exists - Whether the relay name exists.
         */
		relayExists: relays_data.relayExists,

        /**
         * Checks if the channel exists in the database.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<boolean>} exists - Whether the channel exists.
         */
		channelExists: relays_data.channelExists,

        /**
         * Gets all relay names.
         * @returns {string[]} relays.
         */
		getAllRelays: relays_data.getAllRelays,

        /**
         * Gets all channel IDs.
         * @returns {string[]} channel IDs.
         */
		getAllChannels: relays_data.getAllChannels,

        /**
         * Gets all relays and channels as a collection 
         * with each relay name as a key, and an array of its channel ids as its value.
         * @returns {Collection<string, string[]>} relays.
         */
		getRelaysCollection: relays_data.getRelaysCollection,

        /**
         * Adds a relay with channels.
         * @param {string} relay - The relay name.
         * @param {string[]|string} channels - Either an array of channel IDs or a string of channel IDs separated by a space(' ').
         * @returns {Promise<boolean>} success - Whether all the channels were added successfully.
         */
		addRelayChannels: relays_data.addRelayChannels,

        /**
         * Adds a relay with channels and a type.
         * @param {string} relay - The relay name.
         * @param {string[]|string} channels - Either an array of channel IDs or a string of channel IDs separated by a space(' ').
         * @param {string} type - The relay type.
         * @returns {Promise<boolean>} success - Whether all the channels were added successfully.
         */
		addRelay: function (relay, channels, type = "") {
			return relays_data.addRelayChannels(relay, channels)
				.then(relays_data.setRelayData(relay, type, ""));
		},

        /**
         * Removes a relay.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} Promise - success.
         */
		removeRelay: relays_data.removeRelay,

        /**
         * Adds channels to a relay.
         * @param {string} relay - The relay name.
         * @param {string[]|string} channels - The channel IDs.
         * @returns {Promise<boolean>} Promise - success.
         */
		addChannel: function (relay, channels) {
			return relays_data.relayExists(relay)
				.then((exists) => {
					if (!exists) {
						return Promise.reject(`No such relay: ${relay}`);
					}
				}).then(() => {
					return relays_data.addRelayChannels(relay, channels);
				});
		},

		/**
         * Removes a channel.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<boolean>} Promise - success.
         */
		removeChannel: relays_data.removeChannel,

		/**
         * Gets a channel's relay.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<string>} Promise - The relay name.
         */
		getChannelRelay: relays_data.getChannelRelay,

        /**
         * Gets a relay's channels.
         * @param {string} relay - The relay name.
         * @returns {Promise<string[]>} Promise - An array of channel IDs.
         */
		getRelayChannels: relays_data.getRelayChannels,

        /**
         * Checks if the relay has data that exists in the database.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} exists - Whether relay data exists.
         */
		relayDataExists: relays_data.relayDataExists,

        /**
         * Gets relay data as an object.
         * @param {string} relay - The relay name.
         * @returns {Promise<Object>} data
         */
		getRelayData: relays_data.getRelayData,

        /**
         * Gets relay type.
         * @param {string} relay - The relay name.
         * @returns {Promise<string>} type
         */
		getRelayType: relays_data.getRelayType,

        /**
         * Gets relay format.
         * @param {string} relay - The relay name.
         * @returns {Promise<string>} format
         */
		getRelayFormat: relays_data.getRelayFormat,

        /**
         * Sets relay data.
         * @param {string} relay - The relay name.
         * @param {string} type - The relay type.
         * @param {string} format - The relay format.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		setRelayData: relays_data.setRelayData,

        /**
         * Sets relay type.
         * @param {string} relay - The relay name.
         * @param {string} type - The relay type.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		setRelayType: relays_data.setRelayType,

        /**
         * Sets relay format.
         * @param {string} relay - The relay name.
         * @param {string} format - The relay format.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		setRelayFormat: relays_data.setRelayFormat,

        /**
         * 
         * @param {Message} message - The message that was sent.
         * @param {function} callback - signature: function(message, channel, relay)
         */
		relayMessage: function relayMessage(message, callback = _relayMessageCallback) {
			if (message.system) return;
			if (message.author.bot) return;
			if (message.channel.type === 'dm') return;

			const channelID = message.channel.id;
			let relayName = "";
			relays_data.channelExists(channelID)
				.then((exists) => {
					if (!exists) {
						return Promise.reject();
					}
					return relays_data.getChannelRelay(channelID);
				}).then((relay) => {
					relayName = relay;
					return relays_data.getRelayChannels(relayName);
				}).then((channels) => {
					if (!channels) {
						return Promise.reject(`Relays: Failed to get relay channels. (Relay: ${relay})`);
					}
					for (let id of channels) {
						if (id === channelID) {
							continue;
						}
						let ch = bot.channels.get(id);
						if (!ch) {
							continue;
						}
						callback(message, ch, relayName);
					}
				}).catch((reason) => {
					if (reason) {
						console.log(reason);
					}
				});
		},

		//Made by rave
        /**
         * 
         * @param {Message} message 
         * @param {Channel} channel 
         * @param {string} relay 
         */
		relayRave: function relayRave(message, channel, relay) {
			relays_data.getRelayData(relay)
				.then((data) => {
					let type = data.type;
					let format = data.format;
					const author = message.author;
					switch (type) {
						default:
						case "text":
							let content = message.content;
							switch (format) {
								default:
								case "embed":
									let color = message.member.colorRole.color;
									if (!color) color = "RANDOM";
									const embed = new Discord.RichEmbed();
									embed.setAuthor(author.tag, author.displayAvatarURL);
									embed.setDescription(content);
									embed.setColor(color);
									if (message.attachments.size !== 0) {
										const msgAttachment = message.attachments.first();
										embed.setImage(msgAttachment.url);
									}
									embed.setTimestamp(message.createdAt);
									embed.setFooter(message.guild.name);
									channel.send(embed);
									break;
								case "none":
									content = `${author.tag}: ${content}`;
									if (message.attachments.size === 0) {
										channel.send(content);
									} else {
										const msgAttachment = message.attachments.first();
										const attachment = new Discord.Attachment(msgAttachment.url, msgAttachment.filename);
										channel.send(content, attachment);
									}
									break;
							}
							break;
						case "image":
							if (message.attachments.size === 0) {
								return;
							}
							let imageUrl = message.attachments.first().url;
							switch (format) {
								default:
								case "embed":
									let color = message.member.colorRole.color;
									if (!color) color = "RANDOM";
									const embed = new Discord.RichEmbed();
									embed.setAuthor(author.tag, author.displayAvatarURL);
									embed.setImage(imageUrl);
									embed.setTimestamp(message.createdAt);
									embed.setFooter(message.guild.name);
									embed.setColor(color);
									channel.send(embed);
									break;
								case "none":
									const msgAttachment = message.attachments.first();
									const attachment = new Discord.Attachment(msgAttachment.url, msgAttachment.filename);
									channel.send(author.tag, attachment);
									break;
							}
							break;
					}
				}).catch((reason) => {
					console.log(reason);
				});

		}
	}
}

/**
 * 
 * @param {Message} message 
 * @param {Channel} channel 
 * @param {string} relay 
 */
function _relayMessageCallback(message, channel, relay) {
	relays_data.getRelayData(relay)
		.then((data) => {
			let type = data.type;
			let format = data.format;
			const author = message.author;
			switch (type) {
				default:
				case "text":
					let content = message.content;
					switch (format) {
						default:
						case "embed":
							const embed = new Discord.RichEmbed();
							embed.setAuthor(author.tag, author.displayAvatarURL);
							embed.setDescription(content);
							if (message.attachments.size !== 0) {
								const msgAttachment = message.attachments.first();
								embed.setImage(msgAttachment.url);
							}
							embed.setTimestamp(message.createdAt);
							channel.send(embed);
							break;
						case "none":
							content = `${author.tag}: ${content}`;
							if (message.attachments.size === 0) {
								channel.send(content);
							} else {
								const msgAttachment = message.attachments.first();
								const attachment = new Discord.Attachment(msgAttachment.url, msgAttachment.filename);
								channel.send(content, attachment);
							}
							break;
					}
					break;
				case "image":
					if (message.attachments.size === 0) {
						return;
					}
					let imageUrl = message.attachments.first().url;
					switch (format) {
						default:
						case "embed":
							const embed = new Discord.RichEmbed();
							embed.setAuthor(author.tag, author.displayAvatarURL);
							embed.setImage(imageUrl);
							embed.setTimestamp(message.createdAt);
							channel.send(embed);
							break;
						case "none":
							const msgAttachment = message.attachments.first();
							const attachment = new Discord.Attachment(msgAttachment.url, msgAttachment.filename);
							channel.send(author.tag, attachment);
							break;
					}
					break;
			}
		}).catch((reason) => {
			console.log(reason);
		});
}