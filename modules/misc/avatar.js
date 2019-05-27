const Discord = require("discord.js");

module.exports = () => {

	avatar = function avatar(message, args) {
		let target_id = null;
		let target;
		if (args.length !== 0) {
			const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));
			if (matches) {
				target_id = matches[1];
			}
			if (!target_id) {
				target_id = args[0];
			}

			if (message.guild.members.has(target_id)) {
				target = message.guild.member(target_id);
			} else {
				message.channel.send("Unable to find user.").catch(console.error);
			}

		} else {
			target = message.member;
		}

		if (!target) return;
		let member = target;
		let color = "#a8e8eb";
		let avatarURL = member.user.displayAvatarURL.split("?")[0] + "?size=1024";
		if (member.colorRole) { color = member.colorRole.color; }
		let embed = new Discord.RichEmbed()
			.setAuthor(member.user.tag, avatarURL)
			.setColor(color)
			.setImage(avatarURL);
		message.channel.send(embed).catch(console.error);
		return;
	};

};