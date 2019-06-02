const Discord = require("discord.js");
const db = require('quick.db');

module.exports = (bot = Discord.Client) => {

	autoRoleMsg = async function autoRoleMsg(serverSettings, message) {

		const prefix = serverSettings.prefix;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);

		//Autorole
		if (command !== `${prefix}autorole`) return;

		if (args.length === 0) {
			message.channel.send(`To use auto-role please do ${command} <role name>`);
			return;
		}

		db.updateText(`autoRole_${message.guild.id}`, args.join(" ").trim()).then(i => {
			serverSettings.autoRoleOn = i.text.toLowerCase() !== "none";
			bot.setServerSettings(message.guild.id, serverSettings);
			message.channel.send(`Auto-role set to ${i.text}`);
		});
	};

	autoRoleAdd = function autoRoleAdd(member) {

		db.fetchObject(`autoRole_${member.guild.id}`).then(i => {

			if (!i.text || i.text.toLowerCase() === "none") return;

			else {
				member.addRole(member.guild.roles.find(role => role.name === i.text))
					.catch((error) => {
						console.log(error);
					});
			}
		});
	};
};