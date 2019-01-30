const Discord = require("discord.js");
const axios = require("axios");
const Horoscope = require("./horoscope_data.js");
const MAX_CHAR = 2048;
const horoscope = new Horoscope();

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../../functions/functions.js")(bot);

	const signColor = {
		Aries: "#B70000",
		Taurus: "#FFC0CB",
		Gemini: "#FFFF7F",
		Cancer: "#939393",
		Leo: "#993299",
		Virgo: "#556B2F",
		Libra: "#89cff0",
		Scorpio: "#5d0000",
		Sagittarius: "#000066",
		Capricorn: "#3f2a14",
		Aquarius: "#40E0D0",
		Pisces: "#a0d6b4"
	};

	const signPic = {
		Aries: "https://imgur.com/DGohmjM.png",
		Taurus: "https://imgur.com/O3oKFxD.png",
		Gemini: "https://imgur.com/KPNhNvy.png",
		Cancer: "https://imgur.com/GS997eb.png",
		Leo: "https://imgur.com/lhmqFna.png",
		Virgo: "https://imgur.com/g5D4OEM.png",
		Libra: "https://imgur.com/ftQ2kHn.png",
		Scorpio: "https://imgur.com/Y6OjSdE.png",
		Sagittarius: "https://imgur.com/pfJw8mC.png",
		Capricorn: "https://imgur.com/52u6hJq.png",
		Aquarius: "https://imgur.com/flBYyKX.png",
		Pisces: "https://imgur.com/4Mlu6fK.png"
	};

	horoscopeSet = function horoscopeSet(message, args) {
		if (args.length === 1) {
			message.reply(`No sunsign supplied.`);
			return;
		}
		let userID = message.author.id;
		let sign1 = args[1].toLowerCase();
		let sunsign = sign1.charAt(0).toUpperCase() + sign1.substr(1);

		if (!(sunsign in signColor)) {
			message.channel.send("Please provide a valid sunsign.");
			return;
		}

		horoscope.getHoroscopeData(userID)
			.then(() => {
				horoscope.setSign(userID, sunsign);
				message.reply(`Sunsign saved as: \`${sunsign}\``);
				return;
			}).catch((error) => {
				console.log(error);
			});
	};

	horoList = function horoList(message) {
		let embed = new Discord.RichEmbed()
			.setTitle("**List of Horoscopes**")
			.setColor("#EF095E")
			.addField("Aries", "March 21 - April 19", true)
			.addField("Taurus", "April 20 - May 20", true)
			.addField("Gemini", "May 21 - June 20", true)
			.addField("Cancer", "June 21 - July 22", true)
			.addField("Leo", "July 23 - August 22", true)
			.addField("Virgo", "August 23 - September 22", true)
			.addField("Libra", "September 23 - October 22", true)
			.addField("Scorpio", "October 23 - November 21", true)
			.addField("Sagittarius", "November 22 - December 21", true)
			.addField("Capricorn", "December 22 - January 19", true)
			.addField("Aquarius", "January 20 - February 18", true)
			.addField("Pisces", "February 19 - March 20", true);
		message.channel.send(embed);
		return;
	};

	horoInfo = function horoInfo(message, time, prefix) {
		let regsign = `Please save your sunsign by using \`${prefix}horoscope set <sunsign>\`. Find out which one you are with \`${prefix}horoscope list\`.`;
		let userID = message.author.id;
		horoscope.getHoroscopeData(userID)
			.then((data) => {
				if (data.sunsign !== null) {
					let sign1 = data.sunsign;
					let sign = sign1.charAt(0).toUpperCase() + sign1.substr(1);
					let url = `https://aztro.sameerkumar.website/?sign=${sign}&day=${time}`;
					axios.post(url).then(response => {
						makeEmbed(message, response, sign);
					}).catch((error) => {
						console.log(error);
					});
				} else {
					message.channel.send(regsign);
					return;
				}
			});
	};

	makeEmbed = function makeEmbed(message, response, sign) {
		const date = {
			today: `${response.data.current_date}`,
			tomorrow: `${response.data.current_date}`,
			yesterday: `${response.data.current_date}`
		};

		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
			.setThumbnail(signPic[sign])
			.setTitle(`**${sign}**`)
			.setColor(signColor[sign])
			.addField("Mood", response.data.mood, true)
			.addField("Compatibility", response.data.compatibility, true)
			.addField("Lucky Number", response.data.lucky_number, true)
			.addField("Lucky Time", response.data.lucky_time, true)
			.addField("Horoscope", response.data.description)
			.setFooter(date[time]);
		sendEmbed(message, embed);
		return;
	};
};