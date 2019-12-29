const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("../../functions/functions.js")(bot);

	botInfo = function botInfo(message, prefix, trello, github, helpServer, website, patreon) {
		let time = bot.uptime;
		const {seconds, minutes, hours, days} = timeFunction(time);
		let date = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		let embed = new Discord.RichEmbed()
			.setAuthor(`About ${bot.user.username}`, bot.user.displayAvatarURL)
			.setColor("#a8e8eb")
			.setThumbnail(bot.user.displayAvatarURL)
			.setURL(bot.user.displayAvatarURL)
			.addField("Authors", "Rave#0737 and OrigamiCoder#1375")
			.addField("Uptime", date)
			.addField("Links", `[Website](${website}) **-** [Trello](${trello}) **-** [Github](${github}) **-** [Discord](${helpServer}) **-** [Patreon](${patreon})`, true)
			.addField("Servers", bot.guilds.size, true)
			.addField(`Total members using ${bot.user.username}`, bot.guilds.map(g => g.memberCount).reduce((a, b) => a + b))
			.addField("Bot Joined Server On", message.guild.joinedAt.toLocaleString(), true)
			.addField("Suggestions", `Have a suggestion? Use ${prefix}suggestion <your suggestion>`)
			.addField("Issues", `Having an issue with the bot? Use ${prefix}issue <your issue> to report it!`)
			.setFooter(`Bot ID ${bot.user.id}`);
		message.channel.send(embed).catch(console.error);
		return;
	};

};