const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

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

};