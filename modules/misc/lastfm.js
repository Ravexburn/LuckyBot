const Discord = require("discord.js");
const axios = require("axios");
const Lastfm = require("./lastfm_data.js");
const lastfm = new Lastfm();
var apiKey = "";
var notRegisteredAlert = "";
const commands = {
	//Retrieve data
	"nowPlaying": ["np", "nowplaying", "now-playing"],
	"topTracks": ["tt", "toptrack", "toptracks", "top-track", "top-tracks"],
	"topArtists": ["ta", "topartist", "topartists", "top-artist", "top-artists"],
	"topAlbums": ["talb", "tal", "topalbum", "topalbums", "top-album", "top-albums"],
	"recentTracks": ["recent", "recenttracks", "recent-tracks"],
	//Settings
	"saveUsername": ["set", "save"],
	//Time periods
	"weekly": ["week", "7-day", "7day", "weekly"],
	"monthly": ["month", "1-month", "1month", "monthly"],
	"threeMonth": ["three-month", "3-month", "3month", "3"],
	"sixMonth": ["half-year", "6-month", "6month", "halfyear", "6"],
	"yearly": ["year", "12-month", "12month", "yearly"]
};

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);
	require("../../functions/functions.js")(bot);

	lastFM = function lastFM(serverSettings, message) {

		let prefix = serverSettings.prefix;
		if (apiKey == "") apiKey = bot.botSettings.lastfm;

		let messageArray = message.content.split(" ");
		let command = messageArray[0];
		let args = messageArray.slice(1);

		if (![`${prefix}lastfm`, `${prefix}lf`, `${prefix}fm`].includes(command)) return;

		if (notRegisteredAlert == "") notRegisteredAlert = `Please register your last.fm by using ${prefix}lf set <username>`;

		//Get the user to request last.fm data for, if needed,
		//then removes any mentions from the args list
		let target = getTarget(message, args);

		if (args.length === 0) {
			attemptToRetrieveUserInfo(message, target);
			return;
		}

		switch (true) {
			case (commands.saveUsername.includes(args[0])):
				if (args.length === 1) {
					message.reply(`No username supplied.`);
					return;
				}
				attemptToSaveLastfmUsername(message, args[1]);
				break;
			case (commands.nowPlaying.includes(args[0])):
				attemptToRetrieveNowPlaying(target, message);
				break;
			case (commands.recentTracks.includes(args[0])):
				attemptToRetrieveRecentTracks(target, message);
				break;
			case (commands.topTracks.includes(args[0])):
				attemptToRetrieveTopTracks(target, getTimePeriod(args.slice(-1)[0]), message);
				break;
			case (commands.topArtists.includes(args[0])):
				attemptToRetrieveTopArtists(target, getTimePeriod(args.slice(-1)[0]), message);
				break;
			case (commands.topAlbums.includes(args[0])):
				attemptToRetrieveTopAlbums(target, getTimePeriod(args.slice(-1)[0]), message);
				break;
			default:
				sendLastfmHelpEmbed(message, prefix);
				return;
		}
	};

	lastfmUpdate = async function lastfmUpdate(reaction) {
		if (apiKey == "") apiKey = bot.botSettings.lastfm;

		let embed = reaction.message.embeds[0];
		let footerWords = embed.footer.text.split(" ");
		let pageNumber = parseInt(footerWords[footerWords.length - 1]);
		let newPageNumber = pageNumber;

		switch (reaction.emoji.name) {
			case "⬅":
				newPageNumber--;
				break;
			case "➡":
				newPageNumber++;
				break;
			default:
				return;
		}

		if (newPageNumber <= 0) {
			clearReactions(reaction);
			return;
		}

		//example: embed.author.name = "morgan's Weekly Top Tracks" (username = Morgan, time = weekly, requestType = Tracks)
		let authorLineParts = embed.author.name.split(" ");
		let username = authorLineParts[0].substring(0, authorLineParts[0].length - 2);
		let time = getTimePeriod(authorLineParts[1].toLowerCase());
		let requestType = authorLineParts[authorLineParts.length - 1];
		let newData = embed.description;

		switch (requestType) {
			case "Tracks": {
				let tracks = await retrieveTopTracks(username, time, reaction.message, newPageNumber);
				if (!tracks) {
					clearReactions(reaction); 
					return;
				}
				newData = getTopTracksText(tracks, newPageNumber);
				break;
			}
			case "Albums": {
				let albums = await retrieveTopAlbums(username, time, reaction.message, newPageNumber);
				if (!albums) {
					clearReactions(reaction);
					return;
				}
				newData = getTopAlbumsText(albums, newPageNumber);
				break;
			}
			case "Artists": {
				let artists = await retrieveTopArtists(username, time, reaction.message, newPageNumber);
				if (!artists) {
					clearReactions(reaction);
					return;
				}
				newData = getTopArtistsText(artists, newPageNumber);
				break;
			}
			default:
				return;
		}

		clearReactions(reaction);

		let newEmbed = new Discord.RichEmbed()
			.setAuthor(embed.author.name, embed.author.iconURL)
			.setColor(embed.color)
			.setDescription(newData)
			.setFooter(`Powered by last.fm - Page ${newPageNumber}`, "https://i.imgur.com/C7u8gqg.jpg")
			.setThumbnail(embed.thumbnail.url);

		reaction.message.edit(newEmbed);
	};
};

