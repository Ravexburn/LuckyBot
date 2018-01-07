const Discord = require("discord.js");
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    /**
        * Setting prefix
        * @param {Message} message 
        */
    setPrefix = function setPrefix(message, command, args, serverSettings) {
        if (args.length === 0) {
            message.channel.send(message.author + "To set prefix please use " + command + " <prefix>")
                .then(message => message.delete(10 * 1000));
            message.delete(10 * 1000);
            return;
        }
        const newPrefix = args[0];
        serverSettings.prefix = newPrefix;
        bot.setServerSettings(message.guild.id, serverSettings);
        message.channel.send("**Prefix has been set to: **" + newPrefix);
        return;
    }

    /**
     * Banning a user
     * @param {Message} message  
     */
    banUser = function banUser(message, command, args, perms) {
        if (args.length === 0) {
            message.channel.send(`Please do ${command} <user> [days] [reason]`);
            return;
        }

        let member_id = null;
        const matches = args[0].match(new RegExp(`<@(\\d+)>`));

        if (matches) {
            member_id = matches[1];
        }

        if (!member_id) {
            member_id = args[0];
        }

        let member = null;

        if (message.guild.members.has(member_id)) {
            member = message.member(member_id);
        }

        if (member === message.member) {
            message.channel.send("You can't ban yourself");
            return;
        }

        if (member) {

            if (member.hasPermission(perms)) {
                message.channel.send("You can't ban that person");
                return;
            }
        }

        let reason = args.slice(1).join(" ");
        let days = 0;
        if (isNaN(args[1])) {
            reason = args.slice(1).join(" ");
        } else {
            days = parseInt(args[1]);
            reason = args.slice(2).join(" ");
        }

        message.guild.ban(member_id, { days, reason }).then((user) => {

            message.channel.send(`**${user}** has been banned`);

        }).catch(() => {

            message.channel.send("Failed to ban user");
        });
    }

    /**
     * Kicks a user
     * @param {Message} message 
     */
    kickUser = function kickUser(message, command, args, perms) {
        if (args.length === 0) {
            message.channel.send(`Please do ${command} <user> [reason]`);
            return;
        }

        let member_id = null;
        const matches = args[0].match(new RegExp(`<@(\\d+)>`));

        if (matches) {
            member_id = matches[1];
        }

        if (!member_id) {
            member_id = args[0];
        }

        let member = null;

        if (message.guild.members.has(member_id)) {
            member = message.member(member_id);
        }

        if (member === message.member) {
            message.channel.send("You can't kick yourself");
            return;
        }

        if (member) {

            if (member.hasPermission(perms)) {
                message.channel.send("You can't kick that person");
                return;
            }
        }

        let reason = args.slice(1).join(" ");

        member.kick(reason).then((member) => {

            message.channel.send(`**${member.displayName}** has been kicked for ${reason}`);

        }).catch(() => {

            message.channel.send("Failed to kick");
        });
    }

    /**
     * Sets welcome message
     * @param {Message} message 
     */
    welMsg = function welMsg(message, command, args, serverSettings) {
        if (args.length == 1) {
            message.channel.send("Please enter a welcome message: ({mention} tags the new user, {server} is server name, {user} shows user tag)");
            return;
        } 
        let msg = message.content.slice(command.length + 1).slice(args[0].length + 1);
        message.channel.send("Welcome message set as: " + msg)
        serverSettings.welcomeMessage = msg;
        bot.setServerSettings(message.guild.id, serverSettings);
    }

}