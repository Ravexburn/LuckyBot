const serverid = require("./serverlist.json");
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
						.setDescription(`:exclamation: Lucky Bot has joined: **${guild.name}** \`(#${guild.id})\`. Owner: **${guild.owner.user.tag}**\n
:white_check_mark: This server is on the whitelist.`);
					chan.send(embed);
					return;
				}

				else {
					guild.owner.send("Your server is not currently whitelisted. Please join here to have Lucky Bot be added to your server. https://discord.gg/z4thPtW");
					guild.leave();

					const chan = serverLogging();
					if (!chan) {
						return;
					}

					let embed = new Discord.RichEmbed()
						.setAuthor(bot.user.tag, bot.user.displayAvatarURL)
						.setColor("#ce1827")
						.setDescription(`:exclamation: Lucky Bot has joined: **${guild.name}** \`(#${guild.id})\`. Owner: **${guild.owner.user.tag}**\n
:x: This server is not on the whitelist.`);
					chan.send(embed);
					return;
				}
			}
		});
	};

	serverLeave = function serverLeave(guild) {
		const chan = serverLogging();
		if (!chan) {
			return;
		}

		let embed = new Discord.RichEmbed()
			.setAuthor(bot.user.tag, bot.user.displayAvatarURL)
			.setColor("#ce1827")
			.setDescription(`:exclamation: Lucky Bot has left: **${guild.name}** \`(#${guild.id})\`. Owner: **${guild.owner.user.tag}**`);
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
		if (args.length < 2) {
			message.channel.send("Add id and server name");
			return;
		}
		let id = args[0];
		let name = args.slice(1).join(" ");
		fs.readFile(path, (err, data) => {
			if (err) {
				console.log(err);
			}
			else {
				let whitelist = JSON.parse(data);
				whitelist.servers[id] = name;
				let json = JSON.stringify(whitelist);
				fs.writeFile(path, json, "utf8", (err) => {
					if (err) {
						console.log(err);
					}
					else {
						message.channel.send(`Added server to whitelist. \`${id} ${name}\``);
					}
				});
			}
		});

	};

};
