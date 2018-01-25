const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    //Requires

    require("./../modules/autorole.js")(bot);
    require("./../modules/commands.js")(bot);
    require("./../modules/filter.js")(bot);
    require("./../modules/information.js")(bot);
    require("./../modules/lastfm.js")(bot);
    require("./../modules/messagelogs.js")(bot);
    require("./../modules/modcommands.js")(bot);
    require("./../modules/notifications.js")(bot);
    require("./../modules/roles.js")(bot);

    msgHandler = async function msgHandler(message) {

        //Functions

        autoRoleMsg(message);
        specialFilter(message);
        commands(message);
        customCommands(message);
        infoMsg(message);
        lastFM(message);
        msgLog(message);
        imgLog(message);
        modCmds(message);
        owner(message);
        notifySet(message);
        notifyPing(message);
        rolesAdd(message);

    };
}