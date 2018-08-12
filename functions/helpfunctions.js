const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Help command for General Commands
	generalHelp = function generalHelp(message, prefix, embed) {
		embed.addField(":information_source: Information", `\*\* ${prefix}help\*\* - Shows this list of commands.
\*\* \\*\\*help\*\* - Will direct message a list of music bot commands.
\*\* ${prefix}mod\*\* - Shows a list of mod commands.
\*\* ${prefix}userinfo\*\* - Shows a user's information.
\*\* ${prefix}serverinfo\*\* - Shows the server's information.
\*\* ${prefix}profile\*\* - Shows the profile for the user.
\*\* ${prefix}ticket\*\* - Adds a ticket to your account once every 6 hours. Can be used for badges.
\*\* ${prefix}rep <user or id>\*\* - Give someone a reputation point!.
\*\* ${prefix}botinfo\*\* - Shows Lucky Bot's information.
\*\* ${prefix}invite\*\* - Info on how to get Lucky Bot for your server.
\*\* ${prefix}trello\*\* - Sends a link to Lucky Bot's trello page.
\*\* ${prefix}github\*\* - Sends a link to Lucky Bot's github page.
\*\* ${prefix}color <hex or random>\*\* - Returns an image of the color or random color.
\*\* ${prefix}issue\*\* - Please report any issues you are having with Lucky Bot using this command.
\*\* ${prefix}suggestion\*\* - Have a suggestion for Lucky Bot? Use this command to have it heard!`);
	};

	//Help command for Notifications
	notifyHelp = function notifyHelp(message, prefix, embed) {
		embed.addField(":round_pushpin: Notifications", `\*\* ${prefix}notify\*\* - Shows this list of commands for notifications.
\*\* ${prefix}notify list\*\* - Direct messages a list of keywords for the server.
\*\* ${prefix}notify clear\*\* - Removes all keywords for the server.
\*\* ${prefix}notify add <keyword>\*\* - Adds a <keyword> to notify you about on the server.
\*\* ${prefix}notify remove <keyword>\*\* - Removes a <keyword> you were notified about on the server.
\*\* ${prefix}notify global list\*\* - Direct messages a list of global keywords.
\*\* ${prefix}notify global clear\*\* - Removes all global keywords you have.
\*\* ${prefix}notify global add <keyword>\*\* - Adds a <keyword> to notify you about on all servers.
\*\* ${prefix}notify global remove <keyword>\*\* - Removes a <keyword> you were notified about on all servers.
\*\* ${prefix}notify ignore channel <#channel>\*\* - Ignores all keyword triggers in <#channel>.
\*\* ${prefix}notify ignore server\*\* - Ignores all global keyword triggers in the server.`);
	};

	//Help command for Custom Commands
	commandsHelp = function commandsHelp(message, prefix, embed) {
		embed.addField(":speech_left: Custom Commands", `\*\* ${prefix}command\*\* - Shows this list of commands for custom commands.
\*\* ${prefix}command list\*\* - Direct messages a list of custom commands on the server.
\*\* ${prefix}command add <name> <command>\*\* - Adds a custom command to the server.
\*\* ${prefix}command remove <name> <command>\*\* - Removes a custom command on the server.
\*\* ${prefix}command edit <name> <command>\*\* - Edits a custom command on the server.
\*\* ${prefix}command search <name>\*\* - Search for custom commands on the server containing a given word.`);
	};

	//Help command for Lastfm Commands
	lastFMHelp = function lastFMHelp(message, prefix, embed) {
		embed.setTitle("LastFM Commands");
		embed.setColor("#ffff4d");
		embed.setFooter("If you have any other questions please contact Rave#0737");
		embed.addField(":musical_note: Lastfm Commands", `\*\* ${prefix}lastfm help\*\* - Shows this list of commands for lastfm commands.
\*\* ${prefix}lastfm\*\* - Shows basic account info.
\*\* ${prefix}lastfm set\*\* - Saves lastfm username.
\*\* ${prefix}lastfm nowplaying\*\* - Shows the song currently playing.
\*\* ${prefix}lastfm recent\*\* - Shows the songs recently listened to.
\*\* ${prefix}lastfm toptracks <week|month|3-month|half-year|year>\*\* - Shows the top tracks of <period>.
\*\* ${prefix}lastfm topartist <week|month|3-month|half-year|year>\*\* - Shows the top artists of <period>.
\*\* ${prefix}lastfm topalbums <week|month|3-month|half-year|year>\*\* - Shows the top albums of <period>.`);
	};

	//Mod Help Commands
	//Help for General Mod Commands
	modHelpGeneral = function modHelpGeneral(message, prefix, embed) {
		embed.addField(":exclamation: Basic Commands", `\*\* ${prefix}mod\*\* - Shows this list of commands for mod commands.
\*\* ${prefix}setprefix\*\* - Changes the prefix for Lucky Bot.
\*\* ${prefix}autorole\*\* - Sets a role to be added to a user when they join the server.
\*\* ${prefix}ban <user> [days] [reason]\*\* - Bans a <user> and removes the messages from [days] for [reason]. Days default is 0.     
\*\* ${prefix}kick <user> [reason]\*\* - Kicks a <user> for [reason].
\*\* ${prefix}prune <number of messages>\*\* - Deletes <number of messages> plus the command line.`);
	};

	//Help for Greeter Commands
	welcomeHelp = function welcomeHelp(message, prefix, embed) {
		embed.addField(":wave: Greeter Commands", `\*\* ${prefix}greeter\*\* - Shows this list of commands for greeter.
\*\* ${prefix}greeter channel <channel name>\*\* - Sets the channel the bot should greet new members in.
\*\* ${prefix}greeter message <message>\*\* - Sets the message the bot says when a new member joins. Use {server} for server name and {user} for the new user. Using {mention} makes the username a mention.`);
	};

	//Help for Starboard Commands
	starboardHelp = function starboardHelp(message, prefix, embed) {
		embed.addField(":star: Starboard Commands", `\*\* ${prefix}starboard\*\* - Shows this list of commands for starboard.
\*\* ${prefix}starboard channel <channel name>\*\* - Sets the channel where the bot should place starred messages.
\*\* ${prefix}starboard emoji\*\* - Prompts the user to react with the emoji the bot watches for to place messages on the board.
\*\* ${prefix}starboard number <number>\*\* - Sets the number of reactions required to place messages on the board.
\*\* ${prefix}toggle starboard\*\* - Toggles the starboard functionality.`);
	};

	//Help for Start Commands
	startHelp = function startHelp(message, prefix, embed) {
		embed.addField(":checkered_flag: Start Commands", `\*\* ${prefix}start\*\* - Shows this list of commands for start.
\*\* ${prefix}start help\*\* - Shows a detailed list of commands for start.
\*\* ${prefix}start roles <channel name>\*\* - Sets the channel for the role system.
\*\* ${prefix}start logs <channel name>\*\* - Sets the channel for message logs.  
\*\* ${prefix}start join <channel name>\*\* - Sets the channel for users joining and leaving. (Message cannot be changed on this)`);
	};

	//Help for Toggle Commands
	toggleHelp = function toggleHelp(message, prefix, embed) {
		embed.addField(":arrows_counterclockwise: Toggle Commands", `\*\* ${prefix}toggle\*\* - Shows this list of commands for toggles.
\*\* ${prefix}toggle image\*\* - Changes between embed disabled for images in message logs.
\*\* ${prefix}toggle logs\*\* - Turns message logs on and off.
\*\* ${prefix}toggle greeter\*\* - Turns greeter message on and off.
\*\* ${prefix}toggle roles\*\* - Turns roles channel on and off.
\*\* ${prefix}toggle starboard\*\* - Turns starboard channel on and off.`);
	};

	//Help for Server Commands
	ownerServerHelp = function ownerServerHelp(message, prefix, embed) {
		embed.addField(":speech_left: Sever Commands", `\*\* ${prefix}server\*\* - Shows this list of commands for server.
\*\* ${prefix}server list\*\* - Shows the servers Lucky Bot is in.
\*\* ${prefix}server leave\*\* - Allows Lucky Bot to leave a server it is in.
\*\* ${prefix}server settings <serverid>\*\* - Shows enabled settings on <server>. Defaults to current server if no id is provided.`);
	};

	//Help for Relay Commands
	relayHelp = function relayHelp(message, prefix, embed) {
		embed.addField(":arrows_counterclockwise: Relay", `\*\* ${prefix}relay\*\* - Shows this list of commands for relay.
\*\* ${prefix}relay list\*\* - Shows existing relays.
\*\* ${prefix}relay start <name> <type> <chanID1> <chanID2>\*\* - Starts a relay of <type> between at least two channels.
\*\* ${prefix}relay add <name> <chanID>\*\* - Adds a channel to an existing relay.
\*\* ${prefix}relay remove <name> <chanID>\*\* - Removes a channel from an existing relay.
\*\* ${prefix}relay delete <name>\*\* - Deletes an existing relay.`);
	};

	relayHelp2 = function relayHelp2(message, embed) {
		embed.addField(":arrows_counterclockwise: Relay", `Relays connect a two way chat system between two channels on a server or between two servers. Please contact Rave#0737 or OrigamiCoder#1375 to have one set up.`);
	};

	//Sends embed in channel if bot has permission otherwise dms
	sendEmbed = function sendEmbed(message, embed) {
		let permsOvr = message.channel.permissionsFor(bot.user);
		if (!permsOvr) {
			console.log(`No perms returned`);
			return;
		}
		if (!permsOvr.has("EMBED_LINKS")) {
			message.author.send(embed).catch((error) => {
				console.log(error);
			});
			return;
		} else {
			message.channel.send(embed);
			return;
		}
	};

	//Sends paginated embed to channel with listeners for page-turning emote reaction
	embedPages = function embedPages(message, embed, pages) {
		let currentPage = 0;

		embed.setDescription(pages[0])
			.setFooter(`Page 1 of ${pages.length}`);

		if (pages.length > 1) {
			message.channel.send(embed).then(function (msg) {
				//Promise is used to ensure emoji reacts are placed in correct order and
				//event listeners are not triggered by the bot's own reactions
				msg.react("⬅").then(() => msg.react("➡")).then(function () {
					//User has 60 seconds to turn pages before the listener expires, this could be tweaked if needed
					const pageBack = msg.createReactionCollector((reaction) => reaction.emoji.name === "⬅", { time: 600000 });
					const pageForward = msg.createReactionCollector((reaction) => reaction.emoji.name === "➡", { time: 600000 });

					pageBack.on('collect', react => {
						//Ensure the correct embed is being controlled, and the the bot is not triggering page turn
						if (react.message.id == msg.id && react.users.size > 1) {
							if (currentPage === 0) return;
							currentPage--;
							embed.setDescription(pages[currentPage])
								.setFooter(`Page ${currentPage + 1} of ${pages.length}`);
							msg.edit(embed);
						}
					});

					pageBack.on('end', collection => {
						msg.clearReactions();
					});

					pageForward.on('collect', react => {
						//Ensure the correct embed is being controlled, and the the bot is not triggering page turn
						if (react.message.id == msg.id && react.users.size > 1) {
							if (currentPage === pages.length - 1) return;
							currentPage++;
							embed.setDescription(pages[currentPage])
								.setFooter(`Page ${currentPage + 1} of ${pages.length}`);
							msg.edit(embed);
						}
					});

					pageForward.on('end', collection => {
						msg.clearReactions();
					});
				});
			});
		} else {
			//With only one page present, reaction listeners are not needed
			message.channel.send(embed);
		}
	};

	//Converts an array of list items to 25-item pages with an optionally-provided header
	toEmbedPages = function toEmbedPages(items, header) {
		//Array containing all pages
		var pages = [];

		//Number of items added to current page
		var pageLength = 0;

		var page = ``;
		if (header) page += `${header}\n`;

		for (var item in items) {
			page += `${items[item]}\n`;
			pageLength++;

			//Limit each page to 25 items
			if (pageLength == 25) {
				pages.push(page);
				page = ``;
				pageLength = 0;
			}
		}

		//Include final page if it has at least one item but didn't reach capacity
		if (page != ``) {
			pages.push(page);
		}

		return pages;
	};

};