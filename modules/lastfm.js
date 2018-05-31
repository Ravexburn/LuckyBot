const Discord = require("discord.js");
const axios = require("axios");
const Lastfm = require("./lastfm_data.js");
const lastfm = new Lastfm();
const MAX_CHAR = 2048;

module.exports = (bot = Discord.Client) => {

	require("./../functions/helpfunctions.js")(bot);

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

		if (command === `${prefix}lastfm` || command === `${prefix}lf`) {
			if (args.length === 0) {
				let userID = message.author.id;
				lastfm.getLastfmData(userID)
					.then((data) => {
						if (data.username !== null) {
							let username = data.username;
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
						}
					}).catch((error) => {
						console.log(error);
					});
				return;
			}

			let embed;
			let userID;
			let username;
			let target;
			let layout;
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
					userID = message.author.id;
					username = args[1];
					layout = 0;
					lastfm.getLastfmData(userID, username, layout)
						.then(() => {
							url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${bot.botSettings.lastfm}&format=json`;
							axios.get(url).then(response => {
								if (response.data.error) {
									message.reply(response.data.message);
									return Promise.reject(response.data.message);
								}
								lastfm.setUsername(userID, username, layout);
								message.reply(`Username saved as: ${username}`);
								return;
							}).catch((error) => {
								console.log(error);
							});
						}).catch((error) => {
							console.log(error);
						});
					break;

				case "layout":
				case "lo":
					if (args.length === 1) {
						message.reply(`Please select a layout between 0 and 5.`);
						return;
					}
					userID = message.author.id;
					layout = args[1];
					lastfm.getLastfmData(userID, layout)
						.then(() => {
							lastfm.setLayout(userID, layout);
							message.reply(`Layout format set as: ${layout}`);
						}).catch((error) => {
							console.log(error);
						});
					break;
				//Now Playing	
				case "np":
				case "nowplaying":
				case "now-playing":
					userID = message.author.id;

					if (args.length >= 2) {
						if (message.mentions.users.first() != undefined) {
							userID = message.mentions.users.first().id;
						} else if (message.mentions.users.first() == undefined) {
							userID = args[args.length - 1];
						}
					}

					target = message.member;

					if (message.guild.members.has(userID)) {
						target = message.guild.member(userID);
					}

					if (!target) {
						target = await bot.fetchUser(userID);
					}

					lastfm.getLastfmData(target.id)
						.then((data) => {
							if (data.username !== null) {
								let username = data.username;
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
											.setAuthor(`${username} - No Current Song`, target.user.displayAvatarURL.split("?")[0])
											.setColor("#33cc33")
											.setThumbnail(albumcover)
											.addField("Previous Album", album)
											.addField("Previous Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
											.addField("Previous Artist", response.data.recenttracks.track[0].artist["#text"], true)
											.setTimestamp(message.createdAt)
											.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
										sendEmbed(message, embed2);
										return;
									}
									let embed2 = new Discord.RichEmbed()
										.setAuthor(`${username} - Now Playing`, target.user.displayAvatarURL.split("?")[0])
										.setColor("#33cc33")
										.setThumbnail(albumcover)
										.addField("Album", album)
										.addField("Song", `[${response.data.recenttracks.track[0].name}](${response.data.recenttracks.track[0].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
										.addField("Artist", response.data.recenttracks.track[0].artist["#text"], true)
										.addField("Previous Song", `[${response.data.recenttracks.track[1].name}](${response.data.recenttracks.track[1].url.replace(/\(/g, "%28").replace(/\)/g, "%29")})`, true)
										.addField("Previous Artist", response.data.recenttracks.track[1].artist["#text"], true)
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
						}).catch((error) => {
							console.log(error);
						});
					break;

				//Recent
				case "recent":
					userID = message.author.id;

					if (args.length >= 2) {
						if (message.mentions.users.first() != undefined) {
							userID = message.mentions.users.first().id;
						} else if (message.mentions.users.first() == undefined) {
							userID = args[args.length - 1];
						}
					}

					target = message.member;

					if (message.guild.members.has(userID)) {
						target = message.guild.member(userID);
					}

					if (!target) {
						target = await bot.fetchUser(userID);
					}

					lastfm.getLastfmData(target.id)
						.then((data) => {
							if (data.username !== null) {
								let username = data.username;
								url2 = `http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${bot.botSettings.lastfm}&limit=10&format=json`;
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
									let recentEmbed = new Discord.RichEmbed()
										.setAuthor(`${username}'s Recent Tracks`, target.user.displayAvatarURL.split("?")[0]);
									rectrack(message, recentEmbed, response);
								}).catch((error) => {
									console.log(error);
								});
							} else {
								message.channel.send(regusername);
								return;
							}
						}).catch((error) => {
							console.log(error);
						});

					break;

				//Top Tracks
				case "tt":
				case "toptrack":
				case "toptracks":
				case "top-track":
				case "top-tracks":
					userID = message.author.id;

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

					target = message.member;

					if (message.guild.members.has(userID)) {
						target = message.guild.member(userID);
					}

					if (!target) {
						target = await bot.fetchUser(userID);
					}

					lastfm.getLastfmData(target.id)
						.then((data) => {
							if (data.username !== null) {
								let username = data.username;
								let time;
								url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
								switch (args[1]) {
									//All time
									default:
									case "alltime":
									case "overall":
										time = "overall";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s All Time Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
											toptracks(message, embedAlltime, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Week								
									case "week":
									case "7-day":
									case "7day":
									case "weekly":
										time = "7day";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s Weekly Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
											toptracks(message, embedWeek, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Month	
									case "month":
									case "1-month":
									case "1month":
									case "monthy":
										time = "1month";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s Monthly Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
											toptracks(message, embedMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//3 Month	
									case "3-month":
									case "3month":
										time = "3month";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s 3 Month Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
											toptracks(message, embedTMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Half Year	
									case "half-year":
									case "6-month":
									case "6month":
										time = "6month";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s 6 Month Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
											toptracks(message, embedHalf, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Year	
									case "year":
									case "12-month":
									case "12month":
									case "yearly":
										time = "12month";
										url3 = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
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
												.setAuthor(`${username}'s Yearly Top Tracks`, target.user.displayAvatarURL.split("?")[0]);
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
						}).catch((error) => {
							console.log(error);
						});
					break;

				//Top Artist	
				case "ta":
				case "topartist":
				case "topartists":
				case "top-artist":
				case "top-artists":
					userID = message.author.id;

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

					target = message.member;

					if (message.guild.members.has(userID)) {
						target = message.guild.member(userID);
					}

					if (!target) {
						target = await bot.fetchUser(userID);
					}
					lastfm.getLastfmData(target.id)
						.then((data) => {
							if (data.username !== null) {
								let username = data.username;
								let time;
								url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
								switch (args[1]) {
									//All time
									default:
									case "alltime":
									case "overall":
										time = "overall";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedAlltime = new Discord.RichEmbed()
												.setAuthor(`${username}'s All Time Top Artist`, target.user.displayAvatarURL.split("?")[0]);
											topartist(message, embedAlltime, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Week								
									case "week":
									case "7-day":
									case "7day":
									case "weekly":
										time = "7day";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedWeek = new Discord.RichEmbed()
												.setAuthor(`${username}'s Weekly Top Artist`, target.user.displayAvatarURL.split("?")[0]);
											topartist(message, embedWeek, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Month	
									case "month":
									case "1-month":
									case "1month":
									case "monthy":
										time = "1month";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedMonth = new Discord.RichEmbed()
												.setAuthor(`${username}'s Monthly Top Artist`, target.user.displayAvatarURL.split("?")[0]);
											topartist(message, embedMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//3 Month	
									case "3-month":
									case "3month":
										time = "3month";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedTMonth = new Discord.RichEmbed()
												.setAuthor(`${username}'s 3 Month Top Artist`, target.user.displayAvatarURL.split("?")[0]);
											topartist(message, embedTMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Half Year	
									case "half-year":
									case "6-month":
									case "6month":
										time = "6month";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedHalf = new Discord.RichEmbed()
												.setAuthor(`${username}'s 6 Month Top Artist`, target.user.displayAvatarURL.split("?")[0]);
											topartist(message, embedHalf, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Year	
									case "year":
									case "12-month":
									case "12month":
									case "yearly":
										time = "12month";
										url4 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url4).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedYear = new Discord.RichEmbed()
												.setAuthor(`${username}'s Yearly Top Artists`, target.user.displayAvatarURL.split("?")[0]);
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
						}).catch((error) => {
							console.log(error);
						});
					break;

				//Top Album
				case "talb":
				case "topalbum":
				case "topalbums":
				case "top-album":
				case "top-albums":
					userID = message.author.id;

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

					target = message.member;

					if (message.guild.members.has(userID)) {
						target = message.guild.member(userID);
					}

					if (!target) {
						target = await bot.fetchUser(userID);
					}

					lastfm.getLastfmData(target.id)
						.then((data) => {
							if (data.username !== null) {
								let username = data.username;
								let time;
								url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
								switch (args[1]) {
									//All time
									default:
									case "alltime":
									case "overall":
										time = "overall";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedAlltime = new Discord.RichEmbed()
												.setAuthor(`${username}'s All Time Top Albums`, target.user.displayAvatarURL.split("?")[0]);
											topalbum(message, embedAlltime, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Week								
									case "week":
									case "7-day":
									case "7day":
									case "weekly":
										time = "7day";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedWeek = new Discord.RichEmbed()
												.setAuthor(`${username}'s Weekly Top Albums`, target.user.displayAvatarURL.split("?")[0]);
											topalbum(message, embedWeek, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Month	
									case "month":
									case "1-month":
									case "1month":
									case "monthy":
										time = "1month";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedMonth = new Discord.RichEmbed()
												.setAuthor(`${username}'s Monthly Top Albums`, target.user.displayAvatarURL.split("?")[0]);
											topalbum(message, embedMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//3 Month	
									case "3-month":
									case "3month":
										time = "3month";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedTMonth = new Discord.RichEmbed()
												.setAuthor(`${username}'s 3 Month Top Albums`, target.user.displayAvatarURL.split("?")[0]);
											topalbum(message, embedTMonth, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Half Year	
									case "half-year":
									case "6-month":
									case "6month":
										time = "6month";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedHalf = new Discord.RichEmbed()
												.setAuthor(`${username}'s 6 Month Top Albums`, target.user.displayAvatarURL.split("?")[0]);
											topalbum(message, embedHalf, response);
										}).catch((error) => {
											console.log(error);
										});
										break;

									//Year	
									case "year":
									case "12-month":
									case "12month":
									case "yearly":
										time = "12month";
										url5 = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${bot.botSettings.lastfm}&period=${time}&limit=10&format=json`;
										axios.get(url5).then(response => {
											if (response.error) {
												message.reply(response.message);
												return Promise.reject(response.message);
											}
											embedYear = new Discord.RichEmbed()
												.setAuthor(`${username}'s Yearly Top Albums`, target.user.displayAvatarURL.split("?")[0]);
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
						}).catch((error) => {
							console.log(error);
						});
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
		}
	};
};

toptracks = function toptracks(message, embed, response) {
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
	embedcss(message, embed, msg);
};

topartist = function topartist(message, embed, response) {
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
	embedcss(message, embed, msg);
};

topalbum = function topalbum(message, embed, response) {
	let responseA = response.data.topalbums.album;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Album`);
			return;
		}
	}
	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) (${responseA[i].playcount} plays) \n`;
	}
	embedcss(message, embed, msg);
};

rectrack = function rectrack(message, embed, response) {
	let responseA = response.data.recenttracks.track;
	for (i = 0; i < responseA.length; i++) {
		if (!responseA[i]) {
			console.log(`No Recent Tracks`);
			return;
		}
	}

	let msg = "";
	for (i = 0; i < responseA.length; i++) {
		msg += `${i + 1}. [${responseA[i].name}](${responseA[i].url.replace(/\(/g, "%28").replace(/\)/g, "%29")}) by ${responseA[i].artist["#text"]} \n`;
	}
	embedcss(message, embed, msg);
};

embedcss = function embedcss(message, embed, msg) {
	embed.setColor("#33cc33");
	embed.setDescription(msg.substring(0, MAX_CHAR));
	embed.setFooter("Powered by last.fm", "https://images-ext-1.discordapp.net/external/EX26VtAQmWawZ6oyRUVaf76Px2JCu0m3iNU6uNv0XE0/https/i.imgur.com/C7u8gqg.jpg");
	sendEmbed(message, embed);
};
