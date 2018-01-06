const Discord = require("discord.js");
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    /** 
     * Toggles image embed
     *@param {Message} message 
     */
    imgTog = function imgTog(message, serverSettings) {
        serverSettings.imageEmbed = !serverSettings.imageEmbed;
        bot.setServerSettings(message.guild.id, serverSettings);
        if (serverSettings.imageEmbed === true) {
            emote = ":white_check_mark: **Enabled**";
        } else {
            emote = ":x: **Disabled**";
        }
        message.channel.send(`\*\*Embed images status:\*\* ${emote}`);
    }

    /**
     * Turns logs on and off
     * @param {Message} message 
     */
    logsTog = function logsTog(message, serverSettings) {
        serverSettings.logsOn = !serverSettings.logsOn;
        bot.setServerSettings(message.guild.id, serverSettings);
        if (serverSettings.logsOn === true) {
            emote = ":white_check_mark: **Enabled**";
        } else {
            emote = ":x: **Disabled**";
        }
        message.channel.send(`\*\*Logs status:\*\* ${emote}`);
    }

    /**
     * Turns welcome setting on and off
     * @param {Message} message
     */
    welTog = function welTog(message, serverSettings) {
        serverSettings.welcomeOn = !serverSettings.welcomeOn;
        bot.setServerSettings(message.guild.id, serverSettings);
        if (serverSettings.welcomeOn === true) {
            emote = ":white_check_mark: **Enabled**";
        } else {
            emote = ":x: **Disabled**";
        }
        message.channel.send(`\*\*Welcome status:\*\* ${emote}`);
    }
}