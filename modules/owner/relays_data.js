/**
 * Relays (Data)
 * Author: OrigamiCoder
 */

const Discord = require("discord.js");
const Collection = Discord.Collection;
const sql = require("sqlite");
// const enmap = require("enmap");
const mkdirp = require('mkdirp');

const SQL_FILE = "./data/relays/relays.sqlite";

const SQL_TABLE_CHANNELS = "relays_channels";
const SQL_CHANNEL_ID = "channel_id";
const SQL_RELAY_NAME = "relay_name";

const SQL_TABLE_RELAYS_DATA = "relays_data";
// const SQL_RELAY_NAME = "relay_name";
const SQL_RELAY_TYPE = "relay_type";
const SQL_RELAY_FORMAT = "relay_format";

const DATA_TYPE = "type";
const DATA_FORMAT = "format";

let db = null;
module.exports = class Relays_Data {
	constructor(sqlFile = SQL_FILE) {

		if ((!sqlFile) || (sqlFile === "")) {
			sqlFile = SQL_FILE;
		}
		const matches = sqlFile.match(new RegExp(`([./\\w]+)\\/\\w+.sqlite`));
		if (matches) {
			const dir = matches[1];
			mkdirp(dir, (error) => {
				if (error) {
					console.error(error);
				} else {
					sql.open(sqlFile, { Promise, cached: true })
						.then((database) => {
							db = database;
							return _initDb();
						}).catch((error) => {
							console.error(error);
						});
				}
			});
		}

        /**
         * Checks if the relay name exists in the database.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} exists - Whether the relay name exists.
         */
		this.relayExists = function relayExists(relay) {
			return _hasRelay(relay);
		}

        /**
         * Checks if the channel exists in the database.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<boolean>} exists - Whether the channel exists.
         */
		this.channelExists = function channelExists(channelID) {
			return _hasChannel(channelID);
		}

        /**
         * Gets all relay names.
         * @returns {string[]} relays.
         */
		this.getAllRelays = function getAllRelays() {
			return _getAllRelays();
		}

        /**
         * Gets all channel IDs.
         * @returns {string[]} channel IDs.
         */
		this.getAllChannels = function getAllChannels() {
			return _getAllChannels();
		}

        /**
         * Gets all relays and channels as a collection 
         * with each relay name as a key, and an array of its channel ids as its value.
         * @returns {Collection<string, string[]>} relays.
         */
		this.getRelaysCollection = function getRelaysCollection() {
			return _getRelaysCollection();
		}

        /**
         * Adds a relay with channels.
         * @param {string} relay - The relay name.
         * @param {string[]|string} channels - Either an array of channel IDs or a string of channel IDs separated by a space(' ').
         * @returns {Promise<boolean>} success - Whether all the channels were added successfully.
         */
		this.addRelayChannels = function addRelayChannels(relay, channels) {
			if (channels instanceof Array) {
				return _addRelayChannels(relay, channels);
			} else if (typeof channels === "string") {
				return _addRelayChannels(relay, channels.trim().split(/ +/g));
			}
		}

        /**
         * Removes a relay.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} Promise
         */
		this.removeRelay = function removeRelay(relay) {
			return _removeRelay(relay)
				.then(_removeRelayData(relay));
		}

        /**
         * Removes a channel.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<boolean>} Promise - success.
         */
		this.removeChannel = function removeChannel(channelID) {
			return _removeChannel(channelID);
		}

        /**
         * Gets a channel's relay.
         * @param {string} channelID - The channel ID.
         * @returns {Promise<string>} Promise - The relay name.
         */
		this.getChannelRelay = function getChannelRelay(channelID) {
			return _getChannelRelay(channelID);
		}

        /**
         * Gets a relay's channels.
         * @param {string} relay - The relay name.
         * @returns {Promise<string[]>} Promise - An array of channel IDs.
         */
		this.getRelayChannels = function getRelayChannels(relay) {
			return _getRelayChannels(relay);
		}

        /**
         * Checks if the relay has data that exists in the database.
         * @param {string} relay - The relay name.
         * @returns {Promise<boolean>} exists - Whether relay data exists.
         */
		this.relayDataExists = function relayDataExists(relay) {
			return _hasRelayData(relay);
		}

        /**
         * Gets relay data as an object.
         * @param {string} relay - The relay name.
         * @returns {Promise<Object>} data
         */
		this.getRelayData = function getRelayData(relay) {
			return _getRelayData(relay);
		}

        /**
         * Gets relay type.
         * @param {string} relay - The relay name.
         * @returns {Promise<string>} type
         */
		this.getRelayType = function getRelayType(relay) {
			return _getRelayType(relay);
		}

        /**
         * Gets relay format.
         * @param {string} relay - The relay name.
         * @returns {Promise<string>} format
         */
		this.getRelayFormat = function getRelayFormat(relay) {
			return _getRelayFormat(relay);
		}

        /**
         * Sets relay data.
         * @param {string} relay - The relay name.
         * @param {string} type - The relay type.
         * @param {string} format - The relay format.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		this.setRelayData = function setRelayData(relay, type, format) {
			return _setRelayData(relay, type, format);
		}

        /**
         * Sets relay type.
         * @param {string} relay - The relay name.
         * @param {string} type - The relay type.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		this.setRelayType = function setRelayType(relay, type) {
			return _setRelayType(relay, type);
		}

        /**
         * Sets relay format.
         * @param {string} relay - The relay name.
         * @param {string} format - The relay format.
         * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
         */
		this.setRelayFormat = function setRelayFormat(relay, format) {
			return _setRelayFormat(relay, format);
		}
	}
}

