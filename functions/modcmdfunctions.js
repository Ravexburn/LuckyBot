const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	/**
     * Sets greeter message
     * @param {Message} message 
     */
	welMsg = function welMsg(message, command, args, serverSettings) {
		if (args.length === 1) {
			message.channel.send("Please enter a greeter message: ({mention} tags the new user, {server} is server name, {user} shows user tag)");
			return;
		}
		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);
		message.channel.send("Greeter message set as: " + msg);
		serverSettings.welcomeMessage = msg;
		bot.setServerSettings(message.guild.id, serverSettings);
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
				addPrompt = message.author + " Please react to this message with the emoji you would like to add."
					+ `\nCurrent emoji: "${[].concat(serverSettings.starboardEmoji).join('", "')}"`;
				message.channel.send(addPrompt).then(function (msg) {
					var filter = (reaction, user) => user.id == message.author.id;
					msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
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
				removePrompt = message.author + " Please react to this message with the emoji you would like to remove."
					+ `\nCurrent emoji: "${[].concat(serverSettings.starboardEmoji).join('", "')}"`;
				message.channel.send(removePrompt).then(function (msg) {
					var filter = (reaction, user) => user.id == message.author.id;
					msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
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
