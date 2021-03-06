const Discord = require("discord.js");
const GuildMember = Discord.GuildMember;
const Role = Discord.Role;

module.exports = (bot = Discord.Client) => {

	rolesAdd = async function rolesAdd(serverSettings, message) {

		let valid_channel = false;
		let activeChannel;

		if (message.channel.id === serverSettings.roleChannelID) {
			valid_channel = true;
		}

		if (message.guild.channels.has(serverSettings.roleChannelID)) {
			activeChannel = message.guild.channels.get(serverSettings.roleChannelID);
		}

		if (!valid_channel) return;
		if (!activeChannel) return;

		let msgAry = message.content.trim().split(" ");

		switch (msgAry[0].charAt(0)) {
			case "+":
			case "-":
				break;
			default:
				message.delete().catch(console.error);
				return;
		}

		let length = msgAry.length;
		let command = "";
		let rolename = "";
		let rolesArray = [];
		for (let i = 0; i < length; i++) {
			let arg = msgAry[i];
			switch (arg.charAt(0)) {
				case "+":
				case "-":

					command = arg.charAt(0);
					arg = arg.slice(1);

					break;
				default:
					if (rolename !== "") {
						rolename += " ";
					}
					rolename += arg;
					break;
			}

			if ((i + 1) < length) {

				if ((msgAry[i + 1].charAt(0) !== "+") && (msgAry[i + 1].charAt(0) !== "-")) {
					continue;
				}

			}

			if (command !== "") {
				switch (command) {
					case "+":
						rolesArray.push(rolename);
						break;
					case "-":
						rolesArray.push(rolename);
						break;
					default:
						break;
				}
			}

			command = "";
			rolename = "";
		}
		addRole(member, rolesArray, message);
		removeRole(member, rolesArray, message);
	};
};

function addRole(member, rolename, message, rolesArray) {
	let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "VIEW_AUDIT_LOG", "MENTION_EVERYONE", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];	

	roleCheck(message, rolename, message, rolesArray);

	if (canAddRole(member, role)) {
		member.addRoles(role).catch(console.error);
		message.reply("Role has been added.")
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10 * 1000).catch(console.error);
		return true;
	} else {
		message.reply(`You do not have the required permissions to add that role. This role has \`${perms[i]}\``)
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10 * 1000).catch(console.error);
		return false;
	}

}

function removeRole(member, rolename, message) {

	if (!member) return false;
	if (!rolename) return false;

	let role = member.guild.roles.find(role => role.name === rolename);
	if (!role) {
		message.reply(`Role does not exist.`)
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10 * 1000).catch(console.error);
		return false;
	}
	if (member.roles.has(role.id)) {
		//Member has role
		return member.removeRoles(role).then(() => {
			message.reply("Role has been removed.")
				.then(message => message.delete(10 * 1000)).catch(console.error);
			message.delete(10 * 1000).catch(console.error);
			return true;
		}).catch(() => {
			message.reply("Failed to remove role.").then(message => message.delete(10 * 1000)).catch(console.error);
			message.delete(10 * 1000).catch(console.error);
		});

	} else {
		message.reply("You do not have that role.")
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10 * 1000).catch(console.error);
		return false;
	}

}

/**
 * Checks if role can be added to user.
 * @param {GuildMember} member 
 * @param {Role} role 
 * @returns {boolean}
 */
function canAddRole(member, role, perms) {
	perms = ["ADMINISTRATOR", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "VIEW_AUDIT_LOG", "MENTION_EVERYONE", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
	if (!role) return false;
	for (i = 0; i < perms.length; i++) {
		if (role.hasPermission(perms[i])) {
			return false;
		}
	}
	return true;
}

function roleCheck(member, rolename, message, rolesArray) {

	if (!member) return false;
	if (!rolename) return false;

	rolesArray.forEach(roleID => {
		let role = member.guild.roles.find(role => role.name === rolename);
		if (!role) {
			message.reply(`Role does not exist.`)
				.then(message => message.delete(10 * 1000)).catch(console.error);
			message.delete(10 * 1000).catch(console.error);
		}
		if (member.roles.has(role.id)) {
			//Member has role
			message.reply("You already have this role.")
				.then(message => message.delete(10 * 1000)).catch(console.error);
			message.delete(10 * 1000).catch(console.error);
		}
		
	});	
	return true;
}