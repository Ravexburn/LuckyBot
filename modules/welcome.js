const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Greeter message

	welcomeMsg = function welcomeMsg(member) {
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
		let serverName = guild.name;
		let image = serverSettings.welcomeImage;

		// Retrieve member directly from guild because new member won't be cached in bot yet
		guild.fetchMember(member.user).then((guildMember) => { 
			let mention = guildMember.user;
			let username = guildMember.user.username;
			let user = mention.tag;

			msg = msg.replace("{mention}", mention).replace("{server}", serverName).replace("{user}", user).replace("{username}", username);

			let embed = new Discord.RichEmbed()
				.setColor("RANDOM")
				.setThumbnail(member.user.displayAvatarURL)
				.setURL(member.user.displayAvatarURL)
				.setTitle("Member Join!")
				.setDescription(msg);
			//	.setImage(image);
			chan.send(embed);
		});
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
			.setThumbnail(member.user.displayAvatarURL)
			.setURL(member.user.displayAvatarURL)
			.setTitle("Member Join!");
		
		bot.invCache.usedInvite(guild).then(invite => {
			if (invite) {
				embed.addField("Invite Used", `${invite.url} created by ${invite.inviter}. Uses: ${invite.uses}`)
			}
			embed.addField("Account Info", `Username: ${user.tag}\nCreated on: ${user.createdAt.toUTCString()}\nJoined on: ${member.joinedAt.toUTCString()}`);
			embed.addField("Shared Servers", `This account shares: ${sharedguilds} other server(s) with Lucky Bot.`);
			embed.setDescription(`${user} joined the server.`);
			embed.setFooter(`ID: ${user.id}`)

			if (numOfBans) {
				embed.addField("Bans", `:warning: This user is banned on ${numOfBans} server(s).`);
			} else {
				embed.addField("Bans", `This user is not banned on any servers.`);
			}
			chan.send(embed);
		}).catch((error) => {
			console.log(error);
		});
	};

	//Leave

	leaveMsg = function leaveMsg(member) {
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
			.setDescription(`${user} left the server.`)
			.addField("Account Info", `Username: ${user.tag}\nCreated on: ${user.createdAt.toUTCString()}\nJoined on: ${member.joinedAt.toUTCString()}`)
			.setFooter(`ID: ${user.id}`);
		chan.send(embed);
	};
};
