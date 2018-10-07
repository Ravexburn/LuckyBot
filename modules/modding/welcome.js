const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Greeter message

	welcomeMsg = async function welcomeMsg(member) {
		if (member.user.bot) return;
		const guild = member.guild;
		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;
		if (!serverSettings.welcomeChannelID) return;
		const welcomeChannelID = serverSettings.welcomeChannelID;

		if (!guild.channels.has(welcomeChannelID)) {
			return;
		}
		const chan = guild.channels.get(welcomeChannelID);
		if (serverSettings.welcomeOn === false) return;
		if (!serverSettings.welcomeMessage) {
			serverSettings.welcomeMessage = bot.getDefaultSettings().welcomeMessage;
			bot.setServerSettings(guild.id, serverSettings);
		}

		let msg = serverSettings.welcomeMessage;
		let mention = member.user;
		let serverName = guild.name;
		let user = member.user.tag;
		let image = serverSettings.welcomeImage;

		let pos = 0;
		let guildMembers = await guild.fetchMembers().then((guild) => {
			let cachedMembers = guild.members.array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

			for (i = 0; i < cachedMembers.length; i++) {
				if (cachedMembers[i].id == member.id) {
					pos = i;
				}
			}
		}).catch((error) => {
			console.log(error);
		});

		msg = msg.replace("{mention}", mention).replace("{server}", serverName).replace("{user}", user);

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setThumbnail(member.user.displayAvatarURL)
			.setURL(member.user.displayAvatarURL)
			.setTitle("Member Join!")
			.setDescription(msg)
			.setTimestamp(member.joinedAt)
			.setFooter(`Member #${pos + 1} 🎉`);
		chan.send(embed);
	};

	//Join

	joinMsg = async function joinMsg(member) {
		const guild = member.guild;
		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;
		if (!serverSettings.joinChannelID) return;
		const joinChannelID = serverSettings.joinChannelID;

		if (!guild.channels.has(joinChannelID)) {
			return;
		}
		const chan = guild.channels.get(joinChannelID);

		let user = member.user;
		let serverName = guild.name;
		let sharedguilds = 0;

		bot.guilds.forEach(guild => {
			if (member.guild.id !== guild.id && guild.members.has(user.id)) {
				sharedguilds++;
			}
		});

		let bans = bot.guilds.map(guild => guild.fetchBans().catch(() => { }));
		bans = await Promise.all(bans);
		const banned = bans.filter(list => {
			if (!list) return false;
			return list.has(member.id);
		});
		const numOfBans = banned.length;

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setAuthor(user.tag, user.displayAvatarURL.split("?")[0])
			.setThumbnail(member.user.displayAvatarURL)
			.setURL(member.user.displayAvatarURL)
			.setFooter(`Member ID #${user.id}`)
			.setTimestamp(user.joinedAt)
			.setTitle("Member Join!")
			.addField("Account Age", `Account was created on: **${user.createdAt.toUTCString()}**\nAccount joined server on: **${member.joinedAt.toUTCString()}**`)
			.addField("Shared Servers", `This account shares: **${sharedguilds} other server(s)** with ${bot.user.username}.`);
		if (numOfBans) {
			embed.addField("Bans", `:warning: This user is banned on **${numOfBans} server(s).**`);
		} else {
			embed.addField("Bans", `This user is **not banned** on any servers with ${bot.user.username}.`);
		}
		try {
			if (!guild.me.hasPermission("MANAGE_GUILD")) {
				embed.addField("Invites", ":warning: Please enable `MANAGE_SERVER` to be able to see what invite was used.");
			}
		} catch(error){
			bot.log(error);
		}
		bot.invCache.usedInvite(guild).then(invite => {
			if (invite) {
				embed.addField("Invite", `${user} joined from ${invite.url} created by ${invite.inviter}. Uses: ${invite.uses}`);
			}
		}).catch((error) => {
			console.log(error);
		}).then(() => {
			chan.send(embed);
		}).catch((error) => {
			console.log(error);
		});
	};

	//Leave

	leaveMsg = async function leaveMsg(member) {
		const guild = member.guild;
		const serverSettings = bot.getServerSettings(guild.id);
		if (!serverSettings) return;
		if (!serverSettings.joinChannelID) return;
		const joinChannelID = serverSettings.joinChannelID;

		if (!guild.channels.has(joinChannelID)) {
			return;
		}
		const chan = guild.channels.get(joinChannelID);

		let user = member.user;
		let serverName = guild.name;

		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setThumbnail(member.user.displayAvatarURL)
			.setURL(member.user.displayAvatarURL)
			.setTitle("Member Left!")
			.setDescription(`${user} left the server`);
		chan.send(embed);
	};
};