//Gets the first mention from the command, if any, and removes all mentions from the list of args
function attemptToGetMentionId(args) {
	let mentions = [];

	for (let i = args.length - 1; i >= 0; i--) {
		const element = args[i];
		if (isMention(element)) {
			//Return 18-digit user id and remove it from the list of arguments
			mentions.push(element.replace(/<@!?/, "").replace(">", ""));
			args.splice(i, 1);
		}
	}

	return mentions[0] ? mentions[0] : null;
}

async function attemptToRetrieveNowPlaying(target, message) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
	let url = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&limit=2&api_key=${apiKey}&extended=1&format=json`;
	axios.get(url).then(response => {
		if (response.data.error) return Promise.reject(response);
		if (!response.data.recenttracks) {
			console.log(`No Recent`);
			return;
		}
		if (!response.data.recenttracks.track[0]) {
			console.log(`No Track`);
			message.channel.send("Could not find any tracks.");
			return;
		}
		displayNowPlaying(response.data.recenttracks, message, target.user.displayAvatarURL, username);
		return;
	}).catch((error) => {
		handleError(message, error);
	});
}

function attemptToRetrievePlayCount(username, trackInfo, message, callback) {
	let artist = encodeURIComponent(trackInfo.artist.name).replace(/ /g, "+");
	let track = encodeURIComponent(trackInfo.name).replace(/ /g, "+");
	let url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&user=${username}&api_key=${apiKey}&artist=${artist}&track=${track}&format=json`;
	axios.get(url).then(response => {
		if (response.data.track.userplaycount) {
			callback(response.data.track.userplaycount);
			return;
		}
		callback("Unknown");
	}).catch((error) => {
		callback("Unknown");
		handleError(message, error);
	});
}

async function attemptToRetrieveRecentTracks(target, message) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
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
			message.channel.send("Could not find any tracks.");
			return;
		}
		let embed = new Discord.RichEmbed()
			.setAuthor(`${username}'s Recent Tracks`, target.user.displayAvatarURL.split("?")[0]);
		displayRecentTracks(message, embed, response.data.recenttracks.track);
	}).catch((error) => {
		handleError(message, error);
	});
}

async function attemptToRetrieveTopAlbums(target, time, message) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
	let albums = await retrieveTopAlbums(username, time, message);
	if (!albums) return;
	let embed = new Discord.RichEmbed()
		.setAuthor(`${username}'s ${time.name} Top Albums`, target.user.displayAvatarURL.split("?")[0])
		.setFooter(`Powered by last.fm - Page 1`, "https://i.imgur.com/C7u8gqg.jpg");
	sendListEmbed(message, embed, getTopAlbumsText(albums), albums[0]);
}

async function attemptToRetrieveTopArtists(target, time, message) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
	let artists = await retrieveTopArtists(username, time, message);
	if (!artists) return;
	let embed = new Discord.RichEmbed()
		.setAuthor(`${username}'s ${time.name} Top Artists`, target.user.displayAvatarURL.split("?")[0])
		.setFooter(`Powered by last.fm - Page 1`, "https://i.imgur.com/C7u8gqg.jpg");
	sendListEmbed(message, embed, getTopArtistsText(artists), artists[0]);
}

async function attemptToRetrieveTopTracks(target, time, message) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
	let tracks = await retrieveTopTracks(username, time, message);
	if (!tracks) return;
	let embed = new Discord.RichEmbed()
		.setAuthor(`${username}'s ${time.name} Top Tracks`, target.user.displayAvatarURL.split("?")[0])
		.setFooter(`Powered by last.fm - Page 1`, "https://i.imgur.com/C7u8gqg.jpg");
	sendListEmbed(message, embed, getTopTracksText(tracks), tracks[0]);
}

