const Discord = require("discord.js");
const db = require('quick.db');

module.exports = (bot = Discord.Client) => {

    autoRoleMsg = async function autoRoleMsg(message) {

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
            console.log("Crash at autorole");
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
    };

    autoRoleAdd = function autoRoleAdd(member) {

        db.fetchObject(`autoRole_${member.guild.id}`).then(i => {

            if (!i.text || i.text.toLowerCase() === "none") return;

            else {
                    member.addRole(member.guild.roles.find("name", i.text))
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
    };
}