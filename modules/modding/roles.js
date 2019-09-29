const Discord = require("discord.js");
const GuildMember = Discord.GuildMember;
const Role = Discord.Role;

module.exports = (bot = Discord.Client) => {

	rolesSystem = async function rolesSystem(serverSettings, message) {

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

		let member = message.member;
		let length = msgAry.length;
		let command = "";
		let rolename = "";
		let rolesArrayAdd = [];
		let rolesArrayRemove = [];

		for (let i = 0; i < length; i++) {
			let arg = msgAry[i];
			switch (arg.charAt(0)) {
				case "+":
				case "-":
					command = arg.charAt(0);
					arg = arg.slice(1);
					if (rolename !== "") {
						rolename += " ";
					}
					rolename += arg;
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
						rolesArrayAdd.push(rolename);
						break;
					case "-":
						rolesArrayRemove.push(rolename);
						break;
					default:
						break;
				}
			}

			command = "";
			rolename = "";
		}

		let addedCount = await addRolesToMember(member, rolesArrayAdd);
		let removedCount = await removeRolesFromMember(member, rolesArrayRemove);

		let addFailedCount = rolesArrayAdd.length - addedCount;
		let removeFailedCount = rolesArrayRemove.length - removedCount;
		let totalFailed = addFailedCount + removeFailedCount;
		message.reply(`${addedCount} role(s) added, ${removedCount} role(s) removed, ${totalFailed} role(s) failed.`)
			.then(message => message.delete(10 * 1000)).catch(console.error);
		message.delete(10*1000).catch(console.error);
	};

};

async function addRolesToMember(member, rolesArrayAdd) {
	if (!member || !rolesArrayAdd) return;

	let arr = [];
	rolesArrayAdd.forEach(roleName => {
		let role = roleExists(member.guild, roleName);
		if (!role) return;
		if (!canAddRole(role)) return;
		if (userHasRole(member, role)) return;
		arr.push(role);
	});

	await member.addRoles(arr).catch(console.error);

	// Number of roles being added
	return arr.length;
}

async function removeRolesFromMember(member, rolesArrayRemove) {
	if (!member || !rolesArrayRemove) return;

	let arr = [];
	rolesArrayRemove.forEach(roleName => {
		let role = roleExists(member.guild, roleName);
		if (!role) return;
		if (!userHasRole(member, role)) return;
		arr.push(role);
	});

	await member.removeRoles(arr).catch(console.error);

	// Number of roles being removed
	return arr.length;

}

/**
 * Checks if role exists on guild.
 * @param {Guild} guild 
 * @param {string} roleName 
 * @returns {Role?}
 */
function roleExists(guild, roleName) {
	if (!guild) { return; }
	if (!roleName) { return; }

	let role = guild.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
	return role;
}

/**
 * Checks if user has role.
 * @param {GuildMember} member 
 * @param {Role} role 
 * @returns {boolean}
 */
function userHasRole(member, role) {
	return member.roles.has(role.id);
}

/**
 * Checks if role can be added to user based on permissions.
 * @param {GuildMember} member 
 * @param {Role} role 
 * @returns {boolean}
 */
function canAddRole(role) {
	let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "VIEW_AUDIT_LOG", "MENTION_EVERYONE", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
	if (!role) return false;
	for (i = 0; i < perms.length; i++) {
		if (role.hasPermission(perms[i])) {
			return false;
		}
	}
	return true;
}