const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("../modules/modding/autorole.js")(bot);
	require("./../modules/misc/commands.js")(bot);
	require("../modules/general/information.js")(bot);
	require("../modules/misc/lastfm.js")(bot);
	require("../modules/misc/levels.js")(bot);
	require("../modules/modding/adblock.js")(bot);
	require("../modules/modding/messagelogs.js")(bot);
	require("../modules/general/misccommands.js")(bot);
	require("../modules/general/modcommands.js")(bot);
	require("../modules/misc/notifications.js")(bot);
	require("../modules/modding/roles.js")(bot);
	require("../modules/modding/starboard.js")(bot);

	msgHandler = async function msgHandler(message) {


		if (message.system || message.author.bot || message.channel.type === "dm") return;

		const serverSettings = getServerSettings(bot, message);
		if (!serverSettings) return;

		if (serverSettings.adBlocktoggle) adblocker(message);
		if (serverSettings.rolesOn) rolesAdd(serverSettings, message);

		if (message.content.startsWith(serverSettings.prefix)) {
			userCommands(serverSettings, message);
			modOnlyCommands(serverSettings, message);
		} else {
			notifyPing(message);
		}

		considerLoggingMessage(serverSettings, message);

		relays.relayMessage(message, relays.relayRave);
		expFunction(message);
	};

	reactHandler = async function reactHandler(reaction) {
		if (!reaction) return;
		let message = reaction.message;
		if (message.author.bot) return;
		if (!bot.hasServerSettings(message.guild.id)) {
			bot.initServerSettings(message.guild.id);
		}
		const serverSettings = bot.getServerSettings(message.guild.id);
		if (!serverSettings) return;

		if ([].concat(serverSettings.starboardEmoji).includes(reaction.emoji.name)) {
			starboardUpdate(serverSettings, reaction);
		}
	};

	function getServerSettings(bot, message) {
		if (!bot.hasServerSettings(message.guild.id)) {
			bot.initServerSettings(message.guild.id);
		}
		const serverSettings = bot.getServerSettings(message.guild.id);
		return serverSettings;
	}

	function considerLoggingMessage(serverSettings, message) {
		if (serverSettings.logsOn) {
			if (serverSettings.messageLog && serverSettings.channelID) {
				msgLog(serverSettings, message);
			}
			if (serverSettings.imageLog && serverSettings.imageChannelID) {
				imgLog(serverSettings, message);
			}
		}
	}

	function modOnlyCommands(serverSettings, message) {
		bkpCmd(serverSettings, message);
		let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
		if (perms.some(i => message.member.hasPermission(i))) {
			modCmds(serverSettings, message, perms);
			autoRoleMsg(serverSettings, message);
		}
		owner(message);
	}

	function userCommands(serverSettings, message) {
		commands(serverSettings, message);
		customCommands(serverSettings, message);
		infoMsg(serverSettings, message);
		lastFM(serverSettings, message);
		miscCommands(serverSettings, message);
		notifySet(serverSettings, message);
	}
};