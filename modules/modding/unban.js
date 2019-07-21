const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Unbans a user in a server by ID or mention

	unbanUser = async function unbanUser(message, command, args) {
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

		if (!message.member.hasPermission("BAN_MEMBERS")) {
			message.channel.send("You do not have the `BAN_MEMBERS` permission").catch(console.error);
			return;
		}

		if (!message.channel.permissionsFor(bot.user).has("BAN_MEMBERS")) {
			message.channel.send("Please enable the `BAN_MEMBERS` permisson to be able to unban").catch(console.error);
			return;
		}

		if (member === message.member) {
			message.channel.send("You can't unban yourself").catch(console.error);
			return;
		}

		let bans = await message.guild.fetchBans().catch(console.error);

		if (!bans.has(member_id)) {
			message.channel.send("User is not banned on this server.").catch(console.error);
			return;
		}

		let reason = args.slice(1).join(" ");
		try {
			let user = await message.guild.unban(member_id, reason);
			await user;
			if (!reason) {
				reason = "no reason provided";
			}
			let embed = new Discord.RichEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
				.setColor("#00FF00")
				.addField("User", `${user} ${user.username} - (#${user.id})`)
				.addField("Unban Reason", `${reason}`)
				.setTimestamp(message.createdAt);
			message.channel.send(embed).catch(console.error);
		} catch (error) {
			console.log(error);
		}
	};

};