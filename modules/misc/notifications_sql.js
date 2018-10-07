/**
 * Notifications Class (wrapper for sqlite)
 * Author: OrigamiCoder
 */

const Discord = require("discord.js");

const sql = require("sqlite");

const mkdirp = require('mkdirp');

/*
 * Default values
 */

const SQL_FILE = "./data/notifications/notifications.sqlite";
const SQL_TABLE = "notifications";
const SQL_USER_ID = "user_id";
const SQL_KEYWORD = "keyword";

module.exports = class Notifications {
	constructor(
		sqlFile = SQL_FILE,
		sqlTableName = SQL_TABLE,
		sqlUserIDColName = SQL_USER_ID,
		sqlKeywordColName = SQL_KEYWORD) {

		if ((!sqlFile) || (sqlFile === "")) {
			sqlFile = SQL_FILE;
		}

		this.db = null;
		const matches = sqlFile.match(new RegExp(`([./\\w]+)\\/\\w+.sqlite`));
		if (matches) {
			const dir = matches[1];
			mkdirp(dir, (error) => {
				if (error) {
					console.error(error);
				} else {
					sql.open(sqlFile, { Promise, cached: true })
						.then((database) => {
							this.db = database;
						}).catch((error) => {
							console.error(error);
						});
				}
			});
		}

		const sqlTable = sqlTableName;
		const sqlUserID = sqlUserIDColName;
		const sqlKeyword = sqlKeywordColName;

		const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${sqlTable} 
        (
            ${sqlUserID} TEXT NOT NULL, 
            ${sqlKeyword} TEXT NOT NULL, 
            UNIQUE(${sqlUserID}, ${sqlKeyword}) ON CONFLICT IGNORE
        )`;

        /**
         * Creates a table name string for a Guild
         * @param {string} [guildID] - The guild id.
         * @returns {string} - Table Name
         */
		this.tableName = function tableName(guildID = null) {
			let sqlTableName = `${sqlTable}`;
			if (guildID) {
				sqlTableName += `_${guildID}`;
			}
			return sqlTableName;
		}

        /**
         * Creates table for Guild
         * @param {string} [guildID] - The guild id. (null for global).
         * @returns {Promise}
         */
		this.createTable = function createTable(guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.db.run(`CREATE TABLE IF NOT EXISTS ${sqlTableName} 
                (
                ${sqlUserID} TEXT NOT NULL, 
                ${sqlKeyword} TEXT NOT NULL, 
                UNIQUE(${sqlUserID}, ${sqlKeyword}) ON CONFLICT IGNORE
                )`);
		}

        /**
         * Deletes table for Guild
         * @param {string} [guildID] - The guild id. (null for global).
         * @returns {Promise}
         */
		this.dropTable = function dropTable(guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.db.run(`DROP TABLE ${sqlTableName}`);
		}

        /**
         * Deletes table for Guild
         * @param {string} [guildID] - The guild id. (null for global).
         * @returns {Promise}
         */
		this.deleteTable = function deleteTable(guildID = null) {
			return this.dropTable(guildID);
		}

        /**
         * Checks if a table exists for Guild.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} - Whether or not table exists.
         */
		this.tableExists = function tableExists(guildID = null) {
			const sqlTableName = this.tableName(guildID);
			let exists = false;
			return this.db.get(`SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?`, [sqlTableName])
				.then(row => {
					if (row["COUNT(*)"] !== 0) {
						exists = true;
					}
					return Promise.resolve(exists);
				}).catch(reason => {
					return Promise.reject(reason);
				});
		}

        /**
         * Add user and keyword notification pair.
         * @param {string} userID - The user id.
         * @param {string} keyword - The keyword.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} success - If the user/keyword was added successfully.
         */
		this.addUserKeyword = function addUserKeyword(userID, keyword, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.hasUserKeyword(userID, keyword, guildID)
				.then(exists => {
					if (exists) {
						return Promise.reject(`User/Keyword pair exists.`);
					}
				}).then(() => {
					return this.db.run(`INSERT INTO ${sqlTableName} (${sqlUserID}, ${sqlKeyword}) VALUES (?, ?)`, [userID, keyword])
						.then(() => {
							return Promise.resolve(true);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}

        /**
         * Remove user and keyword notification pair.
         * @param {string} userID - The user id.
         * @param {string} keyword - The keyword.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} success - If the user/keyword was removed successfully.
         */
		this.removeUserKeyword = function removeUserKeyword(userID, keyword, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.hasUserKeyword(userID, keyword, guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`User/Keyword pair doesn't exist.`);
					}
				}).then(() => {
					return this.db.run(`DELETE FROM ${sqlTableName} WHERE ${sqlUserID} = ? AND ${sqlKeyword} = ?`, [userID, keyword])
						.then(() => {
							return Promise.resolve(true);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}

        /**
         * Check if user and keyword notification pair exists.
         * @param {string} userID - The user id.
         * @param {string} keyword - The keyword.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} exists - If the user/keyword exists.
         */
		this.hasUserKeyword = function hasUserKeyword(userID, keyword, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.get(`SELECT COUNT(*) FROM ${sqlTableName} WHERE ${sqlUserID} = ? AND ${sqlKeyword} = ?`, [userID, keyword])
						.then(row => {
							const exists = (row["COUNT(*)"] !== 0);
							return Promise.resolve(exists);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}

        /**
         * Check if user exists.
         * @param {string} userID - The user id.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} exists - If the user/keyword exists.
         */
		this.hasUser = function hasUser(userID, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.get(`SELECT COUNT(*) FROM ${sqlTableName} WHERE ${sqlUserID} = ?`, [userID])
						.then(row => {
							const exists = (row["COUNT(*)"] !== 0);
							return Promise.resolve(exists);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}

        /**
         * Check if keyword exists.
         * @param {string} keyword - The keyword.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} exists - If the user/keyword exists.
         */
		this.hasKeyword = function hasKeyword(keyword, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.get(`SELECT COUNT(*) FROM ${sqlTableName} WHERE ${sqlKeyword} = ?`, [keyword])
						.then(row => {
							const exists = (row["COUNT(*)"] !== 0);
							return Promise.resolve(exists);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}

        /**
         * Get user's keywords.
         * @param {string} userID - The user id.
         * @param {string} [guildID] - The guild id.
         * @return {Promise<Set<string>>} keywords
         */
		this.getUserKeywords = function getUserKeywords(userID, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			const keywords = new Set();
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.all(`SELECT ${sqlKeyword} FROM ${sqlTableName} WHERE ${sqlUserID} = ?`, [userID])
						.then(rows => {
							rows.forEach(row => {
								keywords.add(row[sqlKeyword]);
							});
							return Promise.resolve(keywords);
						});
				}).catch(reason => {
					return Promise.resolve(keywords);
				});
		}

        /**
         * Get keyword's users.
         * @param {string} keyword - The keyword.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<Set<string>>} users
         */
		this.getKeywordUsers = function getKeywordUsers(keyword, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			const users = new Set();
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.all(`SELECT ${sqlUserID} FROM ${sqlTableName} WHERE ${sqlKeyword} = ?`, [keyword])
						.then(rows => {
							rows.forEach(row => {
								users.add(row[sqlUserID]);
							});
							return Promise.resolve(users);
						});
				}).catch(reason => {
					return Promise.resolve(users);
				});
		}

        /**
         * Get all users.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<Set<string>>} users
         */
		this.getAllUsers = function getAllUsers(guildID = null) {
			const sqlTableName = this.tableName(guildID);
			const users = new Set();
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.all(`SELECT ${sqlUserID} FROM ${sqlTableName}`)
						.then(rows => {
							rows.forEach(row => {
								users.add(row[sqlUserID]);
							});
							return Promise.resolve(users);
						});
				}).catch(reason => {
					return Promise.resolve(users);
				});
		}

        /**
         * Get all keywords.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<Set<string>>} keywords
         */
		this.getAllKeywords = function getAllKeywords(guildID = null) {
			const sqlTableName = this.tableName(guildID);
			const keywords = new Set();
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.all(`SELECT ${sqlKeyword} FROM ${sqlTableName}`)
						.then(rows => {
							rows.forEach(row => {
								keywords.add(row[sqlKeyword]);
							});
							return Promise.resolve(keywords);
						});
				}).catch(reason => {
					return Promise.resolve(keywords);
				});
		}

        /**
         * Get each keyword and run through callback function.
         * @param {function(string, string)} callback - signature: function(keyword, userID)
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<void>} 
         */
		this.forEachKeyword = function forEachKeyword(callback, guildID = null) {
			if (!callback) return;
			const sqlTableName = this.tableName(guildID);
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.each(`SELECT * FROM ${sqlTableName}`, function (err, row) {
						if (err) return Promise.reject(err);
						if (!row) return;
						const keyword = row[sqlKeyword];
						const userID = row[sqlUserID];
						callback(keyword, userID);
					});
				}).catch(reason => {
					return Promise.resolve(null);
				});
		}

        /**
         * Remove all of user's keywords.
         * @param {string} userID - The user id.
         * @param {string} [guildID] - The guild id.
         * @returns {Promise<boolean>} success - If the user's keywords were removed successfully.
         */
		this.removeAllUserKeywords = function removeAllUserKeywords(userID, guildID = null) {
			const sqlTableName = this.tableName(guildID);
			return this.tableExists(guildID)
				.then(exists => {
					if (!exists) {
						return Promise.reject(`Table doesn't exist.`);
					}
				}).then(() => {
					return this.db.run(`DELETE FROM ${sqlTableName} WHERE ${sqlUserID} = ?`, [userID])
						.then(() => {
							return Promise.resolve(true);
						}).catch(reason => {
							return Promise.reject(reason);
						});
				}).catch(reason => {
					return Promise.resolve(false);
				});
		}
	}
}