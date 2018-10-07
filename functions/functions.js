const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Timestamp console 

	bot.log = function log(obj) {
		const timeString = `[${(new Date()).toLocaleTimeString()}]`;
		console.log(timeString, obj);
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