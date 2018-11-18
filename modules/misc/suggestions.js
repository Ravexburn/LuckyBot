const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	suggestions = function suggestions(message, args, command) {
		const chan = getSuggestionChannel();
		if (!chan) return;

		let msg = args.join(" ").trim();
		if (msg === "") {
			message.channel.send(`I've got a suggestion, try adding a suggestion. \`${command} <message>\``);
			return;
		}

		let guild = message.guild.name.replace(/\*/g, '\\*').replace(/\_/g, '\\_').replace(/\~/g, '\\~').replace(/\`/g, '\\`');

		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
			.setTitle(`Server: ${guild}`)
			.setDescription("```css\n" + msg + "\n```")
			.setFooter(message.createdAt);
		if (message.attachments != null && message.attachments.size !== 0) {
			embed.setImage(message.attachments.first().url);
		}
		let color = "#a8e8eb";
		let member = message.member;
		if (member.colorRole) { color = member.colorRole.color; }
		embed.setColor(color);
		chan.send(embed);
		message.channel.send(`Suggestion sent!`);
		return;
	};

	function getSuggestionChannel() {
		let suggestGuild = "418479049724395520";
		let suggestChan = "418541520304603137";
		const guild = bot.guilds.get(suggestGuild);
		if (!guild) return null;
		const chan = guild.channels.get(suggestChan);
		if (!chan) return null;

		return chan;
	}
};