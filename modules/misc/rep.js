const Discord = require("discord.js");
const Profile = require("./profile_data.js");
const profile = new Profile();
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const repProvider = new EnmapLevel({ name: 'rep' });
const rep = new Enmap({ provider: repProvider });
const MSG_TIME = 12 * 60 * 60 * 1000;

module.exports = (bot = Discord.Client) => {

	repFunction = function repFunction(message, args) {
		if (message.system) return;
		if (message.author.bot) return;
		let repped = null;

		let userID = message.author.id;
		if (!rep.has(userID)) {
			rep.set(userID, 0);
		}
		let repTimer = rep.get(userID);
		if (!repTimer) {
			repTimer = 0;
		}

		const timedif = message.createdTimestamp - repTimer;
		if (repTimer <= message.createdTimestamp && timedif >= MSG_TIME) {
			repTimer = message.createdTimestamp;

			args = args.filter(arg => arg.trim().length > 0);

			if (args.length === 0){
				message.channel.send("Please give me someone to rep! <:rooGun:433064572761538561>");
				return;
			}
	
			if (args.length !== 0) {
				const matches = args[0].match(new RegExp(`<@!?(\\d+)>`));
				if (matches) {
					repped = matches[1];
				}
				if (!repped) {
					repped = args[0];
				}
				
			}
	
			let target = message.member;
	
			if (message.guild.members.has(repped)) {
				target = message.guild.member(repped);
			}
	
			if (!target) {
				target = bot.fetchUser(repped);
			}
			let member = target;

			if (member === message.member){
				message.channel.send("You can't rep yourself! <:rooCop:433057685953445900>");
				return;
			}

			if (member.user.bot === true){
				message.channel.send("Sorry, you can't rep bots! <:rooBot:433057158301614100>");
				return;
			}

			rep.set(userID, repTimer);
			profile.getProfileData(member.id)
				.then((data) => {
					let rep = data.rep;
					rep = rep + 1;
					message.channel.send(`I have given a reputation point to ${member.user.username}! <a:rooClap:432961197323714580>`);
					profile.setRep(member.id, rep);
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
			message.channel.send(`Please wait ${hours}h ${minutes}m and ${seconds}s to be able to give another rep! <:rooScared:433018721326596117>`);
		}
	};
};