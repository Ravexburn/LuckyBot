const Discord = require("discord.js");
const Enmap = require("enmap");
const axios = require("axios");
let lastfm = new Enmap({ name: 'Lastfm', persistent: true });

const lastfmSettings = {
    username: "",
}

module.exports = (bot = Discord.Client) => {

    bot.on("message", async message => {

        if (message.system) return;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        const serverSettings = bot.getServerSettings(message.guild.id);
        if (!serverSettings) return;

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        let prefix = serverSettings.prefix;
        if (!command.startsWith(prefix)) return;

        let url = "";
        let username = "";
        if (command === `${prefix}lastfm` || command === `${prefix}lf`) {
            if (args.length === 0) {
                if (lastfm.has(message.author.id)) {
                    username = lastfm.get(message.author.id);

                    url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;

                    axios.get(url).then(response => {
                        if (response.error) {
                            message.reply(response.message);
                            return Promise.reject(response.message);
                        }
                        let thumbnailURL = "";
                        response.data.user.image.forEach(image => {
                            if (image["size"] === "extralarge") {
                                thumbnailURL = image["#text"];
                            }

                        })
                        
                        let embed = new Discord.RichEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
                            .setURL(response.data.user.url)
                            .setThumbnail(thumbnailURL)
                            .setColor("#33cc33")
                            .addField("Registered", response.data.user.registeredunixtime, true)
                            .addField("Scrobbles", response.data.user.playcount, true);
                        message.channel.send(embed);
                        return;
                    }).catch((error) => {
                        console.log(error);
                    });


                }
                return;
            }

            switch (args[0]) {

                case "set":
                    if (args.length === 1) {
                        message.reply(`No username supplied.`);
                        return;
                    }

                    username = args[1];
                    url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;

                    axios.get(url).then(response => {
                        if (response.data.error) {
                            message.reply(response.data.message);
                            return Promise.reject(response.data.message);
                        }
                        lastfm.set(message.author.id, username);
                        message.reply(`Username saved as: ${username}`);
                        return;
                    }).catch((error) => {
                        console.log(error);
                    });

                    break;


                default:

                    return;


            }







            return;
        }





    });

}