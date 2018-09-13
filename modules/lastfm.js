const Discord = require("discord.js");
const axios = require("axios");
const Lastfm = require("./lastfm_data.js");
const lastfm = new Lastfm();
const MAX_CHAR = 2048;
const commands = {
	//Retrieve data
	"nowPlaying": ["np", "nowplaying", "now-playing"],
	"topTracks": ["tt", "toptrack", "toptracks", "top-track", "top-tracks"],
	"topArtists": ["ta", "topartist", "topartists", "top-artist", "top-artists"],
	"topAlbums": ["talb", "topalbum", "topalbums", "top-album", "top-albums"],
	"recentTracks": ["recent", "recenttracks", "recent-tracks"],
	//Settings
	"setLayout": ["layout", "lo"],
	"saveUsername": ["set", "save"],
	//Time periods
	"weekly": ["week", "7-day", "7day", "weekly"],
	"monthly": ["month", "1-month", "1month", "monthly"],
	"threeMonth": ["3-month", "3month"],
	"sixMonth": ["half-year", "6-month", "6month", "halfyear"],
	"yearly": ["year", "12-month", "12month", "yearly"]
}
let notRegisteredAlert;
let apiKey;

module.exports = (bot = Discord.Client) => {

	require("./../functions/helpfunctions.js")(bot);

	lastFM = async function lastFM(message) {
		if (message.system || message.author.bot || message.channel.type === 'dm') return;

		const serverSettings = bot.getServerSettings(message.guild.id);
		if (!serverSettings) return;
		let prefix = serverSettings.prefix;
		apiKey = bot.botSettings.lastfm;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);

		if (![`${prefix}lastfm`, `${prefix}lf`].includes(command)) return;

		notRegisteredAlert = `Please register your last.fm by using ${prefix}lf set <username>`;

		if (args.length === 0) {
			attemptToRetrieveUserInfo(message);
			return;
		}

		let target; //The user to request last.fm data for, if needed

		switch (true) {

			//Save username	
			case (commands.saveUsername.includes(args[0])):
				if (args.length === 1) {
					message.reply(`No username supplied.`);
					return;
				}
				attemptToSaveLastfmUsername(message, args[1]);
				break;

			//Set layout
			case (commands.setLayout.includes(args[0])):
				if (args.length === 1) {
					message.reply(`Please select a layout between 0 and 5.`);
					return;
				}
				attemptToSetLayout(args[1], message);
				break;

			//Now Playing	
			case (commands.nowPlaying.includes(args[0])):
				target = await getTarget(message, args);
				attemptToRetrieveNowPlaying(target, message);
				break;

			//Recent
			case (commands.recentTracks.includes(args[0])):
				target = await getTarget(message, args);
				attemptToRetrieveRecentTracks(target, message);
				break;

			//Top Tracks
			case (commands.topTracks.includes(args[0])):
				target = await getTarget(message, args);
				attemptToRetrieveTopTracks(target, getTimePeriod(args[1]), message);
				break;

			//Top Artist	
			case (commands.topArtists.includes(args[0])):
				target = await getTarget(message, args);
				attemptToRetrieveTopArtists(target, getTimePeriod(args[1]), message);
				break;

			//Top Album
			case (commands.topAlbums.includes(args[0])):
				target = await getTarget(message, args);
				attemptToRetrieveTopAlbums(target, getTimePeriod(args[1]), message);
				break;

			//Help
			default:
				sendLastfmHelpEmbed(message, prefix);
				return;
		}
	};
};

