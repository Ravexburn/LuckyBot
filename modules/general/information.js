const Discord = require("discord.js");
const link = "https://trello.com/b/0uytHSPL";
const link2 = "https://github.com/Ravexburn/LuckyBot";
const invite = "https://discord.gg/z4thPtW";
const website = "https://luckybot.io/";
const donate = "https://www.patreon.com/ravexburn";

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
	require("../misc/suggestions.js")(bot);
	require("../misc/userinfo.js")(bot);

	infoMsg = async function infoMsg(serverSettings, message) {

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		let prefix = serverSettings.prefix;

		//User Info Settings

		if (command === `${prefix}userinfo`) {
			userInfo(message, args);
			return;
		}

		//Server Info Settings

		if (command === `${prefix}serverinfo`) {
			serverInfo(message);
			return;
		}

		//Bot Info

		if (command === `${prefix}botinfo` || command === `${prefix}about` || command === `${prefix}info`) {
			botInfo(message, prefix);
			return;
		}

		//Trello

		if (command === `${prefix}trello`) {
			message.channel.send(`View upcoming features here: ${link}`).catch(console.error);
			return;
		}

		//Github

		if ((command === `${prefix}github`) || (command === `${prefix}git`)) {
			message.channel.send(`View upcoming features here: ${link2}`).catch(console.error);
			return;
		}

		//Invite

		if ((command === `${prefix}invite`) || (command === `${prefix}inv`)) {
			message.channel.send(`Sent a DM <:luckysushi:418558090682695681>`).catch(console.error);
			message.author.send(`Want ${bot.user.username} for your server? Have any questions on how to use ${bot.user.username}? Join here ${invite} and make sure to read #welcome or post your server in #add-your-server!`).catch(console.error);
			return;
		}

		//Profile

		if (command === `${prefix}profile`) {
			tempLevelProfile(message, args);
			return;
		}

		//Tickets

		if (command === `${prefix}ticket`) {
			curFunction(message);
			return;
		}

		//Rep

		if (command === `${prefix}rep`) {
			repFunction(message, args);
			return;
		}

		//Leaderboard & User top servers

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

		if (command == `${prefix}topservers`) {
			topServers(message);
			return;
		}

		//Roles info

		if ((command === `${prefix}roleslist`) || (command === `${prefix}rolelist`)) {
			rolelist(message);
			return;
		}

		//Bias info

		if ((command === `${prefix}biaslist`) || (command === `${prefix}biasstats`)) {
			memberCount(message);
			return;
		}

		//Help

		if (command === `${prefix}help`) {
			message.reply(`Help can be found here: ${website}`).catch(console.error);
			return;
		}

		//Suggestions

		if (command === `${prefix}suggestion` || command === `${prefix}suggest` || command === `${prefix}sgt`) {
			suggestions(message, args, command);
			return;
		}

		//Issues

		if (command === `${prefix}issue` || command === `${prefix}issues` || command === `${prefix}isu`) {
			issues(message, args, command);
			return;
		}

		//Donate link

		if ((command === `${prefix}donate`)) {
			message.channel.send(`If you would like to help out with keeping Lucky Bot running, you can donate here: <${donate}>. Anything is appreciated!`).catch(console.error);
			return;
		}

		//Donators

		if ((command === `${prefix}donators`)) {
			donators(message);
			return;
		}

		//Ping

		if (command === `${prefix}ping`) {
			botPing(message);
		}
	};
};