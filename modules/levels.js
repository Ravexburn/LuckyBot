const Discord = require("discord.js");
const minXp = 15;
const maxXp = 25;
const Profile = require("./profile_data.js");
const profile = new Profile();
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const timerProvider = new EnmapLevel({ name: 'timer' });
timer = new Enmap({ provider: timerProvider });
const MSG_TIME = 60000;

module.exports = (bot = Discord.Client) => {

	expFunction = function expFunction(message) {
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
						level = glevel + 1;
					}
					profile.setLvlXp(userID, level, xp);
				}).catch((error) => {
					console.log(error);
				});
		}
	};

	tempLevelProfile = function tempLevelProfile(message) {
		let xp;
		let level;
		let nextExp;
		let glevel;
		let userID = message.author.id;
		let guild = message.guild;

		profile.getProfileLevelLocal(userID, guild.id)
			.then((data) => {
				xp = data.exp;
				level = data.level;
				nextExp = nextLevelLocal(level);
			}).then(() => {
				return profile.getProfileData(userID);
			}).then((data) => {
				glevel = data.level;
			}).then(() => {
				let embed = new Discord.RichEmbed()
					.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
					.setTitle("Profile")
					.setColor("#FF6347")
					.addField("Level", level, true)
					.addField("Exp", `${xp}/${nextExp}`, true)
					.addField("Global Level", glevel, true)
					.setFooter("Prototype Profile");
				message.channel.send(embed);
			})
			.catch((error) => {
				console.log(error);
			});
	};
};

nextLevelLocal = function nextLevelLocal(level) {
	return Math.round(0.5 * (level * level) + 2 * level + 100);
};

nextLevelGlobal = function nextLevelGlobal(level) {
	return Math.round(0.5 * (level * level) + 2 * level + 50) * 7;
};