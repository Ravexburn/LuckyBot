const Discord = require("discord.js");
const lastfmSite = "https://www.last.fm";

module.exports = (bot = Discord.Client) => {

	//Help command for Notifications
	notifyHelp = function notifyHelp(prefix, embed) {
		embed.setTitle(":round_pushpin: Notifications");
		embed.setColor("#b19cd9");
		embed.addField(`${prefix}notify`, "Shows this list of commands for notifications.");
		embed.addField(`${prefix}notify list`, "Direct messages a list of keywords for the server.");
		embed.addField(`${prefix}notify clear`, "Removes all keywords for the server.");
		embed.addField(`${prefix}notify add <keyword>`, "Adds a <keyword> to notify you about on the server.");
		embed.addField(`${prefix}notify remove <keyword>`, "Removes a <keyword> you were notified about on the server.");
		embed.addField(`${prefix}notify global list`, "Direct messages a list of global keywords.");
		embed.addField(`${prefix}notify global clear`, "Removes all global keywords you have.");
		embed.addField(`${prefix}notify global add <keyword>`, "Adds a <keyword> to notify you about on all servers.");
		embed.addField(`${prefix}notify global remove <keyword>`, "Removes a <keyword> you were notified about on all servers.");
		embed.addField(`${prefix}notify ignore channel <#channel>`, "Ignores all keyword triggers in <#channel>.");
		embed.addField(`${prefix}notify ignore server`, "Ignores all global keyword triggers in the server.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help command for Custom Commands
	commandsHelp = function commandsHelp(prefix, embed) {
		embed.setTitle(":speech_left: Custom Commands");
		embed.setColor("#40e0d0");
		embed.addField(`${prefix}command`, "Shows this list of commands for custom commands.");
		embed.addField(`${prefix}command list`, "Direct messages a list of custom commands on the server.");
		embed.addField(`${prefix}command add <name> <command>`, "Adds a custom command to the server.");
		embed.addField(`${prefix}command remove <name> <command>`, "Removes a custom command on the server.");
		embed.addField(`${prefix}command edit <name> <command>`, "Edits a custom command on the server.");
		embed.addField(`${prefix}command search <name>`, "Search for custom commands on the server containing a given word.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help command for Lastfm Commands
	lastFMHelp = function lastFMHelp(prefix, embed) {
		embed.setTitle(":musical_note: LastFM Commands");
		embed.setColor("#D21E26");
		embed.addField(`${prefix}lastfm`, "Shows last.fm account info.");
		embed.addField(`${prefix}lastfm help`, "Shows this list of commands for last.fm commands.");
		embed.addField(`${prefix}lastfm set`, `Saves last.fm username (requires a [last.fm](${lastfmSite}) account).`);
		embed.addField(`${prefix}lastfm nowplaying`, "Shows the song currently playing.");
		embed.addField(`${prefix}lastfm recent`, "Shows the songs recently listened to.");
		embed.addField(`${prefix}lastfm toptracks <week|month|3-month|half-year|year>`, "Shows the top tracks of <period>.");
		embed.addField(`${prefix}lastfm topartist <week|month|3-month|half-year|year>`, "Shows the top artists of <period>.");
		embed.addField(`${prefix}lastfm topalbums <week|month|3-month|half-year|year>`, "Shows the top albums of <period>.");
		embed.setFooter("If you have any other questions please contact Rave#0737", "https://i.imgur.com/C7u8gqg.jpg");
	};

	//Help for Greeter Commands
	welcomeHelp = function welcomeHelp(prefix, embed) {
		embed.setTitle(":wave: Greeter Commands");
		embed.setColor("#ff8533");
		embed.addField(`${prefix}greeter`, "Shows this list of commands for greeter.");
		embed.addField(`${prefix}greeter channel <channel name>`, "Sets the channel the bot should greet new members in.");
		embed.addField(`${prefix}greeter message <message>`, "Sets the message the bot says when a new member joins.\n Use {server} for the server name. Use {user} for the username. Use {mention} for a mention.");
		embed.addField(`${prefix}toggle greeter`, "Toggles the greeter functionality.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help for Starboard Commands
	starboardHelp = function starboardHelp(prefix, embed) {
		embed.setTitle(":star: Starboard Commands");
		embed.setColor("#ff8533");
		embed.addField(`${prefix}starboard`, "Shows this list of commands for starboard.");
		embed.addField(`${prefix}starboard channel <channel name>`, "Sets the channel where the bot should pin starred messages.");
		embed.addField(`${prefix}starboard emoji`, "View this server's list of valid emoji for pinning messages to the starboard.");
		embed.addField(`${prefix}starboard emoji add`, "Add an emoji to the list of valid emoji for pinning messages to the starboard.");
		embed.addField(`${prefix}starboard emoji remove`, "Remove an emoji from the list of valid emoji for pinning messages to the starboard.");
		embed.addField(`${prefix}starboard number <number>`, "Sets the number of reactions required to pin messages on the board.");
		embed.addField(`${prefix}toggle starboard`, "Toggles the starboard functionality.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help for Start Commands
	startHelp = function startHelp(prefix, embed) {
		embed.setTitle(":checkered_flag: Start Commands");
		embed.setColor("#2ecc71");
		embed.addField(`${prefix}start`, "Shows this list of commands for start.");
		embed.addField(`${prefix}start help`, "Shows a detailed list of commands for start.");
		embed.addField(`${prefix}start roles <channel name>`, "Sets the channel for the role system.");
		embed.addField(`${prefix}start logs <channel name>`, "Sets the channel for message logs.");
		embed.addField(`${prefix}start join <channel name>`, "Sets the channel for users joining and leaving. (Message cannot be changed on this)");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help for Toggle Commands
	toggleHelp = function toggleHelp(prefix, embed) {
		embed.setTitle(":arrows_counterclockwise: Toggle Commands");
		embed.setColor("#3498db");
		embed.addField(`${prefix}toggle`, "Shows this list of commands for toggles.");
		embed.addField(`${prefix}toggle logs`, "Toggles the logs functionality.");
		embed.addField(`${prefix}toggle image`, "Changes between embed disabled for images in message logs.");
		embed.addField(`${prefix}toggle greeter`, "Toggles the greeter functionality.");
		embed.addField(`${prefix}toggle roles`, "Toggles the roles functionality.");
		embed.addField(`${prefix}toggle adblock`, "Toggles the ability to post discord links.");
		embed.addField(`${prefix}toggle starboard`, "Toggles the starboard functionality.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help for Server Commands
	ownerServerHelp = function ownerServerHelp(prefix, embed) {
		embed.setTitle(":robot: Server Commands");
		embed.setColor("#a893f9");
		embed.addField(`${prefix}server`, "Shows this list of commands for server.");
		embed.addField(`${prefix}server list`, `Shows the servers ${bot.user.username} is in.`);
		embed.addField(`${prefix}server leave`, `${bot.user.username} leaves a server it is in.`);
		embed.addField(`${prefix}server settings <serverid>`, "Shows enabled settings on <server>. Defaults to current server if no id is provided.");
	};

	//Help for Relay Commands
	relayHelp = function relayHelp(prefix, embed) {
		embed.setTitle(":arrows_counterclockwise: Relay Commands");
		embed.setColor("#A021ED");
		embed.addField(`${prefix}relay`, "Shows this list of commands for relay.");
		embed.addField(`${prefix}relay list`, "Shows existing relays.");
		embed.addField(`${prefix}relay start <name> <type> <chanID1> <chanID2>`, "Starts a relay of <type> between at least two channels.");
		embed.addField(`${prefix}relay add <name> <chanID>`, "Adds a channel to an existing relay.");
		embed.addField(`${prefix}relay remove <name> <chanID>`, "Removes a channel from an existing relay.");
		embed.addField(`${prefix}relay delete <name>`, "Deletes an existing relay.");
	};

};