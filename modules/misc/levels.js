const Discord = require("discord.js");
const minXp = 15;
const maxXp = 25;
const Profile = require("./profile_data.js");
const profile = new Profile();
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const timerProvider = new EnmapLevel({ name: 'timer' });
const timer = new Enmap({ provider: timerProvider });
const MSG_TIME = 60000;

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);

	expFunction = function expFunction(message) {
		if (message.system) return;
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (message.channel.id === "421542468300046336") return;
		let guild = message.guild;
		let userID = message.author.id;
		if (!timer.has(guild.id)) {
			timer.set(guild.id, {});
		}
		const guildTimer = timer.get(guild.id);
		if (!guildTimer[userID]) {
			guildTimer[userID] = 0;
		}
		if (guildTimer[userID] <= message.createdTimestamp && message.createdTimestamp - guildTimer[userID] >= MSG_TIME) {
			guildTimer[userID] = message.createdTimestamp;
			timer.set(guild.id, guildTimer);
			let newXp = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
			profile.getProfileLevelLocal(userID, guild.id)
				.then((data) => {
					let xp = data.exp;
					let level = data.level;
					xp = xp + newXp;
					let nextExp = nextLevelLocal(level);
					if (xp >= nextExp) {
						xp = xp - nextExp;
						level = level + 1;
						if (guild.id == 261337708406898688) {
							const chan = getLevelChannel();
							if (!chan) return;
							chan.send(`**${message.author} Congratulations you have reached level: ${level}**`)
								.then((message) => {
									message.react(bot.emojis.get("422194833575247872"))
										.catch((error) => {
											console.log(error);
										});
								});
						}
					}
					profile.setLvlXpLocal(userID, guild.id, level, xp);
				}).then(() => {
					return profile.getProfileData(userID);
				}).then((data) => {
					let xp = data.exp;
					let level = data.level;
					xp = xp + newXp;
					let nextExp = nextLevelGlobal(level);
					if (xp >= nextExp) {
						xp = xp - nextExp;
						level = level + 1;
					}
					profile.setLvlXp(userID, level, xp);
				}).catch((error) => {
					console.log(error);
				});
		}
	};

	tempLevelProfile = async function tempLevelProfile(message, args) {
		if (message.system) return;
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		let xp;
		let level;
		let nextExp;
		let glevel;
		let userID = null;
		let guild = message.guild;

		if (args.length !== 0) {
			const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));
			if (matches) {
				userID = matches[1];
			}
			if (!userID) {
				userID = args[0];
			}
		}

		let target = message.member;

		if (message.guild.members.has(userID)) {
			target = message.guild.member(userID);
		}

		if (!target) {
			target = await bot.fetchUser(userID);
		}
		let member = target;

		profile.getProfileLevelLocal(member.id, guild.id)
			.then((data) => {
				xp = data.exp;
				level = data.level;
				nextExp = nextLevelLocal(level);
			}).then(() => {
				return profile.getProfileData(member.id);
			}).then((data) => {
				glevel = data.level;
				ticket = data.tickets;
				rep = data.rep;
			}).then(() => {
				let embed = new Discord.RichEmbed()
					.setAuthor(member.user.tag, member.user.displayAvatarURL.split("?")[0])
					.setTitle("Profile")
					.setColor("#FF6347")
					.addField("Local Level", level, true)
					.addField("Local Exp", `${xp}/${nextExp}`, true)
					.addField("Global Level", glevel, true)
					.addField("Tickets", ticket, true)
					.addField("Rep", rep, true)
					.setFooter("Prototype Profile");
				message.channel.send(embed);
			}).catch((error) => {
				console.log(error);
			});
	};

	leaderboardGlobal = async function leaderboardGlobal(message) {
		let limit = 100;
		profile.sortLevels(limit)
			.then(async (data) => {
				let arr = [];
				for (i = 0; i < data.length; i++) {
					let userID = data[i].user_id;
					let level = data[i].level;
					let user = bot.users.get(userID);
					let name = "";
					if (!user) {
						user = await bot.fetchUser(userID);
					}
					if (!user) {
						name = userID;
					} else {
						name = user.username;
					}
					let rank = (i + 1 < 10) ? ` ${i + 1}` : `${i + 1}`;
					let str = `${rank}.  ${name} (${level})`;
					arr.push(str);
				}
				return Promise.resolve(arr);
			}).then((arr) => {
				var pages = toEmbedPages(arr);
				var css = "```css\n" + pages.join("\n") + "```";
				let embed = new Discord.RichEmbed()
					.setAuthor("Global Leaderboard")
					.setColor("#fa4384")
					.setTitle("Rank - User - Level", true)
					.setDescription("```css\n" + arr.join("\n") + "```");
				embedPages(message, embed, pages, css);
			}).catch((error) => {
				console.log(error);
			});
	};

	leaderboardLocal = async function leaderboardLocal(message) {
		let limit = 100;
		let guild = message.guild;
		profile.sortLevelsLocal(guild.id, limit)
			.then(async (data) => {
				let arr = [];
				for (i = 0; i < data.length; i++) {
					let userID = data[i].user_id;
					let level = data[i].level;
					let user = bot.users.get(userID);
					let name = "";
					if (!user) {
						user = await bot.fetchUser(userID);
					}
					if (!user) {
						name = userID;
					} else {
						name = user.username;
					}
					let rank = (i + 1 < 10) ? ` ${i + 1}` : `${i + 1}`;
					let str = `${rank}.  ${name} (${level})`;
					arr.push(str);
				}
				return Promise.resolve(arr);
			}).then((arr) => {
				var pages = toEmbedPages(arr);
				let embed = new Discord.RichEmbed()
					.setAuthor(`Leaderboard for ${guild.name}`)
					.setColor("#fa4384")
					.setTitle("Rank - User - Level", true)
					.setDescription("```css\n" + arr.join("\n") + "```");
				embedPages(message, embed, pages);
			}).catch((error) => {
				console.log(error);
			});
	};

	function getLevelChannel() {
		let levelGuild = "261337708406898688";
		let levelChan = "421533856831897600";
		const guild = bot.guilds.get(levelGuild);
		if (!guild) return null;
		const chan = guild.channels.get(levelChan);
		if (!chan) return null;

		return chan;
	}
};

nextLevelLocal = function nextLevelLocal(level) {
	return Math.round(0.5 * (level * level) + 2 * level + 100);
};

nextLevelGlobal = function nextLevelGlobal(level) {
	return Math.round(0.5 * (level * level) + 2 * level + 50) * 7;
};