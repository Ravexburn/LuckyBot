const Discord = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const axios = require("axios");
const lastfmProvider = new EnmapLevel({ name: 'Lastfm' });
lastfm = new Enmap({ provider: lastfmProvider });

const lastfmSettings = {
    username: "",
}

module.exports = (bot = Discord.Client) => {

    lastFM = async function lastFM(message) {

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
        let regusername = `Please register your last.fm by using ${prefix}lf set <username>`;
        let url = "";
        let username = "";
        if (command === `${prefix}lastfm` || command === `${prefix}lf`) {
            console.log("Crash at lastfm");
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
                        let date = new Date(response.data.user.registered.unixtime * 1000);

                        let embed = new Discord.RichEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
                            .setURL(response.data.user.url)
                            .setThumbnail(thumbnailURL)
                            .setColor("#33cc33")
                            .addField("Registered", `${date.getFullYear(date)}/${date.getMonth(date) + 1}/${date.getDate(date)}`, true)
                            .addField("Scrobbles", response.data.user.playcount, true)
                            .setFooter("Powered by last.fm");
                        sendEmbed(message, embed);
                        return;
                    }).catch((error) => {
                        console.log(error);
                    });


                }else{
                    message.channel.send(regusername);
                    return;
                }
                return;
            }

            switch (args[0]) {
                case "help":
                    let embed = new Discord.RichEmbed()
                        .setTitle("LastFM Commands")
                        .setColor("#ffff4d")
                        .setFooter("If you have any other questions please contact Rave#0737");
                    lastFMHelp(message, prefix, embed);
                    sendEmbed(message, embed);
                    break;

                case "set":
                case "save":
                    console.log("Crash at lf set");
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

                case "np":
                case "nowplaying":
                    if (lastfm.has(message.author.id)) {
                        username = lastfm.get(message.author.id);

                        url2 = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;

                        axios.get(url2).then(response => {
                            if (response.error) {
                                message.reply(response.message);
                                return Promise.reject(response.message);
                            }
                            let albumcover = "";
                            response.data.recenttracks.track[0].image.forEach(image => {
                                if (image["size"] === "extralarge") {
                                    albumcover = image["#text"];
                                }
                            })
                           
                            let embed2 = new Discord.RichEmbed()
                                .setTitle(`${username} - Now Playing`)
                                .setColor("#33cc33")
                                .setThumbnail(albumcover)
                                .addField("Album", response.data.recenttracks.track[0].album["#text"])
                                .addField("Arist", response.data.recenttracks.track[0].artist["#text"])
                                .addField("Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url})`)  
                                .addField("Previous Song", `[${response.data.recenttracks.track[1].name}](${response.data.recenttracks.track[1].url})`)     
                                .setTimestamp(message.createdAt)
                                .setFooter("Powered by last.fm");
                            sendEmbed(message, embed2);
                            return;
                    
                        }).catch((error) => {
                            console.log(error);
                        });
                    }else{
                        message.channel.send(regusername);
                        return;
                    }
                    break;

                    /* case "toptracks":
                    if (lastfm.has(message.author.id)) {
                        username = lastfm.get(message.author.id);

                        url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;

                        axios.get(url3).then(response => {
                            if (response.error) {
                                message.reply(response.message);
                                return Promise.reject(response.message);
                            }
                            
                            let embed2 = new Discord.RichEmbed()
                                .setTitle(`${username} - Now Playing`)
                                .setColor("#33cc33")
                                .setThumbnail(albumcover)
                                .addField("Album", response.data.recenttracks.track[0].album["#text"])
                                .addField("Arist", response.data.recenttracks.track[0].artist["#text"])
                                .addField("Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url})`)  
                                .addField("Previous Song", `[${response.data.recenttracks.track[1].name}](${response.data.recenttracks.track[1].url})`)     
                                .setTimestamp(message.createdAt)
                                .setFooter("Powered by last.fm");
                            sendEmbed(message, embed2);
                            return;
                    
                        }).catch((error) => {
                            console.log(error);
                        });
                    }else{
                        message.channel.send(regusername);
                        return;
                    }

                    break; */

                default:
                    let embed10 = new Discord.RichEmbed()
                        .setTitle("LastFM Commands")
                        .setColor("#ffff4d")
                        .setFooter("If you have any other questions please contact Rave#0737");
                    lastFMHelp(message, prefix, embed2);
                    sendEmbed(message, embed2);

                    return;


            }

            return;
        }

    };

}