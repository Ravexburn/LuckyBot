const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	/** 
     * Toggles image embed
     *@param {Message} message 
     */
	imgTog = function imgTog(message, serverSettings) {
		serverSettings.imageEmbed = !serverSettings.imageEmbed;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.imageEmbed === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Embed images status:** ${emote}`);
	};

	/**
     * Turns logs on and off
     * @param {Message} message 
     */
	logsTog = function logsTog(message, serverSettings) {
		serverSettings.logsOn = !serverSettings.logsOn;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.logsOn === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Logs status:** ${emote}`);
	};

	/**
     * Turns greeter setting on and off
     * @param {Message} message
     */
	welTog = function welTog(message, serverSettings) {
		serverSettings.welcomeOn = !serverSettings.welcomeOn;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.welcomeOn === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Greeter status:** ${emote}`);
	};

	/**
	* Turns roles setting on and off
	* @param {Message} message
	*/
	rolesTog = function rolesTog(message, serverSettings) {
		serverSettings.rolesOn = !serverSettings.rolesOn;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.rolesOn === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Roles status:** ${emote}`);
	};

	adBlockTog = function adBlockTog(message, serverSettings) {
		serverSettings.adBlocktoggle = !serverSettings.adBlocktoggle;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.adBlocktoggle === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Blocking discord link status:** ${emote}`);
	};

	/**
		 * Turns starboard on and off
		 * @param {Message} message 
		 */
	starboardTog = function starboardTog(message, serverSettings) {
		serverSettings.starboardOn = !serverSettings.starboardOn;
		bot.setServerSettings(message.guild.id, serverSettings);
		if (serverSettings.starboardOn === true) {
			emote = ":white_check_mark: **Enabled**";
		} else {
			emote = ":x: **Disabled**";
		}
		message.channel.send(`**Starboard status:** ${emote}`);
	};

};