function attemptToRetrieveUserInfo(message) {
	lastfm.getLastfmData(message.author.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					if (!response.data.user) {
						console.log(`Blank Account`);
						return;
					}
					let thumbnailURL = "";
					if (!response.data.user.image) {
						console.log(`No image found`);
					}
					else {
						response.data.user.image.forEach(image => {
							if (image["size"] === "extralarge") {
								thumbnailURL = image["#text"];
							}
						});
					}
					let date = new Date(response.data.user.registered.unixtime * 1000);
					let embed = new Discord.RichEmbed()
						.setAuthor(message.author.tag, message.author.displayAvatarURL.split("?")[0])
						.setURL(response.data.user.url)
						.setThumbnail(thumbnailURL)
						.setColor("#33cc33")
						.addField("Registered", `${date.getFullYear(date)}/${date.getMonth(date) + 1}/${date.getDate(date)}`, true)
						.addField("Scrobbles", response.data.user.playcount, true)
						.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
					sendEmbed(message, embed);
					return;
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToRetrieveNowPlaying(target, message) {
	lastfm.getLastfmData(target.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					if (!response.data.recenttracks) {
						console.log(`No Recent`);
						return;
					}
					if (!response.data.recenttracks.track[0]) {
						console.log(`No Track`);
						return;
					}
					let albumcover = "";
					if (!response.data.recenttracks.track[0].image) {
						console.log(`No Image`);
					}
					else {
						response.data.recenttracks.track[0].image.forEach(image => {
							if (image["size"] === "extralarge") {
								albumcover = image["#text"];
							}
						});
					}
					let album = "";
					if (response.data.recenttracks.track[0].album["#text"]) {
						album = response.data.recenttracks.track[0].album["#text"];
					}
					else {
						album = "N/A";
					}
					if (!response.data.recenttracks.track[0]["@attr"]) {
						let embed2 = new Discord.RichEmbed()
							.setAuthor(`${username} - No Current Song`, target.user.displayAvatarURL.split("?")[0])
							.setColor("#33cc33")
							.setThumbnail(albumcover)
							.addField("Previous Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
							.addField("Previous Artist", response.data.recenttracks.track[0].artist["#text"], true)
							.addField("Previous Album", album)
							.setTimestamp(message.createdAt)
							.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
						sendEmbed(message, embed2);
						return;
					}
					let embed2 = new Discord.RichEmbed()
						.setAuthor(`${username} - Now Playing`, target.user.displayAvatarURL.split("?")[0])
						.setColor("#33cc33")
						.setThumbnail(albumcover)
						.addField("Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
						.addField("Artist", response.data.recenttracks.track[0].artist["#text"], true)
						.addField("Album", album)
						.addField("Previous Song", `[${response.data.recenttracks.track[1].name}](${response.data.recenttracks.track[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
						.addField("Previous Artist", response.data.recenttracks.track[1].artist["#text"], true)
						.setTimestamp(message.createdAt)
						.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
					sendEmbed(message, embed2);
					return;
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
				return;
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToRetrieveRecentTracks(target, message) {
	lastfm.getLastfmData(target.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&limit=10&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					if (!response.data.recenttracks) {
						console.log(`No Recent`);
						return;
					}
					if (!response.data.recenttracks.track[0]) {
						console.log(`No Track`);
						return;
					}
					let recentEmbed = new Discord.RichEmbed()
						.setAuthor(`${username}'s Recent Tracks`, target.user.displayAvatarURL.split("?")[0]);
					displayRecentTracks(message, recentEmbed, response);
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
				return;
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToRetrieveTopAlbums(target, time, message) {
	lastfm.getLastfmData(target.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					embedAlltime = new Discord.RichEmbed()
						.setAuthor(`${username}'s ${time.name} Top Albums`, target.user.displayAvatarURL.split("?")[0]);
					displayTopAlbums(message, embedAlltime, response);
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
				return;
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToRetrieveTopArtists(target, time, message) {
	lastfm.getLastfmData(target.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					embedAlltime = new Discord.RichEmbed()
						.setAuthor(`${username}'s ${time.name} Top Artists`, target.user.displayAvatarURL.split("?")[0]);
					displayTopArtists(message, embedAlltime, response);
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
				return;
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToRetrieveTopTracks(target, time, message) {
	lastfm.getLastfmData(target.id)
		.then((data) => {
			if (data.username !== null) {
				let username = data.username;
				let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&format=json`;
				axios.get(url).then(response => {
					if (response.data.error) {
						return Promise.reject(response);
					}
					if (!response.data.toptracks) {
						console.log(`No Toptrack`);
						return;
					}
					embedAlltime = new Discord.RichEmbed()
						.setAuthor(`${username}'s ${time.name} Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
					displayTopTracks(message, embedAlltime, response);
				}).catch((error) => {
					handleError(message, error);
				});
			}
			else {
				message.channel.send(notRegisteredAlert);
				return;
			}
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToSaveLastfmUsername(message, username) {
	lastfm.getLastfmData(message.author.id)
		.then(() => {
			let url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;
			axios.get(url).then(response => {
				if (response.data.error) {
					return Promise.reject(response.data.message);
				}
				lastfm.setProfile(message.author.id, username, null);
				message.reply(`Username saved as: ${username}`);
				return;
			}).catch((error) => {
				handleError(message, error);
			});
		}).catch((error) => {
			console.log(error);
		});
}

function attemptToSetLayout(layout, message) {
	lastfm.getLastfmData(message.author.id)
		.then(() => {
			lastfm.setLayout(message.author.id, layout);
			message.reply(`Layout format set as: ${layout}`);
		}).catch((error) => {
			console.log(error);
		});
}

function displayRecentTracks(message, embed, response) {
	let responseA = response.data.recenttracks.track;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Recent Tracks`);
			return;
		}
	}
	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) `;
		msg += `by [${responseA[i].artist["#text"]}](https://www.last.fm/music/${responseA[i].artist["#text"].replace(/ /g, "+").replace(/\(/g, "%28").replace(/\)/g, "%29")}) \n`;
	}
	embedCss(message, embed, msg);
};

function displayTopAlbums(message, embed, response) {
	let responseA = response.data.topalbums.album;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Album`);
			return;
		}
	}
	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) `;
		msg += `by [${responseA[i].artist.name}](${responseA[i].artist.url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) `;
		msg += `(${responseA[i].playcount} plays) \n`;
	}
	embedCss(message, embed, msg);
};

function displayTopArtists(message, embed, response) {
	let responseA = response.data.topartists.artist;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Artist`);
			return;
		}
	}
	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[i].playcount} plays) \n`;
	}
	embedCss(message, embed, msg);
};

function displayTopTracks(message, embed, response) {
	let responseA = response.data.toptracks.track;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Track`);
			return;
		}
	}
	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${responseA[i].artist.name}](${responseA[i].artist.url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[i].playcount} plays) \n`;
	}
	embedCss(message, embed, msg);
};

//Embed colors, message, and footer function
function embedCss(message, embed, msg) {
	embed.setColor("#33cc33");
	embed.setDescription(msg.substring(0, MAX_CHAR));
	embed.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
};

async function getTarget(message, args) {
	let userID = message.author.id;
	if (args.length == 3) { //lf tt week <mention/id>
		if (message.mentions.users.first() != undefined) {
			userID = message.mentions.users.first().id;
		} else if (message.mentions.users.first() == undefined) {
			userID = args[args.length - 1];
		}
	} else if (args.length == 2) { //!lf tt <mention/id>
		if (message.mentions.users.first() != undefined) {
			userID = message.mentions.users.first().id;
		} else if (message.mentions.users.first() == undefined) {
			userID = args[args.length - 1];
		}
	}
	let target = message.member;
	if (message.guild.members.has(userID)) {
		target = message.guild.member(userID);
	}
	if (!target) {
		target = await bot.fetchUser(userID);
	}
	return target;
};

//Function for parsing user input into time period
function getTimePeriod(arg) {
	switch (true) {
		case (commands.weekly.includes(arg)):
			return { "period": "7day", "name": "Weekly" };
		case (commands.monthly.includes(arg)):
			return { "period": "1month", "name": "Monthly" };
		case (commands.threeMonth.includes(arg)):
			return { "period": "3month", "name": "3 Month" };
		case (commands.sixMonth.includes(arg)):
			return { "period": "6month", "name": "6 Month" };
		case (commands.yearly.includes(arg)):
			return { "period": "12month", "name": "Yearly" };
		default:
			return { "period": "overall", "name": "All Time" };
	}
};

function handleError(message, error) {
	if (error.response) {
		message.reply(`Error ${error.response.status}: ${error.response.data.message}`);
		console.log(error.response.status, error.response.data.message);
		return;
	}
	else if (error.status) {
		message.reply(`Error ${error.status}: ${error.data.message}`);
		console.log(error.status, error.data.message);
		return;
	}

};

function sendLastfmHelpEmbed(message, prefix) {
	let embed = new Discord.RichEmbed();
	lastFMHelp(prefix, embed);
	sendEmbed(message, embed);
};