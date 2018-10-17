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
		
		//Functions

		adblocker(message);
		autoRoleMsg(message);
		bkpCmd(message);
		commands(message);
		customCommands(message);
		expFunction(message);
		imgLog(message);
		infoMsg(message);
		lastFM(message);
		miscCommands(message);
		modCmds(message);
		msgLog(message);
		notifyPing(message);
		notifySet(message);
		owner(message);
		relays.relayMessage(message, relays.relayRave);
		rolesAdd(message);
	};

	reactHandler = async function reactHandler(reaction) {
		starboardUpdate(reaction);
	}; 
};
