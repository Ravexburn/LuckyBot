const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
const GuildMember = Discord.GuildMember;
const Role = Discord.Role;


module.exports = (bot = Discord.Client) => {

    bot.on("message", async message => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        let prefix = serverSettings.prefix;
        let valid_channel = false;
        let activeChannel;

        if (message.channel.id === serverSettings.roleChannelID) {
            valid_channel = true;
        }

        if (message.guild.channels.has(serverSettings.roleChannelID)) {
            activeChannel = message.guild.channels.get(serverSettings.roleChannelID);
        }

        if (!activeChannel) return;

        let msgAry = message.content.trim().split(" ");

        switch (msgAry[0].charAt(0)) {
            case "+":
            case "-":
                break;
            default:
                return;
        }

        let length = msgAry.length;
        let command = "";
        let rolename = "";
        for (let i = 0; i < length; i++) {
            let arg = msgAry[i];
            switch (arg.charAt(0)) {
                case "+":
                case "-":

                    command = arg.charAt(0);
                    arg = arg.slice(1);

                default:
                    if (rolename !== "") {
                        rolename += " ";
                    }
                    rolename += arg;
                    break;
            }

            if ((i + 1) < length) {

                if ((msgAry[i + 1].charAt(0) !== "+") && (msgAry[i + 1].charAt(0) !== "-")) {
                    continue;
                }

            }

            if (command !== "") {
                switch (command) {
                    case "+":
                        addRole(message.member, rolename, message);
                        break;
                    case "-":
                        removeRole(message.member, rolename, message);
                        break;
                    default:
                        break;
                }
            }

            command = "";
            rolename = "";
        }

    });

}

function addRole(member, rolename, message) {

    if (!member) return false;
    if (!rolename) return false;

    if (member.guild.roles.exists("name", rolename)) {
        let role = member.guild.roles.find("name", rolename);

        if (canAddRole(member, role)) {
            member.addRole(role).catch(console.error);
            message.reply("Role has been added.")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return true;
        }
        else {
            message.reply("You do not have the required permissions to add that role.")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return false;
        }

        if (member.roles.has(role.id)) {
            //Member has role
            message.reply("You already have this role.")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return false;
        }

    }
    return false;
}

function removeRole(member, rolename, message) {

    if (!member) return false;
    if (!rolename) return false;

    if (member.guild.roles.exists("name", rolename)) {
        let role = member.guild.roles.find("name", rolename);
        if (member.roles.has(role.id)) {
            //Member has role
            return member.removeRole(role).then(() => {
                message.reply("Role has been removed.")
                    .then(message => message.delete(10 * 1000));
                message.delete(10 * 1000);
                return true;
            }).catch(() => {
                message.reply("Failed to remove role.").then(message => message.delete(10 * 1000));
                message.delete(10 * 1000);
            });

        }
        else {
            message.reply("You do not have that role.")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return false;
        }
    }
}

/**
 * Checks if role can be added to user.
 * @param {GuildMember} member 
 * @param {Role} role 
 * @returns {boolean}
 */
function canAddRole(member, role) {
    let perms = ["ADMINISTRATOR", "MANAGE_GUILD", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "VIEW_AUDIT_LOG", "MENTION_EVERYONE", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
    if (role.hasPermission(perms)) {
        return false;
    }
    return true;
}