function _initDb() {
	return _createChannelsTable()
		.then(_createDataTable())
		.catch((error) => {
			console.error(error);
		});
}

function _createChannelsTable() {
	const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${SQL_TABLE_CHANNELS} 
    (
        ${SQL_CHANNEL_ID} TEXT NOT NULL UNIQUE, 
        ${SQL_RELAY_NAME} TEXT NOT NULL, 
        PRIMARY KEY('${SQL_CHANNEL_ID}')
    )`;

	return db.run(sqlCreateTable);

}

function _createDataTable() {
	const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${SQL_TABLE_RELAYS_DATA} 
    (
        ${SQL_RELAY_NAME} TEXT NOT NULL UNIQUE, 
        ${SQL_RELAY_TYPE} TEXT, 
        ${SQL_RELAY_FORMAT} TEXT, 
        PRIMARY KEY('${SQL_RELAY_NAME}')
    )`;

	return db.run(sqlCreateTable);

}

function _hasChannelsTable() {
	let exists = false;
	return db.get(`SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, [SQL_TABLE_CHANNELS])
		.then(row => {
			if (row["COUNT(*)"] !== 0) {
				exists = true;
			}
			return Promise.resolve(exists);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

function _hasDataTable() {
	let exists = false;
	return db.get(`SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, [SQL_TABLE_RELAYS_DATA])
		.then(row => {
			if (row["COUNT(*)"] !== 0) {
				exists = true;
			}
			return Promise.resolve(exists);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

function _cleanRelays() {
	// TODO
}

/**
 * Gets all relay names.
 * @returns {string[]} relays.
 */
function _getAllRelays() {
	const relays = new Set();
	return db.all(`SELECT DISTINCT ${SQL_RELAY_NAME} FROM ${SQL_TABLE_CHANNELS}`)
		.then((rows) => {
			rows.forEach((row) => {
				relays.add(row[SQL_RELAY_NAME]);
			});
			return Promise.resolve(Array.from(relays));
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Gets all channel IDs.
 * @returns {string[]} channel IDs.
 */
function _getAllChannels() {
	const channels = new Set();
	return db.all(`SELECT ${SQL_CHANNEL_ID} FROM ${SQL_TABLE_CHANNELS}`)
		.then((rows) => {
			rows.forEach((row) => {
				channels.add(row[SQL_CHANNEL_ID]);
			});
			return Promise.resolve(Array.from(channels));
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Gets all relays and channels as a collection with each relay name as a key, and an array of its channel ids as its value.
 * @returns {Collection<string, string[]>} relays.
 */
function _getRelaysCollection() {
	const collection = new Collection();
	return db.all(`SELECT * FROM ${SQL_TABLE_CHANNELS}`)
		.then((rows) => {
			rows.forEach((row) => {
				const relay = row[SQL_RELAY_NAME];
				const channelID = row[SQL_CHANNEL_ID];
				const arr = collection.get(relay);
				const newArr = (!arr) ? [] : arr;
				newArr.push(channelID);
				collection.set(relay, newArr);
			});
			return Promise.resolve(collection);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Checks if the relay name exists in the database.
 * @param {string} relay - The relay name.
 * @returns {Promise<boolean>} exists - Whether the relay name exists.
 */
function _hasRelay(relay) {
	return db.get(`SELECT COUNT(*) FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(row => {
			const exists = (row["COUNT(*)"] !== 0);
			return Promise.resolve(exists);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Checks if the channel exists in the database.
 * @param {string} channelID - The channel ID.
 * @returns {Promise<boolean>} exists - Whether the channel exists.
 */
function _hasChannel(channelID) {
	return db.get(`SELECT COUNT(*) FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_CHANNEL_ID} = ?`, [channelID])
		.then(row => {
			const exists = (row["COUNT(*)"] !== 0);
			return Promise.resolve(exists);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Adds a relay channel.
 * @param {string} relay - The relay name.
 * @param {string} channelID - The channel ID.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _addRelayChannel(relay, channelID) {
	return db.run(`INSERT INTO ${SQL_TABLE_CHANNELS} (${SQL_CHANNEL_ID}, ${SQL_RELAY_NAME}) VALUES (?, ?)`, [channelID, relay])
		.then(() => {
			return Promise.resolve(true);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Adds a relay with channels.
 * @param {string} relay - The relay name.
 * @param {string[]} channels - An array of channel IDs.
 * @returns {Promise<boolean>} success - Whether it added everything successfully. Rejects promise otherwise.
 */
function _addRelayChannels(relay, channels) {
	if (channels.length === 0) {
		return Promise.reject("Relays Error: No channels to add");
	}
	// channels.forEach((channelID) => {
	//     return sql.run(`INSERT INTO ${SQL_TABLE} (${SQL_CHANNEL_ID}, ${SQL_RELAY_NAME}) VALUES (?, ?)`, [channelID, relay])
	//         .then(() => {
	//             return Promise.resolve(true);
	//         }).catch(reason => {
	//             return Promise.reject(reason);
	//         });
	// });
	return Promise.all(channels.map(_canAddChannel))
		.then(() => {
			return Promise.all(channels.map((channelID) => {
				return _addRelayChannel(relay, channelID);
			}));
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Checks if a channel can be added (doesn't already exist).
 * @param {string} channelID - The channel ID
 * @returns {Promise<boolean>} success - True, if channel can be added. Rejects promise otherwise.
 */
function _canAddChannel(channelID) {
	return _hasChannel(channelID)
		.then((exists) => {
			if (exists) {
				return Promise.reject("Channel already exists");
			}
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Removes a relay.
 * @param {string} relay - The relay name
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _removeRelay(relay) {
	return db.run(`DELETE FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(() => {
			return Promise.resolve(true);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Removes a channel.
 * @param {string} channelID - The channel ID
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _removeChannel(channelID) {
	return db.run(`DELETE FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_CHANNEL_ID} = ?`, [channelID])
		.then(() => {
			return Promise.resolve(true);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Gets a channel's relay.
 * @param {string} channelID - The channel ID.
 * @returns {Promise<string>} Promise
 */
function _getChannelRelay(channelID) {
	return db.all(`SELECT ${SQL_RELAY_NAME} FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_CHANNEL_ID} = ?`, [channelID])
		.then((rows) => {
			if ((!rows) || (rows.length === 0)) {
				return Promise.reject(`Error: No results returned by channel ID: [${channelID}].`);
			} else if (rows.length !== 1) {
				return Promise.reject(`Error: Too many results returned by channel ID: [${channelID}].`);
			}
			return Promise.resolve(rows[0][SQL_RELAY_NAME]);
		}).catch((reason) => {
			return Promise.reject(reason)
		});
}

/**
 * Gets a relay's channels.
 * @param {string} relay - The relay name.
 * @returns {Promise<string[]>} Promise
 */
function _getRelayChannels(relay) {
	if (!relay) {
		return Promise.reject(`Invalid relay. [${relay}]`);
	}
	const channels = new Set();
	return db.all(`SELECT ${SQL_CHANNEL_ID} FROM ${SQL_TABLE_CHANNELS} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(rows => {
			if ((!rows) || (rows.length === 0)) {
				return Promise.reject(`Error: No results returned by relay: ${relay}.`);
			}
			rows.forEach(row => {
				channels.add(row[SQL_CHANNEL_ID]);
			});
			return Promise.resolve(Array.from(channels));
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Checks if the relay has data that exists in the database.
 * @param {string} relay - The relay name.
 * @returns {Promise<boolean>} exists - Whether relay data exists.
 */
function _hasRelayData(relay) {
	return db.get(`SELECT * FROM ${SQL_TABLE_RELAYS_DATA} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(row => {
			const exists = (row["COUNT(*)"] !== 0);
			return Promise.resolve(exists);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Adds relay data.
 * @param {string} relay - The relay name.
 * @param {string} type - The relay type.
 * @param {string} format - The relay format.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _addRelayData(relay, type, format) {
	return db.run(`UPDATE ${SQL_TABLE_RELAYS_DATA} SET ${SQL_RELAY_TYPE} = ?, ${SQL_RELAY_FORMAT} = ? WHERE ${SQL_RELAY_NAME} = ?`, [type, format, relay])
		.then((statement) => {
			if (statement.stmt.changes === 0) {
				return db.run(`INSERT INTO ${SQL_TABLE_RELAYS_DATA} (${SQL_RELAY_NAME}, ${SQL_RELAY_TYPE}, ${SQL_RELAY_FORMAT}) VALUES (?, ?, ?)`, [relay, type, format])
			}
		}).then(() => {
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
	// return sql.run(`REPLACE INTO ${SQL_TABLE_RELAYS_DATA} (${SQL_RELAY_NAME}, ${SQL_RELAY_TYPE}, ${SQL_RELAY_FORMAT}) VALUES (?, ?, ?)`, [relay, type, format])
	//     .then(() => {
	//         return Promise.resolve(true);
	//     }).catch((reason) => {
	//         return Promise.reject(reason);
	//     });
}

/**
 * Removes relay data.
 * @param {string} relay - The relay name.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _removeRelayData(relay) {
	return db.run(`DELETE FROM ${SQL_TABLE_RELAYS_DATA} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(() => {
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Sets relay data.
 * @param {string} relay - The relay name.
 * @param {string} type - The relay type.
 * @param {string} format - The relay format.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _setRelayData(relay, type, format) {
	return db.run(`UPDATE ${SQL_TABLE_RELAYS_DATA} SET ${SQL_RELAY_TYPE} = ?, ${SQL_RELAY_FORMAT} = ? WHERE ${SQL_RELAY_NAME} = ?`, [type, format, relay])
		.then((statement) => {
			if (statement.stmt.changes === 0) {
				return db.run(`INSERT INTO ${SQL_TABLE_RELAYS_DATA} (${SQL_RELAY_NAME}, ${SQL_RELAY_TYPE}, ${SQL_RELAY_FORMAT}) VALUES (?, ?, ?)`, [relay, type, format])
			}
		}).then(() => {
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Sets relay type.
 * @param {string} relay - The relay name.
 * @param {string} type - The relay type.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _setRelayType(relay, type) {
	return db.run(`UPDATE ${SQL_TABLE_RELAYS_DATA} SET ${SQL_RELAY_TYPE} = ? WHERE ${SQL_RELAY_NAME} = ?`, [type, relay])
		.then((statement) => {
			if (statement.stmt.changes === 0) {
				return db.run(`INSERT INTO ${SQL_TABLE_RELAYS_DATA} (${SQL_RELAY_NAME}, ${SQL_RELAY_TYPE}) VALUES (?, ?)`, [relay, type])
			}
		}).then(() => {
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Sets relay format.
 * @param {string} relay - The relay name.
 * @param {string} format - The relay format.
 * @returns {Promise<boolean>} success - True, if the sql executed successfully. Rejects promise otherwise.
 */
function _setRelayFormat(relay, format) {
	return db.run(`UPDATE ${SQL_TABLE_RELAYS_DATA} SET ${SQL_RELAY_FORMAT} = ? WHERE ${SQL_RELAY_NAME} = ?`, [format, relay])
		.then((statement) => {
			if (statement.stmt.changes === 0) {
				return db.run(`INSERT INTO ${SQL_TABLE_RELAYS_DATA} (${SQL_RELAY_NAME}, ${SQL_RELAY_FORMAT}) VALUES (?, ?)`, [relay, format]);
			}
		}).then(() => {
			return Promise.resolve(true);
		}).catch((reason) => {
			return Promise.reject(reason);
		});
}

/**
 * Gets relay data as an object.
 * @param {string} relay - The relay name.
 * @returns {Promise<Object>} data
 */
function _getRelayData(relay) {
	return db.get(`SELECT * FROM ${SQL_TABLE_RELAYS_DATA} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(row => {
			let data = {};
			data[DATA_TYPE] = "";
			data[DATA_FORMAT] = "";
			if (row) {
				data[DATA_TYPE] = row[SQL_RELAY_TYPE];
				data[DATA_FORMAT] = row[SQL_RELAY_FORMAT];
			}
			return Promise.resolve(data);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Gets relay type.
 * @param {string} relay - The relay name.
 * @returns {Promise<string>} type
 */
function _getRelayType(relay) {
	return db.get(`SELECT ${SQL_RELAY_TYPE} FROM ${SQL_TABLE_RELAYS_DATA} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(row => {
			let type = "";
			if (row) {
				type = row[SQL_RELAY_TYPE];
			}
			return Promise.resolve(type);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}

/**
 * Gets relay format.
 * @param {string} relay - The relay name.
 * @returns {Promise<string>} format
 */
function _getRelayFormat(relay) {
	return db.get(`SELECT ${SQL_RELAY_FORMAT} FROM ${SQL_TABLE_RELAYS_DATA} WHERE ${SQL_RELAY_NAME} = ?`, [relay])
		.then(row => {
			let format = "";
			if (row) {
				format = row[SQL_RELAY_FORMAT];
			}
			return Promise.resolve(format);
		}).catch(reason => {
			return Promise.reject(reason);
		});
}