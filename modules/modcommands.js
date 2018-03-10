const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("./../functions/modchanfunctions.js")(bot);
	require("./../functions/modcmdfunctions.js")(bot);
	//require("./../functions/modlogfunctions.js")(bot);
	require("./../functions/modtogfunctions.js")(bot);
	require("./../functions/ownercmdfunctions.js")(bot);
	require("./relays.js")(bot);
	require("./whitelist.js")(bot);

	//Admin and Mod Settings

	modCmds = async function modCmds(message) {
		if (message.author.bot) return;
		if (message.channel.type === "dm") return;

		let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];
		let allowed = false;

		for (i = 0; i < perms.length; i++) {
			if (message.member.hasPermission(perms[i])) allowed = true;
		}
		if (!allowed) return;

		let serverSettings = bot.getServerSettings(message.guild.id);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		const prefix = serverSettings.prefix;

		if (!command.startsWith(prefix)) return;

		//Prefix

		if ((command === `${prefix}setprefix`)) {
			console.log("Crash at setprefix");
			setPrefix(message, command, args, serverSettings);
		}

		//Starting logs, roles, join, and music

		if ((command === `${prefix}start`)) {
			console.log("Crash at start");
			if (args.length === 0) {
				let embed = new Discord.RichEmbed()
					.setColor("#2ecc71")
					.setTitle("Start Help")
					.setFooter("If you have any other questions please contact Rave#0737");
				startHelp(message, prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				//Message logging

				case "logs":
				case "messagelogs":
					console.log("Crash at logs");
					logChan(message);
					break;

				//Roles

				case "roles":
					console.log("Crash at roles");
					rolesChan(message, serverSettings, command);
					break;

				//Join

				case "join":
					console.log("Crash at join");
					joinChan(message, serverSettings, command);
					break;

				default:
					embed = new Discord.RichEmbed()
						.setColor("#2ecc71")
						.setTitle("Start Help")
						.setFooter("If you have any other questions please contact Rave#0737");
					startHelp(message, prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}

		//Toggles

		if ((command === `${prefix}toggle`)) {
			console.log("Crash at toggle");
			if (args.length === 0) {
				let embed = new Discord.RichEmbed()
					.setColor("#3498db")
					.setTitle("Toggle Help")
					.setFooter("If you have any other questions please contact Rave#0737");
				toggleHelp(message, prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				//Toggle Image Embed
				case "image":
					console.log("Crash at image");
					imgTog(message, serverSettings);
					return;

				//Toggle Logs
				case "logs":
					console.log("Crash at toggle logs");
					logsTog(message, serverSettings);
					return;

				//Toggle Greeter     
				case "greeter":
					console.log("Crash at toggle greeter");
					welTog(message, serverSettings);
					return;

				//Toggle Roles  
				case "roles":
					console.log("Crash at toggle roles");
					rolesTog(message, serverSettings);
					return;

				default:
					embed = new Discord.RichEmbed()
						.setColor("#3498db")
						.setTitle("Toggle Help")
						.setFooter("If you have any other questions please contact Rave#0737");
					toggleHelp(message, prefix, embed);
					sendEmbed(message, embed);
					return;
			}
		}

		//Greeter setup

		if ((command === `${prefix}greeter`)) {
			console.log("Crash at greeter");
			if (args.length === 0) {
				let embed = new Discord.RichEmbed()
					.setColor("#ff8533")
					.setTitle("Greeter Help")
					.setFooter("If you have any other questions please contact Rave#0737");
				welcomeHelp(message, prefix, embed);
				sendEmbed(message, embed);
				return;
			}

			let embed;
			switch (args[0].toLowerCase()) {

				case "help":
					console.log("Crash at greeter help");
					message.channel.send("<:monkaS:372547459840475146> h-help");
					break;

				case "chan":
				case "channel":
					console.log("Crash at greeter chan");
					welChan(message, serverSettings, command);
					break;

				case "msg":
				case "message":
					console.log("Crash at greeter chan");
					welMsg(message, command, args, serverSettings);
					break;

				default:
					embed = new Discord.RichEmbed()
						.setColor("#ff8533")
						.setTitle("Greeter Help")
						.setFooter("If you have any other questions please contact Rave#0737");
					welcomeHelp(message, prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}

		//Ban Command

		if ((command === `${prefix}ban`)) {
			console.log("Crash at ban");
			banUser(message, command, args, perms);
		}

		//Kick command

		if ((command === `${prefix}kick`)) {
			console.log("Crash at kick");
			kickUser(message, command, args, perms);
		}

		//Mute Command

		if ((command === `${prefix}mute`)) {
			console.log("Crash at mute");
			muteUser(message, command, args, perms);
		}

		//Prune Command

		if ((command === `${prefix}prune`)) {
			console.log("Crash at prune");
			pruneMessage(message, args);
		}

		//Mod help

		if (command === `${prefix}mod`) {
			console.log("Crash at mod");
			let embed = new Discord.RichEmbed()
				.setTitle("Mod Commands")
				.setColor("#990000")
				.setFooter("If you have any other questions please contact Rave#0737");
			modHelpGeneral(message, prefix, embed);
			welcomeHelp(message, prefix, embed);
			startHelp(message, prefix, embed);
			toggleHelp(message, prefix, embed);
			relayHelp2(message, embed);
			sendEmbed(message, embed);
		}

		if (command === `${prefix}say`) {
			sayFunction(message, command, args);
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
				let embed = new Discord.RichEmbed()
					.setColor("#a893f9")
					.setTitle("Server Help");
				ownerServerHelp(message, prefix, embed);
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
					embed = new Discord.RichEmbed()
						.setColor("#a893f9")
						.setTitle("Server Help");
					ownerServerHelp(message, prefix, embed);
					sendEmbed(message, embed);
					break;
			}
			return;
		}

		if ((command === `${prefix}relay`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed()
					.setColor("#A021ED")
					.setTitle("Relay Help");
				relayHelp(message, prefix, embed);
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
					embed = new Discord.RichEmbed()
						.setColor("#A021ED")
						.setTitle("Relay Help");
					relayHelp(message, prefix, embed);
					sendEmbed(message, embed);
					break;
			}
		}
	};
};
