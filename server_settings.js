const Discord = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const botSettings = require("./botsettings.json");

const defaultSettings = {
    prefix: botSettings.prefix,
    channelID: "",
    roleChannelID: "",
    joinChannelID: "",
    editChannelID: "",
    deleteChannelID: "",
    imageChannelID: "",
    centGuildID: "",
    centChanID: "",
    centEnabled: "",
    //Toggles
    imageEmbed: true,
    autoRoleOn: false,
    rolesOn: true,
    //Welcome message
    welcomeOn: true,
    welcomeEmbed: true,
    welcomeChannelID: "",
    welcomeTitle: "",
    welcomeMessage: "Welcome {user} to the server!",
    welcomeIcon: "",
    welcomeImage: "",
    //Message log
    logsOn: false,
    messageLog: false,
    editLog: false,
    deleteLog: false,
    imageLog: false,
    //Mod logs
    modLogOn: false,
}

module.exports = (bot = Discord.Client) => {
    const serverSetProvider = new EnmapLevel({ name: 'Settings' });
    bot.serverSet = new Enmap({provider: serverSetProvider })

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