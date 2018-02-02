const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    require("./../functions/helpfunctions.js")(bot);

    const Enmap = require("enmap");
    cmds = new Enmap({ name: 'Commands', persistent: true });

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

        if (command === `${prefix}command`) {
            if (args.legnth === 0) {
                commandsHelp(message, prefix);
                return;
            }

            let custom = null;
            let cmdName = "";

            switch (args[0]) {

                case "add":
                    if (args.legnth < 3) {
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

                    if (custom[cmdName]) {
                        message.channel.send("**That command already exists. Please use \`edit\` to edit the command.**");
                        return;
                    }

                    if (custom.hasOwnProperty(cmdName)) {
                        return;
                    }

                    custom[cmdName] = args.slice(2).join(" ");
                    cmds.set(guild.id, custom);
                    message.channel.send("**Custom command added.**");
                    break;

                case "edit":

                    if (args.legnth < 3) {
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

                    if (args.legnth < 2) {
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
                    console.log(custom);
                    let list = [];
                    for (var key in custom) {
                        if (custom.hasOwnProperty(key)) {
                            list.push(`${prefix}${key}`);
                        }
                    }
                    console.log(list);
                    if (list.legnth === 0) {
                        message.channel.send("**There are no custom commands on this server.**");
                        return;
                    }

                    message.channel.send("**List of commands sent to direct messages.**");
                    message.author.send(`\`\`\`List of custom commands for ${message.guild.name}:
${list.join(`\n`)}\`\`\``);


                    break;

                default:
                    commandsHelp(message, prefix);
                    return;
            }




        }
    };

}