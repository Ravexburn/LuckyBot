const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.botSettings = botSettings;
const InvCache = require("./modules/invites.js");
bot.invCache = new InvCache(bot);

//Required Files

require("./modules/autorole.js")(bot);
require("./modules/information.js")(bot);
require("./modules/lastfm.js")(bot);
require("./modules/messagelogs.js")(bot);
require("./modules/modcommands.js")(bot);
require("./modules/notifications.js")(bot);
require("./modules/roles.js")(bot);
require("./server_settings.js")(bot);
require("./modules/welcome.js")(bot);

//Generates join link and shows ready status.

bot.on("ready", async () => {
    console.log('Ready');
    try {
        let link = await bot.generateInvite();
        console.log(link);
    } catch (error) {
        console.log(error.stack);
    }

    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
    bot.guilds.forEach(guild => {
        bot.invCache.guildInvites(guild).catch(console.error);
    });
});

//When bot joins a server set initial settings and update playing status.

bot.on("guildCreate", guild => {
    bot.initServerSettings(guild.id);
    bot.invCache.guildInvites(guild).catch(console.error);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
});

//When bot leaves a server delete the settings and update playing status. 

bot.on("guildDelete", guild => {
    bot.delServerSettings(guild.id);
    bot.user.setGame(`on ${bot.guilds.size} servers | *help for list of commands`)
});

bot.login(botSettings.token);

//SHIFT ALT F to format