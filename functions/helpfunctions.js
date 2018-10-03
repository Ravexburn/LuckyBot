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
		embed.setColor("#33cc33");
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
		embed.addField(`${prefix}toggle starboard`, "Toggles the starboard functionality.");
		embed.setFooter("If you have any other questions please contact Rave#0737");
	};

	//Help for Server Commands
	ownerServerHelp = function ownerServerHelp(prefix, embed) {
		embed.setTitle(":robot: Server Commands");
		embed.setColor("#a893f9");
		embed.addField(`${prefix}server`, "Shows this list of commands for server.");
		embed.addField(`${prefix}server list`, "Shows the servers Lucky Bot is in.");
		embed.addField(`${prefix}server leave`, "Lucky Bot leaves a server it is in.");
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
					const pageBack = msg.createReactionCollector((reaction) => reaction.emoji.name === "⬅", {
						time: 600000
					});
					const pageForward = msg.createReactionCollector((reaction) => reaction.emoji.name === "➡", {
						time: 600000
					});

					pageBack.on('collect', react => {
						//Ensure the correct embed is being controlled, and the the bot is not triggering page turn
						if (react.message.id == msg.id && react.users.size > 1) {
							if (currentPage === 0) return;
							currentPage--;
							embed.setDescription(pages[currentPage])
								.setFooter(`Page ${currentPage + 1} of ${pages.length}`);
							msg.edit(embed);
							Array.from(react.users.values()).forEach(user => {
								if (!user.bot) {
									react.remove(user);
								}
							});
						}
					});

					pageBack.on('end', () => {
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
							Array.from(react.users.values()).forEach(user => {
								if (!user.bot) {
									react.remove(user);
								}
							});
						}
					});

					pageForward.on('end', () => {
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
	toEmbedPages = function toEmbedPages(items, header, pageSize = 25) {
		//Array containing all pages
		var pages = [];

		//Number of items added to current page
		var pageItemCount = 0;

		var page = ``;
		if (header) page += `${header}\n`;

		for (var item in items) {
			page += `${items[item]}\n`;
			pageItemCount++;

			//Limit each page to 25 items
			if (pageItemCount === pageSize) {
				pages.push(page);
				page = ``;
				pageItemCount = 0;
			}
		}

		//Include final page if it has at least one item but didn't reach capacity
		if (page != ``) {
			pages.push(page);
		}

		return pages;
	};

};