async function attemptToRetrieveUserInfo(message, target) {
	let username = await getUsername(target.id);
	if (!username || username == "") {
		message.channel.send(notRegisteredAlert);
		return;
	}
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
		} else {
			response.data.user.image.forEach(image => {
				if (image["size"] === "extralarge") {
					thumbnailURL = image["#text"];
				}
			});
		}
		let date = new Date(response.data.user.registered.unixtime * 1000);
		let embed = new Discord.RichEmbed()
			.setAuthor(target.user.tag, target.user.displayAvatarURL.split("?")[0])
			.setURL(response.data.user.url)
			.setThumbnail(thumbnailURL)
			.setColor("#D21E26")
			.addField("Registered", `${date.getFullYear(date)}/${date.getMonth(date) + 1}/${date.getDate(date)}`, true)
			.addField("Scrobbles", response.data.user.playcount, true)
			.addField("Profile", `Click [here](${response.data.user.url}) to see their profile`, true);
		if (response.data.user.country) {
			embed.addField("Country", response.data.user.country, true);
		}
		embed.setFooter("Powered by last.fm", "https://i.imgur.com/C7u8gqg.jpg");
		sendEmbed(message, embed);
		return;
	}).catch((error) => {
		handleError(message, error);
	});
}

async function attemptToSaveLastfmUsername(message, username) {
	await lastfm.getLastfmData(message.author.id).catch((error) => {
		handleError(message, error);
	});
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
}

function clearReactions(reaction) {
	Array.from(reaction.users.values()).forEach(user => {
		if (!user.bot) {
			reaction.remove(user);
		}
	});
}

function displayNowPlaying(recentTracks, message, displayAvatarURL, username) {
	try {
		let track1 = recentTracks.track[0];
		let track2 = recentTracks.track[1];
		let album = track1.album["#text"] ? track1.album["#text"] : "N/A";

		let embed = new Discord.RichEmbed()
			.setColor("#D21E26")
			.setTimestamp(message.createdAt)
			.setFooter("Powered by last.fm", "https://i.imgur.com/C7u8gqg.jpg");

		setThumbnail(embed, track1);

		attemptToRetrievePlayCount(username, track1, message, (playCount) => {
			if (isNowPlaying(track1)) {
				embed.setAuthor(`${username} - Now Playing${track1.loved === '1' ? " ❤️" : ""}`, displayAvatarURL.split("?")[0])
					.addField("Song", `[${track1.name}](${formatUrl(track1.url)})`, true)
					.addField("Artist", `[${track1.artist.name}](${formatUrl(track1.artist.url)})`, true)
					.addField("Album", album, true)
					.addField("Plays", playCount, true)
					.addField("Previous Song", `[${track2.name}](${formatUrl(track2.url)})`, true)
					.addField("Previous Artist", `[${track2.artist.name}](${formatUrl(track2.artist.url)})`, true);
			} else {
				embed.setAuthor(`${username} - No Current Song`, displayAvatarURL.split("?")[0])
					.addField("Previous Song", `[${track1.name}](${formatUrl(track1.url)})`, true)
					.addField("Previous Artist", `[${track1.artist.name}](${formatUrl(track1.artist.url)})`, true)
					.addField("Previous Album", album, true)
					.addField("Plays", playCount, true);
			}
			sendEmbed(message, embed);
		});
	} catch (e) {
		console.log(e);
	}

}

function displayRecentTracks(message, embed, tracks) {
	for (i = 0; i < tracks.length; i++) {
		if (!tracks[i]) {
			console.log(`No Track`);
			return;
		}
	}
	let msg = "";
	if (isNowPlaying(tracks[0])) {
		let nowPlaying = tracks.splice(0, 1)[0];
		setThumbnail(embed, nowPlaying);
		msg += `Now Playing: [${nowPlaying.artist["#text"]}](https://www.last.fm/music/${formatUrl(nowPlaying.artist["#text"].replace(/ /g, "+"))}) `;
		msg += `- [${nowPlaying.name}](${formatUrl(nowPlaying.url)})\n\n`;
	}
	for (i = 0; i < tracks.length; i++) {
		msg += `${i + 1}. [${tracks[i].artist["#text"]}](https://www.last.fm/music/${formatUrl(tracks[i].artist["#text"].replace(/ /g, "+"))}) `;
		msg += `- [${tracks[i].name}](${formatUrl(tracks[i].url)})\n`;
	}
	embedCss(message, embed, msg);
}

