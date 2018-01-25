const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    specialFilter = function specialFilter(message){

        //Stops dubustare
        if (message.content.toLowerCase().includes("dubu") && message.guild.id === "336656142338097153"){
            message.delete();
            return;

        }
    }

}