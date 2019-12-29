const Discord = require("discord.js");
const trello = "https://trello.com/b/0uytHSPL";
const github = "https://github.com/Ravexburn/LuckyBot";
const helpServer = "https://discord.gg/z4thPtW";
const website = "https://luckybot.io/";
const patreon = "https://www.patreon.com/ravexburn";

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../misc/botinfo.js")(bot);
	require("../misc/currency.js")(bot);
	require("../misc/donators.js")(bot);
	require("../misc/issues.js")(bot);
	require("../misc/levels.js")(bot);
	require("../misc/ping.js")(bot);
	require("../misc/rep.js")(bot);
	require("../misc/rolelist.js")(bot);
	require("../misc/serverinfo.js")(bot);
	require("../misc/serverinvite.js")(bot);
	require("../misc/suggestions.js")(bot);
	require("../misc/userinfo.js")(bot);

	infoMsg = async function infoMsg(serverSettings, message) {

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		let prefix = serverSettings.prefix;

		// User Info Settings

		if (command === `${prefix}userinfo`) {
			userInfo(message, args);
			return;
		}

		// Server Info Settings

		if (command === `${prefix}serverinfo`) {
			serverInfo(message);
			return;
		}

		// Bot Info

		if (command === `${prefix}botinfo` || command === `${prefix}about` || command === `${prefix}info`) {
			botInfo(message, prefix, trello, github, helpServer, website, patreon);
			return;
		}

		// Trello

		if (command === `${prefix}trello`) {
			message.channel.send(`View upcoming features here: ${trello}`).catch(console.error);
			return;
		}

		// Github

		if ((command === `${prefix}github`) || (command === `${prefix}git`)) {
			message.channel.send(`View upcoming features here: ${github}`).catch(console.error);
			return;
		}

		// Invite

		if ((command === `${prefix}invite`) || (command === `${prefix}inv`)) {
			serverInvite(message, helpServer);
			return;
		}

		// Profile

		if (command === `${prefix}profile`) {
			tempLevelProfile(message, args);
			return;
		}

		// Tickets

		if (command === `${prefix}ticket`) {
			curFunction(message);
			return;
		}

		// Rep

		if (command === `${prefix}rep`) {
			repFunction(message, args);
			return;
		}

		// Leaderboard & User top servers

		if (command == `${prefix}leaderboard`) {
			switch (args[0]) {

				case "global":
					leaderboardGlobal(message, args);
					break;

				default:
					leaderboardLocal(message, args);
					break;
			}
			return;
		}

		// Most talked in servers for user

		if (command == `${prefix}topservers`) {
			topServers(message);
			return;
		}

		// Roles info

		if ((command === `${prefix}roleslist`) || (command === `${prefix}rolelist`)) {
			rolelist(message);
			return;
		}

		// Bias info

		if ((command === `${prefix}biaslist`) || (command === `${prefix}biasstats`)) {
			memberCount(message);
			return;
		}

		// Help

		if (command === `${prefix}help`) {
			message.reply(`Help can be found here: ${website}`).catch(console.error);
			return;
		}

		// Suggestions

		if (command === `${prefix}suggestion` || command === `${prefix}suggest` || command === `${prefix}sgt`) {
			suggestions(message, args, command);
			return;
		}

		// Issues

		if (command === `${prefix}issue` || command === `${prefix}issues` || command === `${prefix}isu`) {
			issues(message, args, command);
			return;
		}

		// Donate link

		if ((command === `${prefix}donate`)) {
			message.channel.send(`If you would like to help out with keeping Lucky Bot running, you can donate here: <${patreon}>. Anything is appreciated!`).catch(console.error);
			return;
		}

		// Donators

		if ((command === `${prefix}donators`)) {
			donators(message);
			return;
		}

		// Ping

		if (command === `${prefix}ping`) {
			botPing(message);
		}
	};
};