//Embed colors, message, and footer function
function embedCss(message, embed, msg) {
	embed.setColor("#D21E26");
	embed.setDescription(msg.substring(0, 2048));
	embed.setFooter("Powered by last.fm", "https://i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
}

function formatUrl(url) {
	return decodeURIComponent(url).replace(/\(/g, "%28").replace(/\)/g, "%29");
}

//Function which determines which user to get last.fm data for
function getTarget(message, args) {
	try {
		let mentionId = attemptToGetMentionId(args);

		if (mentionId && message.guild.members.has(mentionId)) {
			let member = message.guild.member(mentionId);
			if (member.id) {
				return member;
			}
		}

		return message.member;
	} catch (error) {
		console.log(error);
		return message.member;
	}
}

//Function for parsing user input into time period
function getTimePeriod(arg) {
	switch (true) {
		case (commands.weekly.includes(arg)):
			return {
				"period": "7day",
				"name": "Weekly"
			};
		case (commands.monthly.includes(arg)):
			return {
				"period": "1month",
				"name": "Monthly"
			};
		case (commands.threeMonth.includes(arg)):
			return {
				"period": "3month",
				"name": "3 Month"
			};
		case (commands.sixMonth.includes(arg)):
			return {
				"period": "6month",
				"name": "6 Month"
			};
		case (commands.yearly.includes(arg)):
			return {
				"period": "12month",
				"name": "Yearly"
			};
		default:
			return {
				"period": "overall",
				"name": "All Time"
			};
	}
}

function getTopAlbumsText(albums, page = 1) {
	let text = "";
	let pageNumberOffset = 1 + (page - 1) * 10;
	for (i = 0; i < albums.length; i++) {
		text += `${i + pageNumberOffset}. [${albums[i].artist.name}](${formatUrl(albums[i].artist.url)}) - [${albums[i].name}](${formatUrl(albums[i].url)}) (${albums[i].playcount} plays)`;
		if (i < albums.length - 1) {
			text += '\n';
		}
	}
	return text;
}

function getTopArtistsText(artists, page = 1) {
	let text = "";
	let pageNumberOffset = 1 + (page - 1) * 10;
	for (i = 0; i < artists.length; i++) {
		text += `${i + pageNumberOffset}. [${artists[i].name}](${formatUrl(artists[i].url)}) (${artists[i].playcount} plays)`;
		if (i < artists.length - 1) {
			text += '\n';
		}
	}
	return text;
}

function getTopTracksText(tracks, page = 1) {
	let text = "";
	let pageNumberOffset = 1 + (page - 1) * 10;
	for (i = 0; i < tracks.length; i++) {
		text += `${i + pageNumberOffset}. [${tracks[i].artist.name}](${formatUrl(tracks[i].artist.url)}) - [${tracks[i].name}](${formatUrl(tracks[i].url)}) (${tracks[i].playcount} plays)`;
		if (i < tracks.length - 1) {
			text += '\n';
		}
	}
	return text;
}

async function getUsername(id) {
	let username = "";
	await lastfm.getLastfmData(id)
		.then(data => username = data.username)
		.catch((error) => handleError(message, error));
	return username;
}

function handleError(message, error) {
	if (error.response) {
		message.reply(`Error ${error.response.status}: ${error.response.data.message}`);
		console.log(error.response.status, error.response.data.message);
		return;
	} else if (error.status) {
		message.reply(`Error ${error.status}: ${error.data.message}`);
		console.log(error.status, error.data.message);
		return;
	}
}

//returns whether an argument contains @user or a 18-char numberic user ID
function isMention(argument) {
	return argument.includes("<@") || (!isNaN(argument) && argument.length == 18);
}

function isNowPlaying(track) {
	return track["@attr"];
}

async function retrieveTopAlbums(username, time, message, page = 1) {
	let albums = null;
	let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&page=${page}&format=json`;
	await axios.get(url).then(response => {
		if (response.data.error || !response.data.topalbums || response.data.topalbums.album.length == 0) {
			return;
		}
		albums = response.data.topalbums.album;
	}).catch((error) => {
		handleError(message, error);
	});
	return albums;
}

async function retrieveTopArtists(username, time, message, page = 1) {
	let artists = null;
	let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&page=${page}&format=json`;
	await axios.get(url).then(response => {
		if (response.data.error || !response.data.topartists || response.data.topartists.artist.length == 0) {
			return;
		}
		artists = response.data.topartists.artist;
	}).catch((error) => {
		handleError(message, error);
	});
	return artists;
}

async function retrieveTopTracks(username, time, message, page = 1) {
	let tracks = null;
	let url = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&period=${time.period}&limit=10&page=${page}&format=json`;
	await axios.get(url).then(response => {
		if (response.data.error || !response.data.toptracks || response.data.toptracks.track.length == 0) {
			return;
		}
		tracks = response.data.toptracks.track;
	}).catch((error) => {
		handleError(message, error);
	});
	return tracks;
}

function sendLastfmHelpEmbed(message, prefix) {
	let embed = new Discord.RichEmbed();
	lastFMHelp(prefix, embed);
	sendEmbed(message, embed);
}

async function sendListEmbed(message, embed, description, coverItem) {
	setThumbnail(embed, coverItem);
	embed.setColor("#D21E26").setDescription(description);
	let newMessage;
	await message.channel.send(embed).then((msg) => newMessage = msg);
	await newMessage.react("⬅");
	newMessage.react("➡");
}

function setThumbnail(embed, object) {
	if (object.image) {
		object.image.forEach(image => {
			if (image["size"] === "extralarge") {
				embed.setThumbnail(image["#text"]);
			}
		});
	}
}