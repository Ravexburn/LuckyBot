const Discord = require("discord.js");
const Enmap = require("enmap");
const botSettings = require("./botsettings.json");

const defaultSettings = {
    prefix: botSettings.prefix,
    channelID: "",
    roleChannelID: "",
    welcomeChannelID: "",
    welcomeMessage: "Welcome {user} to the server!",
    joinChannelID: "",
    musicChannelID: "",
    editChannelID: "",
    deleteChannelID: "",
    imageChannelID: "",
    centGuildID: "",
    centChanID: "",
    centEnabled: "",
    //Toggles
    imageEmbed: true,
    logsOn: false,
    welcomeOn: true,
    //Message log
    messageLog: false,
    editLog: false,
    deleteLog: false,
    imageLog: false,
}

module.exports = (bot = Discord.Client) => {
    bot.serverSet = new Enmap({ name: 'Settings', persistent: true });

    bot.hasServerSettings = function hasServerSettings(guildID) {
        return bot.serverSet.has(guildID);
    }

    bot.initServerSettings = function initServerSettings(guildID) {
        bot.serverSet.set(guildID, defaultSettings);
        return;
    }

    bot.getServerSettings = function getServerSettings(guildID) {
        if (!bot.hasServerSettings(guildID)) {
            bot.initServerSettings(guildID);
        }
        const guildSettings = bot.serverSet.get(guildID);
        for (var key in defaultSettings) {
            if (!guildSettings.hasOwnProperty(key)) {
                guildSettings[key] = defaultSettings[key];
                bot.setServerSettings(guildID, guildSettings);
            }
        }
        return guildSettings;
    }

    bot.setServerSettings = function setServerSettings(guildID, newSettings) {
        bot.serverSet.set(guildID, newSettings);
        return;
    }

    bot.delServerSettings = function delServerSettings(guildID) {
        bot.serverSet.delete(guildID);

    }

    bot.getDefaultSettings = function getDefaultSettings() {
        return defaultSettings;
    }
};