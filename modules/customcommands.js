const Discord = require("discord.js");
const customcmds = require("./commandnames.json");
let commandnames = customcmds.commands;

module.exports = (bot = Discord.Client) => {

	require("./../functions/helpfunctions.js")(bot);

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
				let embed = new Discord.RichEmbed()
					.setTitle("Custom Command Help")
					.setColor("#40e0d0")
					.setFooter("If you have any other questions please contact Rave#0737");
				commandsHelp(message, prefix, embed);
				message.channel.send(embed);
				return;
			}

			let custom = null;
			let cmdName = "";
			let embed;
			let list = [];

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
					message.author.send(`\`\`\`List of custom commands for ${message.guild.name}:
${list.sort().join(`\n`)}\`\`\``);
					break;

				default:
					embed.setTitle("Custom Command Help")
						.setColor("#40e0d0")
						.setFooter("If you have any other questions please contact Rave#0737");
					commandsHelp(message, prefix, embed);
					message.channel.send(embed);
					return;
			}

		}
	};

};