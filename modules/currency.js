const Discord = require("discord.js");
const Profile = require("./profile_data.js");
const profile = new Profile();
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const currencyProvider = new EnmapLevel({ name: 'tickets' });
const currency = new Enmap({ provider: currencyProvider });
const MSG_TIME = 6 * 60 * 60 * 1000;

module.exports = (bot = Discord.Client) => {

	curFunction = function curFunction(message) {
		if (message.system) return;
		if (message.author.bot) return;

		let userID = message.author.id;
		if (!currency.has(userID)) {
			currency.set(userID, 0);
		}
		let curTimer = currency.get(userID);
		if (!curTimer) {
			curTimer = 0;
		}
		const timedif = message.createdTimestamp - curTimer;
		if (curTimer <= message.createdTimestamp && timedif >= MSG_TIME) {
			curTimer = message.createdTimestamp;
			currency.set(userID, curTimer);
			profile.getProfileData(userID)
				.then((data) => {
					let tickets = data.tickets;
					let guildSize = Math.floor(bot.guilds.size / 100) + 1;
					tickets = tickets + guildSize;
					message.channel.send(`You have been granted ${guildSize} ticket(s)! <:rooDuck:432962760570044417>`);
					profile.setCur(userID, tickets);
				}).catch((error) => {
					console.log(error);
				});
		} else {
			let time = MSG_TIME - timedif;
			time = Math.floor(time / 1000);
			let seconds = time % 60;
			time = Math.floor(time / 60);
			let minutes = time % 60;
			time = Math.floor(time / 60);
			let hours = time % 24;
			message.channel.send(`Please wait ${hours}h ${minutes}m and ${seconds}s for a new ticket! <:rooScared:433018721326596117>`);
		}
	};
};