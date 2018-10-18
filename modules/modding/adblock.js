const Discord = require("discord.js");


module.exports = (bot = Discord.Client) => {

	adblocker = function adblocker(message) {
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		
		const serverSettings = bot.getServerSettings(message.guild.id);
		if (serverSettings.adBlocktoggle === false) return;
		if (!serverSettings) return;

		let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
		
		if (message.content.includes("https://discord.gg/") && !message.member.hasPermission(perms)) {
			message.delete();
			message.reply("Please do not post discord links.");
			return;
		}

	};
};