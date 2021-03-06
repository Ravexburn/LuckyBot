const Discord = require("discord.js");
const Profile = require("./profile_data.js");
const profile = new Profile();
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const repProvider = new EnmapLevel({
	name: 'rep'
});
const rep = new Enmap({
	provider: repProvider
});
const MSG_TIME = 12 * 60 * 60 * 1000;

module.exports = (bot = Discord.Client) => {

	require("../../functions/functions.js")(bot);

	repFunction = async function repFunction(message, args) {

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

			if (args.length === 0) {
				message.channel.send("Please give me someone to rep! <:rooGun:433064572761538561>").catch(console.error);
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

			let target;

			if (message.guild.members.has(repped)) {
				target = message.guild.member(repped);
			} else {
				target = bot.fetchUser(repped);
			}
			if (!target || !target.user) {
				message.channel.send("Sorry, user is not in the server! <:rooBlank:602525416565112862>").catch(console.error);
				return;
			} else if (target === message.member) {
				message.channel.send("Sorry, you can't rep yourself! <:rooCop:433057685953445900>").catch(console.error);
				return;
			} else if (target.user.bot === true) {
				message.channel.send("Sorry, you can't rep bots! <:rooBot:433057158301614100>").catch(console.error);
				return;
			}

			rep.set(userID, repTimer);
			try {
				const data = await profile.getProfileData(target.id);
				let userrep = data.rep;
				userrep = userrep + 1;
				message.channel.send(`I have given a reputation point to ${target.user.username}! <a:rooClap:432961197323714580>`).catch(console.error);
				await profile.setRep(target.id, userrep);
			} catch (error) {
				console.log(error);
			}
		} else {
			let time = MSG_TIME - timedif;
			const {seconds, minutes, hours} = timeFunction(time);
			message.channel.send(`Please wait ${hours}h ${minutes}m and ${seconds}s to be able to give another rep! <:rooScared:433018721326596117>`).catch(console.error);
		}
	};
};