const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	/**
	* Setting prefix
	* @param {Message} message 
	*/
	setPrefix = function setPrefix(message, command, args, serverSettings) {
		if (args.length === 0) {
			message.channel.send(message.author + "To set prefix please use " + command + " <prefix>")
				.then(message => message.delete(10 * 1000));
			message.delete(10 * 1000);
			return;
		}
		const newPrefix = args[0];
		serverSettings.prefix = newPrefix;
		bot.setServerSettings(message.guild.id, serverSettings);
		message.channel.send("**Prefix has been set to: **" + newPrefix);
		return;
	};

	/**
     * Banning a user
     * @param {Message} message  
     */
	banUser = function banUser(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please do ${command} <user> [days] [reason]`);
			return;
		}

		let member_id = null;
		const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));

		if (matches) {
			member_id = matches[1];
		}

		if (!member_id) {
			member_id = args[0];
		}

		let member = null;

		if (message.guild.members.has(member_id)) {
			member = message.guild.member(member_id);
		}

		if (!message.member.hasPermission("BAN_MEMBERS")) {
			message.channel.send("You do not have the `BAN_MEMBERS` permission");
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("BAN_MEMBERS")) {
			message.channel.send("Please enable the `BAN_MEMBERS` permisson to be able to ban");
			return;
		}

		if (member) {
			if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD") || member.hasPermission("VIEW_AUDIT_LOG")) {
				message.channel.send("You can't ban that person");
				return;
			}
		}

		if (member === message.member) {
			message.channel.send("You can't ban yourself");
			return;
		}

		let reason = args.slice(1).join(" ");
		let days = 0;
		if (isNaN(args[1])) {
			reason = args.slice(1).join(" ");
		} else {
			days = parseInt(args[1]);
			reason = args.slice(2).join(" ");
		}

		message.guild.ban(member_id, { days, reason }).then((user) => {
			if (!reason) {
				reason = "no reason provided";
			}
			message.channel.send(`**${user}** has been banned for \`${reason}\``);
		}).catch((error) => {
			message.channel.send(error.message);
		});
	};

	/**
     * Kicks a user
     * @param {Message} message 
     */
	kickUser = function kickUser(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please do ${command} <user> [reason]`);
			return;
		}

		let member_id = null;
		const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));

		if (matches) {
			member_id = matches[1];
		}

		if (!member_id) {
			member_id = args[0];
		}

		let member = null;

		if (message.guild.members.has(member_id)) {
			member = message.guild.member(member_id);
		}

		if (!message.member.hasPermission("KICK_MEMBERS")) {
			message.channel.send("You do not have the `KICK_MEMBERS` permission");
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("KICK_MEMBERS")) {
			message.channel.send("Please enable the `KICK_MEMBERS` permisson to be able to kick");
			return;
		}

		if (member) {
			if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD") || member.hasPermission("VIEW_AUDIT_LOG")) {
				message.channel.send("You can't kick that person");
				return;
			}

		}

		if (member === message.member) {
			message.channel.send("You can't kick yourself");
			return;
		}

		let reason = args.slice(1).join(" ");

		member.kick(reason).then((member) => {
			if (!reason) {
				reason = "no reason provided";
			}
			message.channel.send(`**${member.displayName}** has been kicked for \`${reason}\``);
		}).catch((error) => {
			message.channel.send(error.message);
		});
	};

	/** 
	* Command: Mute by Average Black Guy#2409
	* Description: Mutes a tagged user. Unmutes if user is already muted.
	* Notes: If no mute role exists, one is made and is given to the user. Requires a mention and only 1 person can be muted at a time.
	*/
	muteUser = function muteUser(message, command, args) {
		if (args.length === 0) { // Checks if no args given 
			message.channel.send(`No one to mute, please do ${command} [userid] **or** @user`);
			return;
		}

		let muteRoleExists = false;
		let memberToMute = (message.mentions.users.first() === undefined) ? message.guild.member(args[0]) : message.guild.member(message.mentions.users.first().id); // if theres no mention it grabs whatever is in args
		// Make sure its actually a member being muted.
		if (memberToMute === null) { 
			message.channel.send("That is not a user");
			return;
		}
		
		// Don't mute yourself.
		if (memberToMute.id === message.author.id) { 
			message.channel.send("You can't mute yourself");
			return;
		}
		
		// Don't mute person with clout.
		if (memberToMute.hasPermission("ADMINISTRATOR") || memberToMute.hasPermission("MANAGE_GUILD")) { 
			message.channel.send("You can't mute that person");
			return;
		}
		
		// Loop through the guild's roles.
		for (let role of message.guild.roles.array()) { 
			// Find the guild's mute role and check if the member has it. If they do, unmute.
			if (role.name.toLowerCase() === "mute" && memberToMute.roles.has(role.id)) { 
				muteRoleExists = true;
				memberToMute.removeRole(role).then(member => {
					message.channel.send(`Unmuted ${member.displayName}`);
				}).catch(err => {
					message.channel.send("Failed to unmute");
					console.error(err);
				});
				return;
			// If a member isn't muted and a mute role is found, mute.
			} else if (role.name.toLowerCase() === "mute") { 
				muteRoleExists = true;
				memberToMute.addRole(role).then(member => {
					message.channel.send(`Muted ${member.displayName}`);
				}).catch(err => {
					message.channel.send("Failed to mute");
					console.error(err);
				});
				return;
			}
		}
		
		// If there's no mute role and Lucky doesn't have role perms.
		if (!muteRoleExists && !message.guild.member(bot.user.id).hasPermission("MANAGE_ROLES")) { 
			message.channel.send(`There was no mute role found and I do not have permission to create a new role.\nPlease create a new role called "mute" and try again.`);
		// If there's no role named "mute", create a new one.
		} else if (!muteRoleExists) { 
			message.guild.createRole({
				name: "mute"
			}).then(muteRole => {
				// Loop through channels and make the new mute role not allow members to send messages, speak, or react.
				for (let channel of message.guild.channels.array()) { 
					channel.overwritePermissions(muteRole, { SEND_MESSAGES: false, SPEAK: false, ADD_REACTIONS: false });
				}
				// Add mute role to targetted member once creation is done.
				memberToMute.addRole(muteRole).then(member => { 
					message.channel.send(`There was no mute role found, a new one has been created with the name ${muteRole.name} and added to ${member.displayName}`);
				}).catch(err => {
					message.channel.send("Failed to mute member");
					console.error(err);
				});
			});
		}
	};

	//Prunes messages
	pruneMessage = function pruneMessage(message, args) {
		if (args.length === 0) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}

		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			message.channel.send("You do not have the `MANAGE_MESSAGES` permission");
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("MANAGE_MESSAGES")) {
			message.channel.send("Please enable the `MANAGE_MESSAGES` permisson to be able to prune");
			return;
		}

		let msg = args[0];
		let num = parseInt(msg) + 1;
		if (isNaN(num)) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}
		if (num > 100) {
			message.channel.send("Please provide a number of messages to delete `MAX: 99`");
			return;
		}
		message.channel.fetchMessages({ limit: num })
			.then(messages => message.channel.bulkDelete(messages))
			.catch((error) => {
				message.channel.send(error.message);
			});
	};

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

	//Makes the bot say something in a channel
	sayFunction = function sayFunction(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please enter a channel followed by a message. \`${command} <channel> message\``);
			return;
		}
		let chan = message.mentions.channels.first();
		if (!chan) {
			message.channel.send(`Please enter a channel followed by a message. \`${command} <channel> message\``);
			return;
		}
		let image;
		if (message.attachments.size > 0) {
			image = { file: message.attachments.first().url };
		}
		let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);

		if (!chan.permissionsFor(bot.user).has("VIEW_CHANNEL")) {
			message.channel.send("I am not able to `READ_MESSAGES` for that channel");
			return;
		}
		
		if (!chan.permissionsFor(bot.user).has("SEND_MESSAGES")) {
			message.channel.send("I am not able to `SEND_MESSAGES` in that channel");
			return;
		}

		if (image && msg) {
			chan.send(msg, image);
			return;
		} else if (msg && !image) {
			chan.send(msg);
			return;
		} else if (image && !msg) {
			chan.send(image);
			return;
		} else {
			message.channel.send(`Please enter a channel followed by a message and or image. \`${command} <channel> message\``);
			return;
		}
	};

	/**
     * Set starboard emoji
     * @param {Message} message 
     */
	setStarboardEmoji = function setStarboardEmoji(message, serverSettings, arg) {
		switch (arg) {
			case "add":
				let addPrompt = message.author + " Please react to this message with the emoji you would like to add."
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
				let removePrompt = message.author + " Please react to this message with the emoji you would like to remove."
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
