const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    //Requires

    require("./../modules/messagelogs.js")(bot);

    msgUpdateHandler = async function msgUpdateHandler(oldMessage, message) {

        //Functions

        editLogs(oldMessage, message);

    };
}