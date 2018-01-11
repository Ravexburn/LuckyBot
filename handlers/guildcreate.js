const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    //Requires

    require("./../modules/information.js")(bot);

    guildCreateHandler = function guildCreateHandler(guild) {

        //Functions

        botWelcome(guild);
        
    };    
}