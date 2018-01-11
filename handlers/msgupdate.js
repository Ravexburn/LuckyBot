const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    //Requires

    require("./../modules/messagelogs.js")(bot);

    msgUpdateHandler = async function msgUpdateHandler(oldmessage, message) {

        //Functions

        editLogs(oldmessage, message);

    };
}