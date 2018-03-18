const Discord = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const axios = require("axios");
const lastfmProvider = new EnmapLevel({ name: 'Lastfm' });
lastfm = new Enmap({ provider: lastfmProvider });

const lastfmSettings = {
	username: "",
	layout: 0,
};

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
			if (args.length === 0) {
				if (lastfm.has(message.author.id)) {
					username = lastfm.get(message.author.id);
					url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;
					axios.get(url).then(response => {
						if (response.error) {
							message.reply(response.message);
							return Promise.reject(response.message);
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
						console.log(error);
					});
				} else {
					message.channel.send(regusername);
					return;
				}
				return;
			}

			let embed;
			//Cases for LF
			switch (args[0]) {
				//Help
				case "help":
					embed = new Discord.RichEmbed()
						.setTitle("LastFM Commands")
						.setColor("#ffff4d")
						.setFooter("If you have any other questions please contact Rave#0737");
					lastFMHelp(message, prefix, embed);
					sendEmbed(message, embed);
					break;

				//Save username	
				case "set":
				case "save":
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

				//Now Playing	
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
							} else {
								response.data.recenttracks.track[0].image.forEach(image => {
									if (image["size"] === "extralarge") {
										albumcover = image["#text"];
									}
								});
							}
							let album = "";
							if (response.data.recenttracks.track[0].album["#text"]) {
								album = response.data.recenttracks.track[0].album["#text"];
							} else {
								album = "N/A";
							}
							if (!response.data.recenttracks.track[0]["@attr"]) {
								let embed2 = new Discord.RichEmbed()
									.setAuthor(`${username} - No Current Song`, message.author.displayAvatarURL.split("?")[0])
									.setColor("#33cc33")
									.setThumbnail(albumcover)
									.addField("Previous Album", album)
									.addField("Previous Artist", `${response.data.recenttracks.track[0].artist["#text"]}`, true)
									.addField("Previous Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
									.setTimestamp(message.createdAt)
									.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
								sendEmbed(message, embed2);
								return;
							}
							let embed2 = new Discord.RichEmbed()
								.setAuthor(`${username} - Now Playing`, message.author.displayAvatarURL.split("?")[0])
								.setColor("#33cc33")
								.setThumbnail(albumcover)
								.addField("Album", album)
								.addField("Artist", response.data.recenttracks.track[0].artist["#text"], true)
								.addField("Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
								.addField("Previous Artist", `${response.data.recenttracks.track[1].artist["#text"]}`, true)
								.addField("Previous Song", `[${response.data.recenttracks.track[1].name}](${response.data.recenttracks.track[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
								.setTimestamp(message.createdAt)
								.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
							sendEmbed(message, embed2);
							return;
						}).catch((error) => {
							console.log(error);
						});
					} else {
						message.channel.send(regusername);
						return;
					}
					break;

				//Top Tracks
				case "tt":
				case "toptrack":
				case "toptracks":
					if (lastfm.has(message.author.id)) {
						username = lastfm.get(message.author.id);
						let time;
						url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
						switch (args[1]) {
							//All time
							default:
							case "alltime":
								time = "overall";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedAlltime = new Discord.RichEmbed()
										.setAuthor(`${username}'s All Time Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedAlltime, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Week								
							case "week":
								time = "7day";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedWeek = new Discord.RichEmbed()
										.setAuthor(`${username}'s Weekly Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedWeek, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Month	
							case "month":
								time = "1month";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s Monthly Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//3 Month	
							case "3-month":
								time = "3month";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedTMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s 3 Month Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedTMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Half Year	
							case "half-year":
							case "6-month":
								time = "6month";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedHalf = new Discord.RichEmbed()
										.setAuthor(`${username}'s 6 Month Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedHalf, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Year	
							case "year":
								time = "12month";
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url3).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									if (!response.data.toptracks) {
										console.log(`No Toptrack`);
										return;
									}
									embedYear = new Discord.RichEmbed()
										.setAuthor(`${username}'s Yearly Top Tracks`, message.author.displayAvatarURL.split("?")[0]);
									toptracks(message, embedYear, response);
								}).catch((error) => {
									console.log(error);
								});
								break;
						}
					} else {
						message.channel.send(regusername);
						return;
					}
					break;

				//Top Artist	
				case "ta":
				case "topartist":
				case "topartists":
					if (lastfm.has(message.author.id)) {
						username = lastfm.get(message.author.id);
						let time;
						url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
						switch (args[1]) {
							//All time
							default:
							case "alltime":
								time = "overall";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedAlltime = new Discord.RichEmbed()
										.setAuthor(`${username}'s All Time Top Artist`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedAlltime, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Week								
							case "week":
								time = "7day";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedWeek = new Discord.RichEmbed()
										.setAuthor(`${username}'s Weekly Top Artist`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedWeek, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Month	
							case "month":
								time = "1month";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s Monthly Top Artist`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//3 Month	
							case "3-month":
								time = "3month";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedTMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s 3 Month Top Artist`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedTMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Half Year	
							case "half-year":
							case "6-month":
								time = "6month";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedHalf = new Discord.RichEmbed()
										.setAuthor(`${username}'s 6 Month Top Artist`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedHalf, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Year	
							case "year":
								time = "12month";
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url4).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedYear = new Discord.RichEmbed()
										.setAuthor(`${username}'s Yearly Top Artists`, message.author.displayAvatarURL.split("?")[0]);
									topartist(message, embedYear, response);
								}).catch((error) => {
									console.log(error);
								});
								break;
						}
					} else {
						message.channel.send(regusername);
						return;
					}
					break;

				//Top Album
				case "talb":
				case "topalbum":
				case "topalbums":
					if (lastfm.has(message.author.id)) {
						username = lastfm.get(message.author.id);
						let time;
						url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
						switch (args[1]) {
							//All time
							default:
							case "alltime":
								time = "overall";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedAlltime = new Discord.RichEmbed()
										.setAuthor(`${username}'s All Time Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedAlltime, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Week								
							case "week":
								time = "7day";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedWeek = new Discord.RichEmbed()
										.setAuthor(`${username}'s Weekly Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedWeek, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Month	
							case "month":
								time = "1month";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s Monthly Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//3 Month	
							case "3-month":
								time = "3month";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedTMonth = new Discord.RichEmbed()
										.setAuthor(`${username}'s 3 Month Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedTMonth, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Half Year	
							case "half-year":
							case "6-month":
								time = "6month";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedHalf = new Discord.RichEmbed()
										.setAuthor(`${username}'s 6 Month Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedHalf, response);
								}).catch((error) => {
									console.log(error);
								});
								break;

							//Year	
							case "year":
								time = "12month";
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&format=json`;
								axios.get(url5).then(response => {
									if (response.error) {
										message.reply(response.message);
										return Promise.reject(response.message);
									}
									embedYear = new Discord.RichEmbed()
										.setAuthor(`${username}'s Yearly Top Albums`, message.author.displayAvatarURL.split("?")[0]);
									topalbum(message, embedYear, response);
								}).catch((error) => {
									console.log(error);
								});
								break;
						}
					} else {
						message.channel.send(regusername);
						return;
					}

					break;
				default:
					embedDef = new Discord.RichEmbed()
						.setTitle("LastFM Commands")
						.setColor("#ffff4d")
						.setFooter("If you have any other questions please contact Rave#0737");
					lastFMHelp(message, prefix, embedDef);
					sendEmbed(message, embedDef);
					return;
			}

			return;
		}

	};

};


