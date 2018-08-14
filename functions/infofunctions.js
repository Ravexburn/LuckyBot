const Discord = require("discord.js");
const discordlink = "https://discord.gg/z4thPtW";
let trello = "https://trello.com/b/0uytHSPL";
let git = "https://github.com/Ravexburn/LuckyBot";
const website = "http://www.luckybot.io/";

module.exports = (bot = Discord.Client) => {
	/**
     * User Info
     * @param {Message} message 
     */
	userInfo = async function userInfo(message, args) {

		let target_id = null;
		if (args.length !== 0) {
			const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));
			if (matches) {
				target_id = matches[1];
			}
			if (!target_id) {
				target_id = args[0];
			}
		}
		let target = message.member;

		if (message.guild.members.has(target_id)) {
			target = message.guild.member(target_id);
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

		if (member.roles) {
			let roleString = member.roles.array().sort().slice(0, member.roles.array().length - 1).join(", ");
			embed.addField("Roles", roleString);
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

	/**
     * Server Info
     * @param {Message} message 
     */
	serverInfo = function serverInfo(message) {

		let embed = new Discord.RichEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL)
			.setColor("#a8e8eb")
			.setThumbnail(message.guild.iconURL)
			.setURL(message.guild.iconURL)
			.addField("Server created on", message.guild.createdAt.toLocaleString(), true)
			.addField("Owner", message.guild.owner.user.tag, true)
			.addField("Region", message.guild.region, true)
			.addField("Members", message.guild.memberCount, true)
			.addField("Roles", message.guild.roles.size, true)
			.addField("Text Channels", message.guild.channels.array().filter(channel => channel.type === "text").length, true)
			.addField("Voice Channels", message.guild.channels.array().filter(channel => channel.type === "voice").length, true)
			.setFooter(`Server ID: ${message.guild.id}`);
		message.channel.send(embed);
		return;
	};

	/**
     * Bot Info
     * @param {Message} message 
     */
	botInfo = function botInfo(message, prefix) {
		let time = bot.uptime;
		time = Math.floor(time / 1000);
		let seconds = time % 60;
		time = Math.floor(time / 60);
		let minutes = time % 60;
		time = Math.floor(time / 60);
		let hours = time % 24;
		time = Math.floor(time / 24);
		let days = time;
		let date = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		let embed = new Discord.RichEmbed()
			.setAuthor("About Lucky Bot", bot.user.displayAvatarURL)
			.setColor("#a8e8eb")
			.setThumbnail(bot.user.displayAvatarURL)
			.setURL(bot.user.displayAvatarURL)
			.addField("Authors", "Rave#0737 and OrigamiCoder#1375")
			.addField("Uptime", date)
			.addField("Links", `[Website](${website}) **-** [Trello](${trello}) **-** [Github](${git}) **-** [Discord](${discordlink})`, true)
			.addField("Servers", bot.guilds.size, true)
			.addField("Bot Joined Server On", message.guild.joinedAt.toLocaleString(), true)
			.addField("Suggestion", `Have a suggestion? Use ${prefix}suggestion <your suggestion>`)
			.setFooter(`Bot ID ${bot.user.id}`);
		message.channel.send(embed);
		return;
	};

};