const Discord = require("discord.js");
const website = "https://luckybot.io/";

module.exports = (bot = Discord.Client) => {

	require("../../functions/modchanfunctions.js")(bot);
	require("../../functions/modcmdfunctions.js")(bot);
	require("../../functions/modtogfunctions.js")(bot);
	require("../../functions/ownercmdfunctions.js")(bot);
	require("../modding/adblock.js")(bot);
	require("../modding/ban.js")(bot);
	require("../modding/kick.js")(bot);
	require("../modding/mute.js")(bot);
	require("../modding/prune.js")(bot);
	require("../modding/starboard.js")(bot);
	require("../modding/unban.js")(bot);
	require("../owner/relays.js")(bot);
	require("../modding/say.js")(bot);
	require("../modding/setprefix.js")(bot);
	require("../owner/whitelist.js")(bot);

	//Admin and Mod Settings

	modCmds = async function modCmds(message) {
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;

		let serverSettings = bot.getServerSettings(message.guild.id);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		const prefix = serverSettings.prefix;

		if (!command.startsWith(prefix)) return;

		let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];


		if (!message.member) {
			dmOwner(`mod command line 21 is null: guild: ${message.guild.name} author: ${message.author} content: ${message.content}`);
			console.log("modcmd line 21 is null", `guild: ${message.guild.name}`, `author: ${message.author}`, `content: ${message.content}`);
			return;
		}

		let hasPerms = perms.some(i => message.member.hasPermission(i));

		if (!hasPerms) return;

		//Prefix

		if ((command === `${prefix}setprefix`)) {
			setPrefix(message, command, args, serverSettings);
		}

		//Starting logs, roles, join, and music

		if ((command === `${prefix}start`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				startHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "logs":
				case "messagelogs":
					logChan(message);
					break;

				case "roles":
					rolesChan(message, serverSettings, command);
					break;

				case "join":
					joinChan(message, serverSettings, command);
					break;

				default:
					embed = new Discord.RichEmbed();
					startHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}

		//Toggles

		if ((command === `${prefix}toggle`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				toggleHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "image":
					imgTog(message, serverSettings);
					return;

				case "logs":
					logsTog(message, serverSettings);
					return;

				case "greeter":
					welTog(message, serverSettings);
					return;

				case "roles":
					rolesTog(message, serverSettings);
					return;

				case "adblock":
				case "adb":
				case "adblocker":
				case "links":
					adBlockTog(message, serverSettings);
					return;

				case "starboard":
					starboardTog(message, serverSettings);
					return;

				default:
					embed = new Discord.RichEmbed();
					toggleHelp(prefix, embed);
					sendEmbed(message, embed);
					return;
			}
		}

		//Greeter setup

		if ((command === `${prefix}greeter`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				welcomeHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "chan":
				case "channel":
					welChan(message, serverSettings, command);
					break;

				case "msg":
				case "message":
					welMsg(message, command, args, serverSettings);
					break;

				case "image":
				case "img":
					welImage(message, serverSettings, args);
					break;

				default:
					embed = new Discord.RichEmbed();
					welcomeHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}

		//Starboard setup

		if ((command === `${prefix}starboard`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				starboardHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "chan":
				case "channel":
					starboardChan(message, serverSettings, command);
					break;

				case "emoji":
					setStarboardEmoji(message, serverSettings, args[1]);
					break;

				case "number":
					setStarboardNumber(message, args, serverSettings);
					break;

				default:
					embed = new Discord.RichEmbed();
					starboardHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}

		//Mute Command

		if ((command === `${prefix}mute`)) {
			muteUser(message, command, args, perms);
		}

		//Mod help

		if (command === `${prefix}mod`) {
			message.reply(`Help can be found here: ${website}`);
		}

		//Say Command

		if (command === `${prefix}say`) {
			sayFunction(message, command, args);
		}

	};

	bkpCmd = async function bkpCmd(message) {
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;

		let serverSettings = bot.getServerSettings(message.guild.id);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		const prefix = serverSettings.prefix;

		if (!command.startsWith(prefix)) return;

		//Ban Command

		if ((command === `${prefix}ban`)) {
			banUser(message, command, args);
		}

		//Unban Command

		if ((command === `${prefix}unban`)) {
			unbanUser(message, command, args);
		}

		//Kick command

		if ((command === `${prefix}kick`)) {
			kickUser(message, command, args);
		}

		//Prune Command

		if ((command === `${prefix}prune`)) {
			pruneMessage(message, args);
		}

	};


	//Intial Settings (Owner Only)

	owner = async function owner(message) {
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;
		if (![bot.botSettings.Owner_id, bot.botSettings.Owner_id2].includes(message.author.id)) return;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		let prefix = bot.botSettings.prefix;
		if (!command.startsWith(prefix)) return;

		//Default Settings

		if ((command === `${prefix}intset`)) {
			bot.initServerSettings(message.guild.id);
			message.channel.send("**Server settings have been reset**")
				.then(message => message.delete(10 * 1000));
			message.delete(10 * 1000);
			return;
		}

		//Whitelist add

		if ((command === `${prefix}whitelist`)) {
			writingWL(message, args);
		}

		//Servers' info
		//Server <help|list|leave>

		if ((command === `${prefix}server`) || (command === `${prefix}getmeout`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				ownerServerHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "list":
					serverList(message);
					break;

				case "leave":
					serverLeave(message, args);
					break;

				case "settings":
					serverModSettings(message, args);
					break;

				default:
					embed = new Discord.RichEmbed();
					ownerServerHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
			return;
		}

		if ((command === `${prefix}relay`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				relayHelp(prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let relay = "";
			let channels = [];
			let type = "";
			let format = "";
			let embed;
			let msg = "";
			let channel = args[2];
			switch (args[0].toLowerCase()) {
				//TODO add functions with help commands for relay in mod commands
				case "list":
					//Lists the existing relays. Shows relay type and name of servers and name of channels(?)
					relays.getRelaysCollection()
						.then((collection) => {
							for (let relay of collection) {
								const str = `\`${relay[0]}: ${relay[1].join(", ")}\``;
								if (msg.length !== 0) {
									msg += "\n";
								}
								msg += str;
							}
							message.channel.send(msg);
						}).catch((reason) => {
							console.log(reason);
						});

					break;

				case "start":
					//Where a new relay starts. Requires relay name, type, and at least two channel and server ids.
					// *relay start <relay> <type> <channel> <channel> [channel...]
					if (args.length < 5) {
						message.channel.send(`Please provide relay name, type of relay, and two or more channels.`);
						return;
					}
					relay = args[1].toLowerCase();
					type = args[2].toLowerCase();
					channels = args.slice(3);
					relays.addRelay(relay, channels, type)
						.then(message.channel.send(`Relay created with name: \`${relay}\` with the type: \`${type}\``))
						.catch((reason) => { console.log(reason); });
					break;

				case "add":
					//Adds a channel to an existing relay. Requires relay name, channel and server id.
					// *relay add <relay> <channel> [channel...]
					if (args.length < 3) {
						message.channel.send(`Please provide the relay name and the channel id which you would like to add.`);
						return;
					}
					relay = args[1].toLowerCase();
					channels = args.slice(2);
					relays.addChannel(relay, channels)
						.then(message.channel.send(`Channel added to: \`${relay}\`. Added channel(s): \`${channels}\``))
						.catch((reason) => { console.log(reason); });
					break;

				case "remove":
					//Removes a channel to an existing relay. Requires relay name, channel and server id.
					// *relay remove <relay> <channel>
					if (args.length < 3) {
						message.channel.send(`Please provide the relay name and the channel id which you would like to remove.`);
						return;
					}
					relay = args[1].toLowerCase();
					relays.removeChannel(channel)
						.then(message.channel.send(`Channel removed from: \`${relay}\`. Removed channel(s): \`${channels}\``))
						.catch((reason) => { console.log(reason); });
					break;

				case "delete":
					//Deletes an existing relay. Requires relay name.
					// *relay delete <relay>
					if (args.length < 2) {
						message.channel.send(`Please provide the relay name you would like to delete.`);
						return;
					}
					relay = args[1].toLowerCase();
					relays.removeRelay(relay)
						.then(message.channel.send(`Deleted: \`${relay}\`.`))
						.catch((reason) => { console.log(reason); });
					break;

				case "type":
					// *relay type <relay> <type>
					if (args.length < 2) {
						message.channel.send(`Please provide the relay name and type of relay.`);
						return;
					}
					relay = args[1].toLowerCase();
					if (args.length === 2) {
						return relays.getRelayType(relay)
							.then((type) => {
								message.reply(`Relay type: \`${type}\``);
							}).catch((reason) => { console.log(reason); });
					}
					type = args[2].toLowerCase();
					relays.setRelayType(relay, type)
						.catch((reason) => { console.log(reason); });
					break;

				case "format":
					// *relay format <relay> <format>
					if (args.length < 2) {
						message.channel.send(`Please provide the relay name and format of relay.`);
						return;
					}
					relay = args[1].toLowerCase();
					if (args.length === 2) {
						return relays.getRelayFormat(relay)
							.then((format) => {
								message.reply(`Relay format: \`${format}\``);
							}).catch((reason) => { console.log(reason); });
					}
					format = args[2].toLowerCase();
					relays.setRelayFormat(relay, format)
						.catch((reason) => { console.log(reason); });
					break;

				default:
					//Relay command help
					embed = new Discord.RichEmbed();
					relayHelp(prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}
	};

	getOwner = async function getOwner() {
		let ownerID = bot.botSettings.Owner_id;
		let owner = await bot.fetchUser(ownerID);
		return owner;
	};

	dmOwner = async function dmOwner(message) {
		let owner = await getOwner();
		if (!owner) {
			console.log("Couldn't find owner");
			return;
		}
		owner.send(message);
	};

};