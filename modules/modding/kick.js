const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Kicks a user in a server by ID or mention

	kickUser = function kickUser(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please do ${command} <user> [reason]`).catch(console.error);
			return;
		}

		let member_id = null;
		const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));

		if (matches) {
			member_id = matches[1];
		}

		if (!member_id) {
			member_id = args[0];
		}

		let member = null;

		if (message.guild.members.has(member_id)) {
			member = message.guild.member(member_id);
		}

		if (!message.member.hasPermission("KICK_MEMBERS")) {
			message.channel.send("You do not have the `KICK_MEMBERS` permission.").catch(console.error);
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("KICK_MEMBERS")) {
			message.channel.send("Lucky Bot does not have the `KICK_MEMBERS` permission.").catch(console.error);
			return;
		}

		if (member === message.member) {
			message.channel.send("You can't kick yourself.").catch(console.error);
			return;
		}

		if (member) {
			if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD") || member.hasPermission("VIEW_AUDIT_LOG")) {
				message.channel.send("You can't kick that person.").catch(console.error);
				return;
			}

		}

		if (!member) {
			message.channel.send("Invalid user.").catch(console.error);
			return;
		}

		let reason = args.slice(1).join(" ");

		member.kick(reason).then((member) => {
			if (!reason) {
				reason = "no reason provided";
			}
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
				.setColor("#FFFF33")
				.addField("User", `${member} ${member.user.username} - (#${member.id})`)
				.addField("Kick Reason", `${reason}`)
				.setTimestamp(message.createdAt);
			message.channel.send(embed).catch(console.error);
		}).catch((error) => {
			message.channel.send(error.message).catch(console.error);
		});
	};

};