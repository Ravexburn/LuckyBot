const Discord = require("discord.js");
const customcmds = require("./commandnames.json");
let commandnames = customcmds.commands;
const MAX_CHAR = 2000;

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);

	const Enmap = require("enmap");
	const EnmapLevel = require("enmap-level");
	const commandProvider = new EnmapLevel({ name: 'Commands' });
	cmds = new Enmap({ provider: commandProvider });

	customCommands = async function customCommands(message) {
		if (message.system) return;
		if (message.author.bot) return;
		if (message.channel.type === 'dm') return;

		let serverSettings = bot.getServerSettings(message.guild.id);

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);
		const prefix = serverSettings.prefix;

		if (!command.startsWith(prefix)) return;

		const guild = message.guild;

		if ((command === `${prefix}command`) || (command === `${prefix}commands`)) {
			if (args.length === 0) {
				let embed = new Discord.RichEmbed();
				commandsHelp(prefix, embed);
				message.channel.send(embed);
				return;
			}

			let custom = null;
			let cmdName = "";
			let embed;
			let list = [];
			let sendCmd;

			switch (args[0]) {

				case "add":
					if (args.length < 3) {
						message.channel.send("**Please add a command name and the command.**");
						return;
					}

					if (cmds.has(guild.id)) {
						custom = cmds.get(guild.id);
					}

					if (!custom) {
						custom = {};
					}

					cmdName = args[1].toLowerCase();

					if (!/^[\x00-\x7F]+$/.test(cmdName)) {
						message.channel.send("**Command name has invalid characters try another name.**");
						return;
					}

					if (commandnames.includes(cmdName)) {
						message.channel.send("**That is a standard command try another name.**");
						return;
					}

					if (custom[cmdName]) {
						message.channel.send("**That command already exists. Please use `edit` to edit the command.**");
						return;
					}

					custom[cmdName] = args.slice(2).join(" ");
					cmds.set(guild.id, custom);
					message.channel.send("**Custom command added.**");
					break;

				case "edit":
					if (args.length < 3) {
						message.channel.send("**Please add a command name and the command.**");
						return;
					}

					custom = cmds.get(guild.id);

					if (!custom) {
						message.channel.send("**There are no custom commands on the server.**");
						return;
					}

					cmdName = args[1].toLowerCase();

					if (!custom[cmdName]) {
						message.channel.send("**That command does not exist.**");
						return;
					}

					if (!custom.hasOwnProperty(cmdName)) {
						return;
					}

					custom[cmdName] = args.slice(2).join(" ");
					cmds.set(guild.id, custom);
					message.channel.send("**Custom command edited.**");
					break;

				case "delete":
				case "remove":
					if (args.length < 2) {
						message.channel.send("**Please add a command name to remove.**");
						return;
					}

					custom = cmds.get(guild.id);

					if (!custom) {
						message.channel.send("**There are no custom commands on the server.**");
						return;
					}

					cmdName = args[1].toLowerCase();

					if (!custom[cmdName]) {
						message.channel.send("**That command does not exist.**");
						return;
					}

					if (!custom.hasOwnProperty(cmdName)) {
						return;
					}

					delete custom[cmdName];
					cmds.set(guild.id, custom);
					message.channel.send("**Custom command removed.**");
					break;

				case "list":
					if (cmds.has(guild.id)) {
						custom = cmds.get(guild.id);
					}

					if (!custom) {
						message.channel.send("**There are no custom commands on this server.**");
						return;
					}

					for (var key in custom) {
						if (custom.hasOwnProperty(key)) {
							list.push(`${prefix}${key}`);
						}
					}

					if (list.length === 0) {
						message.channel.send("**There are no custom commands on this server.**");
						return;
					}

					message.channel.send("**List of commands sent to direct messages.**");

					sendCmd = `List of custom commands for ${message.guild.name}:
${list.sort().join(`\n`)}`;

					while (sendCmd.length > MAX_CHAR - 6) {
						message.author.send("```" + sendCmd.substring(0, MAX_CHAR - 6) + "```");
						sendCmd = sendCmd.slice(MAX_CHAR - 6);
					}
					message.author.send("```" + sendCmd + "```");
					break;

				case "search":
					if (args.length < 2) {
						message.channel.send("**Please enter a search term.**");
						return;
					}

					custom = cmds.get(guild.id);

					if (!custom) {
						message.channel.send("**There are no custom commands on the server.**");
						return;
					}

					searchTerm = args[1].toLowerCase();

					for (var key in custom) {
						if (key.includes(searchTerm)) {
							list.push(`${prefix}${key}`);
						}
					}

					if (list.length === 0) {
						message.channel.send("**No commands were found containing the given search term.**");
						return;
					}

					// Convert list of commands to embed pages and send to requested channel
					var singularPlural = list.length > 1 ? `commands` : `command`;
					var pageHeader = `**Found ${list.length} ${singularPlural} matching "${searchTerm}" in ${message.guild.name}:**`;
					var pages = toEmbedPages(list.sort(), pageHeader);

					embed = new Discord.RichEmbed()
						.setTitle("Command Search Results")
						.setColor("#40e0d0");
					embedPages(message, embed, pages);
					break;

				default:
					embed = new Discord.RichEmbed();
					commandsHelp(prefix, embed);
					message.channel.send(embed);
					return;
			}
		}
	};

};