toptracks = function toptracks(message, embed, response) {
	if (!response.data.toptracks.track[0]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[1]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[2]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[3]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[4]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[5]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[6]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[7]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[8]) {
		console.log(`No Track`);
		return;
	} if (!response.data.toptracks.track[9]) {
		console.log(`No Track`);
		return;
	}
	embed.setColor("#33cc33");
	embed.setDescription(`1. [${response.data.toptracks.track[0].name}](${response.data.toptracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[0].artist.name}](${response.data.toptracks.track[0].artist.url}) (${response.data.toptracks.track[0].playcount} plays)
2. [${response.data.toptracks.track[1].name}](${response.data.toptracks.track[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[1].artist.name}](${response.data.toptracks.track[1].artist.url}) (${response.data.toptracks.track[1].playcount} plays)							
3. [${response.data.toptracks.track[2].name}](${response.data.toptracks.track[2].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[2].artist.name}](${response.data.toptracks.track[2].artist.url}) (${response.data.toptracks.track[2].playcount} plays)				
4. [${response.data.toptracks.track[3].name}](${response.data.toptracks.track[3].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[3].artist.name}](${response.data.toptracks.track[3].artist.url}) (${response.data.toptracks.track[3].playcount} plays)
5. [${response.data.toptracks.track[4].name}](${response.data.toptracks.track[4].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[4].artist.name}](${response.data.toptracks.track[4].artist.url}) (${response.data.toptracks.track[4].playcount} plays)
6. [${response.data.toptracks.track[5].name}](${response.data.toptracks.track[5].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[5].artist.name}](${response.data.toptracks.track[5].artist.url}) (${response.data.toptracks.track[5].playcount} plays)
7. [${response.data.toptracks.track[6].name}](${response.data.toptracks.track[6].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[6].artist.name}](${response.data.toptracks.track[6].artist.url}) (${response.data.toptracks.track[6].playcount} plays)
8. [${response.data.toptracks.track[7].name}](${response.data.toptracks.track[7].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[7].artist.name}](${response.data.toptracks.track[7].artist.url}) (${response.data.toptracks.track[7].playcount} plays)
9. [${response.data.toptracks.track[8].name}](${response.data.toptracks.track[8].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[8].artist.name}](${response.data.toptracks.track[8].artist.url}) (${response.data.toptracks.track[8].playcount} plays)
10. [${response.data.toptracks.track[9].name}](${response.data.toptracks.track[9].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by [${response.data.toptracks.track[9].artist.name}](${response.data.toptracks.track[9].artist.url}) (${response.data.toptracks.track[9].playcount} plays)`);
	embed.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
};

