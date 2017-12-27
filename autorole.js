const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
const db = require('quick.db');

module.exports = (bot = Discord.Client) => {

    bot.on("message", async message => {

        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        let serverSettings = bot.getServerSettings(message.guild.id);

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        const prefix = serverSettings.prefix;

        if (!command.startsWith(prefix)) return;

        //Autorole

        if (command === `${prefix}autorole`) {

            let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "VIEW_AUDIT_LOG"];

            if (!(message.guild.member(message.author).hasPermission(perms))) return;

            if (!args.length === 0) {
                message.channel.send(`To use auto-role please do ${command} <roleName>`);
                return;
            }
            db.updateText(`autoRole_${message.guild.id}`, args.join(" ").trim()).then(i => {
                message.channel.send(`Auto-role set to ${i.text}`);
            })
        }
    });

    bot.on('guildMemberAdd', guildMember => {

        db.fetchObject(`autoRole_${guildMember.guild.id}`).then(i => {

            if (!i.text || i.text.toLowerCase() === "none") return;

            else {
                try {
                    guildMember.addRole(guildMember.guild.roles.find("name", i.text));
                } catch (e) {
                    console.log("error");
                }

            }
        })
    })
}