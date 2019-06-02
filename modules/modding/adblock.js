const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	adblocker = function adblocker(message) {

		let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
		if (message.member.hasPermission(perms)) return;

		if (message.content.includes("discord.gg/")) {
			message.delete(500).catch(console.error);
			message.reply("Please do not post discord links.").catch(console.error);
			return;
		}

	};
};