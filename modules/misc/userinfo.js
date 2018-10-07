const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	userInfo = async function userInfo(message, args) {

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
				message.channel.send("Unable to find user.");
			}

		} else {
			target = message.member;
		}

		if (!target) return;
		let member = target;
		let color = "#a8e8eb";
		let avatarURL = member.user.displayAvatarURL.split("?")[0];
		if (member.colorRole) { color = member.colorRole.color; }
		let embed = new Discord.RichEmbed()
			.setAuthor(member.user.tag, avatarURL)
			.setColor(color)
			.setThumbnail(avatarURL)
			.setURL(avatarURL)
			.addField("ID", member.user.id, true);


		let status = member.presence.status;
		status = status.replace("online", "<:online:401474727299776512> Online").replace("offline", "<:offline:401474711671799829> Offline").replace("idle", "<:away:401474693741150215> Idle").replace("dnd", "<:dnd:401474738071011329> Do Not Disturb");

		embed.addField("Status", status, true);
		embed.addField("Account Created On", member.user.createdAt.toLocaleString(), true);
		embed.addField("Joined Server On", member.joinedAt.toLocaleString(), true);
		if (member.presence.game) {
			const game = member.presence.game;
			let fieldString;
			let gameString;
			if (game.streaming) {
				fieldString = "Streaming";
				gameString = `[${game.name}](${game.url})`;
			}
			else {
				fieldString = "Playing";
				gameString = game.name;
			}
			embed.addField(fieldString, gameString, true);
		}

		let userRoles = member.roles.size > 0 ? member.roles.array().sort((a, b) => b.position - a.position).slice(0, member.roles.array().length - 1).join(", ") : "N/A";
		if (userRoles) {
			embed.addField("Roles", userRoles);
		} else {
			embed.addField("Roles", "N/A");
		}

		let pos = 0;
		let guildMembers = await message.guild.fetchMembers().then((guild) => {
			let cachedMembers = guild.members.array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

			for (i = 0; i < cachedMembers.length; i++) {
				if (cachedMembers[i].id == member.id) {
					pos = i;
				}
			}
		}).catch((error) => {
			console.log(error);
		});

		embed.setFooter(`Member #${pos + 1}`);
		message.channel.send(embed);

		return;
	};

};