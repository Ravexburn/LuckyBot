const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	issues = function issues(message, args, command) {
		const chan = getIssueChannel();
		if (!chan) return;

		let msg = args.join(" ").trim();
		if (msg === "") {
			message.channel.send(`I've got an issue, try adding an issue. \`${command} <message>\``).catch(console.error);
			return;
		}

		let guild = message.guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
			.setTitle(`Server: ${guild}\nServer ID: ${message.guild.id}\nUser ID: ${message.author.id}`)
			.setDescription("```css\n" + msg + "\n```")
			.setFooter(message.createdAt);
		if (message.attachments != null && message.attachments.size !== 0) {
			embed.setImage(message.attachments.first().url);
		}
		let color = "#a8e8eb";
		let member = message.member;
		if (member.colorRole) { color = member.colorRole.color; }
		embed.setColor(color);
		chan.send(embed).catch(console.error);
		message.channel.send(`Issue sent!`).catch(console.error);
		return;
	};

	function getIssueChannel() {
		let issueGuild = "418479049724395520";
		let issueChan = "418541543301971988";
		const guild = bot.guilds.get(issueGuild);
		if (!guild) return null;
		const chan = guild.channels.get(issueChan);
		if (!chan) return null;

		return chan;
	}
};