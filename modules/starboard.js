const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

    //Regex for detecting URLs in message

    let urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    //Post message to starboard

    starboardUpdate = async function starboardUpdate(reaction) {
        const guild = reaction.message.guild;
        const serverSettings = bot.getServerSettings(guild.id);
        if (!serverSettings) return;
        if (!serverSettings.starboardOn) return;
        if (!serverSettings.starboardChannelID) return;
        if (reaction.emoji.name != serverSettings.starboardEmoji) return;
        if (reaction.count != serverSettings.starboardNumber) return;

        const starboardChannelID = serverSettings.starboardChannelID;

        if (!guild.channels.has(starboardChannelID)) {
            return;
        }
        const boardChannel = guild.channels.get(starboardChannelID);
        if (serverSettings.starboardOn === false) return;
        
        let channel = reaction.message.channel;
        if (channel == boardChannel) return;

        let author = reaction.message.author.username;
        let image = reaction.message.author.displayAvatarURL;
        let msg = reaction.message.content;
        let attachments = reaction.message.attachments;
        let timestamp = reaction.message.createdAt;
        let footer = "#" + channel.name + " - " + timestamp.toLocaleString();

        let images = [];

        //Extract Excess Image URLs out of post and send directly in Starboard outside the embed so that previews appear
        msg = msg.replace(urlRegex, function(url) {
            if (url.includes(".jpg") || url.includes(".png") || url.includes(".gif")) {
                images.push(url);
                return "";
            } else {
                return url;
            }
        });

        //Ensure same message isn't posted multiple times in succession
        let isDuplicate = false;

        await boardChannel.fetchMessages({ limit: 10 })
            .then((channelMessages) => {
                channelMessages.forEach(channelMsg => {
                    if (channelMsg.embeds.length > 0 && channelMsg.embeds[0].title == author && channelMsg.embeds[0].description == msg) {
                        isDuplicate = true;
                    }
                });
            });

        bot.log(isDuplicate);

        if (isDuplicate) return;

        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(image)
            .setTitle(author)
            .setFooter(footer)
            .setDescription(msg);

        if (attachments.size > 0) {
            embed.setImage(attachments.array()[0].proxyURL);
        }

        //If image URL present, but no attachment, set the first image as the RichEmbed's image and remove it from the list
        if (images.length > 0 && attachments.size == 0) {
            embed.setImage(images.shift(0));
        }

        boardChannel.send(embed);

        //If any other images were attached to the image (max 1 in DiscordJS embed), send them to the starboard
        if (images.length > 0) {
            let message = images.shift(0);
            for (let i = 0; i < images.length; i++) {
                message +=  "\n" + images[i];
            }
            boardChannel.send(message);
        }
    };
};