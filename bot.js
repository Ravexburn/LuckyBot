const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.botSettings = botSettings;
const InvCache = require("./modules/invites.js");
bot.invCache = new InvCache(bot);

//Required Files

require("./server_settings.js")(bot);
require("./handlers/messagehnd.js")(bot);
require("./handlers/msgupdate.js")(bot);
require("./handlers/guildmemberadd.js")(bot);
require("./handlers/guildcreate.js")(bot);
require("./handlers/msgdelete.js")(bot);
require("./handlers/memberleave.js")(bot);
require("./functions/functions.js")(bot);

//Generates join link and shows ready status.

bot.on("ready", async () => {
    bot.log('Ready');
    try {
        let link = await bot.generateInvite();
        console.log(link);
    } catch (error) {
        bot.log(error.stack);
    }

    bot.user.setActivity(`on ${bot.guilds.size} servers | *help for list of commands`);
    bot.guilds.forEach(guild => {
        bot.invCache.guildInvites(guild).catch(console.error);
    });
});

//When the bot joins a server.

bot.on("guildCreate", guild => {
    bot.log('guildCreate');
    bot.initServerSettings(guild.id);
    bot.invCache.guildInvites(guild).catch(console.error);
    bot.user.setActivity(`on ${bot.guilds.size} servers | *help for list of commands`);
    guildCreateHandler(guild);
});

//When the bot leaves a server. 

bot.on("guildDelete", guild => {
    bot.log('guildDelete');
    bot.delServerSettings(guild.id);
    bot.user.setActivity(`on ${bot.guilds.size} servers | *help for list of commands`);
});

//All the commands the bot runs.

bot.on("message", async message => {
    bot.log('on message');
    msgHandler(message);
});

//When a message is updated.

bot.on("messageUpdate", (oldMessage, message) => {
    bot.log('messageUpdate');
    msgUpdateHandler(oldMessage, message);
});

//When a message is deleted.

bot.on("messageDelete", message => {
    bot.log('messageDelete');
    delHandler(message);
});

//When a member joins a server.

bot.on("guildMemberAdd", member => {
    bot.log('guildMemberAdd');
    memberJoinHandler(member);
});

//When a member leaves a server.

bot.on("guildMemberRemove", member => {
    bot.log('guildMemberRemove');
    leaveHandler(member);
});

bot.login(botSettings.token);

//SHIFT ALT F to format