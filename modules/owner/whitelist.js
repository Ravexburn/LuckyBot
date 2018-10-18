const serverid = require("../serverlist.json");
const Discord = require("discord.js");
let servers = serverid.servers;
const fs = require("fs");
const path = "./modules/serverlist.json";

module.exports = (bot = Discord.Client) => {

	whitelist = function whitelist(guild) {

		fs.readFile(path, (err, data) => {
			if (err) {
				console.log(err);
			}
			else {
				let whitelist = JSON.parse(data);
				if (whitelist.servers.hasOwnProperty(guild.id)) {
					const chan = serverLogging();
					if (!chan) {
						return;
					}

					let embed = new Discord.RichEmbed()
						.setAuthor(bot.user.tag, bot.user.displayAvatarURL)
						.setColor("#1ccc8b")
						.addField("Whitelisted", ":white_check_mark:");
					whitelistEmbed(guild, embed);
					chan.send(embed);
					return;
				}

				else {
					guild.owner.send(`Your server \`${guild.name}\` is not currently whitelisted. Please join here and post in #add-your-server to have ${bot.user.username} be whitelisted. **If ${bot.user.username} is on your server, you may ignore this message as it is already whitelisted!** https://discord.gg/z4thPtW`);
					guild.leave();

					const chan = serverLogging();
					if (!chan) {
						return;
					}

					let embed = new Discord.RichEmbed()
						.setAuthor(bot.user.tag, bot.user.displayAvatarURL)
						.setColor("#ce1827")
						.addField("Whitelisted", ":x:");
					whitelistEmbed(guild, embed);
					chan.send(embed);
					return;
				}
			}
		});
	};

	guildLeave = function guildLeave(guild) {
		const chan = serverLogging();
		if (!chan) {
			return;
		}

		let embed = new Discord.RichEmbed()
			.setAuthor(bot.user.tag, bot.user.displayAvatarURL)
			.setColor("#ce1827");
		whitelistEmbed(guild, embed);
		chan.send(embed);
		return;

	};
	function serverLogging() {
		let serverGuild = "418479049724395520";
		let serverChan = "418549836229378049";
		const guild = bot.guilds.get(serverGuild);
		if (!guild) return null;
		const chan = guild.channels.get(serverChan);
		if (!chan) return null;

		return chan;
	}

	writingWL = function writingWL(message, args) {
		if (args.length === 0) {
			message.channel.send("Missing arguments.");
			return;
		}

		// Add by invite. (example: https://discord.gg/qJq5C)
		const inviteRegExp = new RegExp("(https:\/\/discord\.gg\/)?([-\\w]+)");
		const matches = args[0].match(inviteRegExp);
		if (matches) {
			const inv = matches[0];
			let guild = null;
			return bot.fetchInvite(inv)
				.then(invite => {
					guild = invite.guild;
					return guild;
				}).then(guild => {
					if (!guild) {
						return Promise.reject("Error: No guild.");
					}
					return whitelistAdd(guild.id, guild.name);
				}).then((success) => {
					let msg = "";
					if (success) {
						msg = `Added server to whitelist. \`${guild.id} ${guild.name}\``;
					} else {
						msg = `Unable to add server to whitelist. \`${guild.id} ${guild.name}\``;
					}
					console.log(msg);
					message.channel.send(msg);
				}).catch((err) => {
					console.log(err);
				});
		}

		if (args.length < 2) {
			message.channel.send("Add id and server name");
			return;
		}
		let id = args[0];
		let name = args.slice(1).join(" ");
		if (whitelistAdd(id, name)) {
			message.channel.send(`Added server to whitelist. \`${id} ${name}\``);
			console.log(`Added server to whitelist. \`${id} ${name}\``);
		}
	};

};


/**
 * Adds a guild to whitelist by guild id and name.
 * @param {string} id - The id of the guild being whitelisted.
 * @param {string} name - The name of the guild being whitelisted.
 */
function whitelistAdd(id, name) {
	return new Promise(function (resolve, reject) {
		fs.readFile(path, (err, data) => {
			if (err) {
				console.log(err);
				reject(false);
			}
			else {
				let whitelist = JSON.parse(data);
				whitelist.servers[id] = name;
				let json = JSON.stringify(whitelist);
				fs.writeFile(path, json, "utf8", (err) => {
					if (err) {
						console.log(err);
						reject(false);
					}
					else {
						resolve(true);
					}
				});
			}
		});
	}).then((success) => {
		return success;
	}).catch((err) => {
		console.log(err);
		return false;
	});
}

whitelistEmbed = function whitelistEmbed(guild, embed) {
	embed.addField("Owner", `**${guild.owner.user.tag}**`, true);
	embed.addField("Server", `**${guild.name}** - \`(#${guild.id})\``, true);
	embed.addField("Members", guild.memberCount, true);
	embed.setThumbnail(guild.iconURL);
	embed.setURL(guild.iconURL);
};