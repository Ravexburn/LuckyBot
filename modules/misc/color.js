const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	//Finds the specific color requested

	color = function color(message, args) {
		let color = args[0].replace("#", "").toUpperCase();
		let len = color.length;
		if (len > 6 || len < 6) {
			message.reply("Please provide a 6 digit hex code").catch(console.error);
			return;
		}

		const colorregexp = new RegExp("[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]");
		const matches = color.match(colorregexp);
		if (matches) {
			let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
			let embed = new Discord.RichEmbed()
				.setTitle(`Color \`#${color}\``)
				.setColor(color)
				.setImage(url)
				.setFooter("Powered by colourlovers.com");
			message.reply({ embed: embed }).catch(console.error);
			return;
		} else {
			message.reply("Please provide a valid hex code").catch(console.error);
			return;
		}
	};

	//Finds a random color

	colorRandom = function colorRandom(message) {
		let color = getRandomColor();
		let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
		let embed = new Discord.RichEmbed()
			.setTitle(`Color \`#${color}\``)
			.setColor(color)
			.setImage(url)
			.setFooter("Powered by colourlovers.com");
		message.reply({ embed: embed })
			.then((message) => {
				message.react("🎲")
					.then(() => {
						const randomDie = message.createReactionCollector((reaction) => reaction.emoji.name === "🎲", {
							time: 300000
						});

						randomDie.on('collect', react => {
							if (react.message.id == message.id && react.users.size > 1) {
								let color = getRandomColor();
								let url = `http://www.colourlovers.com/img/${color}/200/200/color.png`;
								let embed = new Discord.RichEmbed()
									.setTitle(`Color \`#${color}\``)
									.setColor(color)
									.setImage(url)
									.setFooter("Powered by colourlovers.com");
								message.edit(embed).catch(console.error);
								Array.from(react.users.values()).forEach(user => {
									if (!user.bot) {
										react.remove(user);
									}
								});
							}
						});

						randomDie.on('end', () => {
							message.clearReactions().catch(console.error);
						});

					}).catch((error) => {
						console.log(error);
					});
			}).catch((error) => {
				console.log(error);
			});
		return;
	};
};

//Generates a random hexcode

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = "";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}