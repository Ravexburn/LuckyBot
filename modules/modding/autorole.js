const Discord = require("discord.js");
const db = require('quick.db');

module.exports = (bot = Discord.Client) => {

	autoRoleMsg = async function autoRoleMsg(message) {

		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		let serverSettings = bot.getServerSettings(message.guild.id);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		const prefix = serverSettings.prefix;

		if (!command.startsWith(prefix)) return;

		//Autorole

		if (command === `${prefix}autorole`) {
			let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];

			let hasPerms = perms.some(i => message.member.hasPermission(i));

			if (!hasPerms) return;

			if (args.length === 0) {
				message.channel.send(`To use auto-role please do ${command} <role name>`);
				return;
			}

			db.updateText(`autoRole_${message.guild.id}`, args.join(" ").trim()).then(i => {

				if (i.text.toLowerCase() === "none") {
					serverSettings.autoRoleOn = false;
				} else {
					serverSettings.autoRoleOn = true;
				}
				bot.setServerSettings(message.guild.id, serverSettings);
				message.channel.send(`Auto-role set to ${i.text}`);
			});
		}
	};

	autoRoleAdd = function autoRoleAdd(member) {

		db.fetchObject(`autoRole_${member.guild.id}`).then(i => {

			if (!i.text || i.text.toLowerCase() === "none") return;

			else {
				member.addRole(member.guild.roles.find("name", i.text))
					.catch((error) => {
						console.log(error);
					});
			}
		});
	};
};