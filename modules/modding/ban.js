const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Bans a user in a server by ID or mention

	banUser = function banUser(message, command, args) {
		if (args.length === 0) {
			message.channel.send(`Please do ${command} <user> [days] [reason]`);
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

		if (!message.member.hasPermission("BAN_MEMBERS")) {
			message.channel.send("You do not have the `BAN_MEMBERS` permission");
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("BAN_MEMBERS")) {
			message.channel.send("Please enable the `BAN_MEMBERS` permisson to be able to ban");
			return;
		}

		if (member) {
			if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD") || member.hasPermission("VIEW_AUDIT_LOG")) {
				message.channel.send("You can't ban that person");
				return;
			}
		}

		if (member === message.member) {
			message.channel.send("You can't ban yourself");
			return;
		}

		let reason = args.slice(1).join(" ");
		let days = 0;
		if (isNaN(args[1])) {
			reason = args.slice(1).join(" ");
		} else {
			days = parseInt(args[1]);
			reason = args.slice(2).join(" ");
		}

		if (days <= 0) {
			days = 0;
		}else if (days == 1){
			days = 1;
		}else if(days > 1){
			days = 7;
		}

		message.guild.ban(member_id, { days, reason }).then((user) => {
			if (!reason) {
				reason = "no reason provided";
			}
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
				.setColor("#800000")
				.addField("User", `${user} ${user.username} - (#${user.id})`)
				.addField("Ban Reason", `${reason}`)
				.addField("Deleted message days", `${days} day(s)`)
				.setTimestamp(message.createdAt);
			message.channel.send(embed);
		}).catch((error) => {
			message.channel.send(error.message);
		});
	};

};