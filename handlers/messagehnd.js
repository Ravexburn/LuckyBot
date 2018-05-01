const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/autorole.js")(bot);
	require("./../modules/commands.js")(bot);
	require("./../modules/information.js")(bot);
	require("./../modules/lastfm.js")(bot);
	require("./../modules/messagelogs.js")(bot);
	require("./../modules/modcommands.js")(bot);
	require("./../modules/notifications.js")(bot);
	require("./../modules/roles.js")(bot);
	require("./../modules/levels.js")(bot);

	msgHandler = async function msgHandler(message) {
		
		//Functions

		autoRoleMsg(message);
		commands(message);
		customCommands(message);
		expFunction(message);
		imgLog(message);
		infoMsg(message);
		lastFM(message);
		modCmds(message);
		msgLog(message);
		notifyPing(message);
		notifySet(message);
		owner(message);
		relays.relayMessage(message, relays.relayRave);
		rolesAdd(message);

	};
};