topartist = function topartist(message, embed, response) {
	let responseA = response.data.topartists.artist;

	if (!responseA[0]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[1]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[2]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[3]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[4]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[5]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[6]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[7]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[8]) {
		console.log(`No Artist`);
		return;
	} if (!responseA[9]) {
		console.log(`No Artist`);
		return;
	}
	embed.setColor("#33cc33");
	embed.setDescription(`1. [${responseA[0].name}](${responseA[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[0].playcount} plays)
2. [${responseA[1].name}](${responseA[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[1].playcount} plays)							
3. [${responseA[2].name}](${responseA[2].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[2].playcount} plays)				
4. [${responseA[3].name}](${responseA[3].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[3].playcount} plays)
5. [${responseA[4].name}](${responseA[4].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[4].playcount} plays)
6. [${responseA[5].name}](${responseA[5].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[5].playcount} plays)
7. [${responseA[6].name}](${responseA[6].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[6].playcount} plays)
8. [${responseA[7].name}](${responseA[7].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[7].playcount} plays)
9. [${responseA[8].name}](${responseA[8].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[8].playcount} plays)
10. [${responseA[9].name}](${responseA[9].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[9].playcount} plays)`);
	embed.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
};

topalbum = function topalbum(message, embed, response) {
	let responseA = response.data.topalbums.album;

	if (!responseA[0]) {
		console.log(`No Album`);
		return;
	} if (!responseA[1]) {
		console.log(`No Album`);
		return;
	} if (!responseA[2]) {
		console.log(`No Album`);
		return;
	} if (!responseA[3]) {
		console.log(`No Album`);
		return;
	} if (!responseA[4]) {
		console.log(`No Album`);
		return;
	} if (!responseA[5]) {
		console.log(`No Album`);
		return;
	} if (!responseA[6]) {
		console.log(`No Album`);
		return;
	} if (!responseA[7]) {
		console.log(`No Album`);
		return;
	} if (!responseA[8]) {
		console.log(`No Album`);
		return;
	} if (!responseA[9]) {
		console.log(`No Album`);
		return;
	}
	embed.setColor("#33cc33");
	embed.setDescription(`1. [${responseA[0].name}](${responseA[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[0].playcount} plays)
2. [${responseA[1].name}](${responseA[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[1].playcount} plays)							
3. [${responseA[2].name}](${responseA[2].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[2].playcount} plays)				
4. [${responseA[3].name}](${responseA[3].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[3].playcount} plays)
5. [${responseA[4].name}](${responseA[4].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[4].playcount} plays)
6. [${responseA[5].name}](${responseA[5].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[5].playcount} plays)
7. [${responseA[6].name}](${responseA[6].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[6].playcount} plays)
8. [${responseA[7].name}](${responseA[7].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[7].playcount} plays)
9. [${responseA[8].name}](${responseA[8].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[8].playcount} plays)
10. [${responseA[9].name}](${responseA[9].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[9].playcount} plays)`);
	embed.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
};
