const sql = require("sqlite");
const mkdirp = require("mkdirp");

const SQL_FILE = "./data/profiles/profiles.sqlite";

const SQL_TABLE_PROFILE = "profiles";
const SQL_USER_ID = "user_id";
const SQL_LEVEL = "level";
const SQL_EXP = "exp";
const SQL_REP = "rep";
const SQL_BACKGROUND = "background";
const SQL_BIO = "bio";
const SQL_TITLE = "title";
const SQL_BIRTHDAY_MONTH = "bday_month";
const SQL_BIRTHDAY_DAY = "bday_day";
const SQL_AGE = "age";
const SQL_TICKETS = "tickets";
const SQL_P1 = "p_tier1";
const SQL_P2 = "p_tier2";
const SQL_P3 = "p_tier3";

const SQL_TABLE_LOCAL = "levels_local";
const SQL_GUILD = "guild_id";

let db = null;
module.exports = class Profiles {
	constructor() {

		const matches = SQL_FILE.match(new RegExp("([./\\w]+)\\/\\w+.sqlite"));
		if (matches) {
			const dir = matches[1];
			mkdirp(dir, (error) => {
				if (error) {
					console.error(error);
				} else {
					sql.open(SQL_FILE, { Promise, cached: true })
						.then((database) => {
							db = database;
							return _initDb();
						}).catch((error) => {
							console.error(error);
						});
				}
			});
		}

		this.getProfileData = function getProfileData(userID) {
			return _dbExist()
				.then((db) => {
					return db.get(`SELECT * FROM ${SQL_TABLE_PROFILE} WHERE ${SQL_USER_ID} = ?`, [userID]);
				}).then((row) => {
					if (!row) {
						let data = {};
						data[SQL_AGE] = null;
						data[SQL_BACKGROUND] = null;
						data[SQL_BIO] = null;
						data[SQL_BIRTHDAY_DAY] = null;
						data[SQL_BIRTHDAY_MONTH] = null;
						data[SQL_EXP] = 0;
						data[SQL_LEVEL] = 0;
						data[SQL_REP] = 0;
						data[SQL_TITLE] = null;
						data[SQL_TICKETS] = 0;
						data[SQL_P1] = null;
						data[SQL_P2] = null;
						data[SQL_P3] = null;
						data[SQL_USER_ID] = userID;
						return Promise.resolve(data);
					}
					let data = {};
					data[SQL_AGE] = row[SQL_AGE];
					data[SQL_BACKGROUND] = row[SQL_BACKGROUND];
					data[SQL_BIO] = row[SQL_BIO];
					data[SQL_BIRTHDAY_DAY] = row[SQL_BIRTHDAY_DAY];
					data[SQL_BIRTHDAY_MONTH] = row[SQL_BIRTHDAY_MONTH];
					data[SQL_EXP] = row[SQL_EXP];
					data[SQL_LEVEL] = row[SQL_LEVEL];
					data[SQL_REP] = row[SQL_REP];
					data[SQL_TITLE] = row[SQL_TITLE];
					data[SQL_TICKETS] = row[SQL_TICKETS];
					data[SQL_USER_ID] = row[SQL_USER_ID];
					return Promise.resolve(data);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setProfileData = function setProfileData(userID, level, exp, rep, background, bio, title, month, day, age, tickets) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_LEVEL} =?, ${SQL_EXP} = ?, ${SQL_REP} =?, ${SQL_BACKGROUND} =?, ${SQL_BIO} =?, ${SQL_TITLE} =?, ${SQL_BIRTHDAY_MONTH} =?, ${SQL_BIRTHDAY_DAY} =?, ${SQL_AGE} =?, ${SQL_TICKETS} WHERE ${SQL_USER_ID} =?`, [level, exp, rep, background, bio, title, month, day, age, tickets, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_LEVEL}, ${SQL_EXP}, ${SQL_REP}, ${SQL_BACKGROUND}, ${SQL_BIO}, ${SQL_TITLE}, ${SQL_BIRTHDAY_MONTH}, ${SQL_BIRTHDAY_DAY}, ${SQL_AGE}, ${SQL_TICKETS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, level, exp, rep, background, bio, title, month, day, age, tickets]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setLvlXp = function setLvlXp(userID, level, exp) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_LEVEL} =?, ${SQL_EXP} = ? WHERE ${SQL_USER_ID} =?`, [level, exp, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_LEVEL}, ${SQL_EXP}) VALUES (?, ?, ?)`, [userID, level, exp]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setRep = function setRep(userID, rep) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_REP} =? WHERE ${SQL_USER_ID} =?`, [rep, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_REP}) VALUES (?, ?)`, [userID, rep]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setCur = function setCur(userID, tickets) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_TICKETS} =? WHERE ${SQL_USER_ID} =?`, [tickets, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_TICKETS}) VALUES (?, ?)`, [userID, tickets]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setLevelG = function setLevelG(userID, level) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_LEVEL} =? WHERE ${SQL_USER_ID} =?`, [level, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_LEVEL}) VALUES (?, ?)`, [userID, level]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.sortLevels = function sortLevels(limit) {
			return _dbExist()
				.then((db) => {
					return db.all(`SELECT ${SQL_USER_ID}, ${SQL_LEVEL}, ${SQL_EXP} FROM ${SQL_TABLE_PROFILE} ORDER BY ${SQL_LEVEL} DESC, ${SQL_EXP} DESC LIMIT ${limit}`);
				}).then((rows) => {
					let arr = [];
					rows.forEach(row => {
						let data = {};
						data[SQL_USER_ID] = row[SQL_USER_ID];
						data[SQL_LEVEL] = row[SQL_LEVEL];
						arr.push(data);
					});
					return Promise.resolve(arr);	
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};


		this.getProfileLevelLocal = function getProfileLevelLocal(userID, guildID) {
			return _dbExist()
				.then((db) => {
					return db.get(`SELECT * FROM ${SQL_TABLE_LOCAL} WHERE ${SQL_USER_ID} = ? AND ${SQL_GUILD} = ?`, [userID, guildID]);
				}).then((row) => {
					if (!row) {
						let data = {};
						data[SQL_EXP] = 0;
						data[SQL_LEVEL] = 0;
						data[SQL_GUILD] = guildID;
						data[SQL_USER_ID] = userID;
						return Promise.resolve(data);
					}
					let data = {};
					data[SQL_EXP] = row[SQL_EXP];
					data[SQL_LEVEL] = row[SQL_LEVEL];
					data[SQL_GUILD] = row[SQL_GUILD];
					data[SQL_USER_ID] = row[SQL_USER_ID];
					return Promise.resolve(data);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setLvlXpLocal = function setLvlXpLocal(userID, guildID, level, exp) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_LOCAL} SET ${SQL_LEVEL} =?, ${SQL_EXP} = ? WHERE ${SQL_USER_ID} =? AND ${SQL_GUILD} = ?`, [level, exp, userID, guildID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_LOCAL} (${SQL_USER_ID}, ${SQL_GUILD}, ${SQL_LEVEL}, ${SQL_EXP}) VALUES (?, ?, ?, ?)`, [userID, guildID, level, exp]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.sortLevelsLocal = function sortLevelsLocal(guildID, limit) {
			return _dbExist()
				.then((db) => {
					return db.all(`SELECT ${SQL_USER_ID}, ${SQL_LEVEL}, ${SQL_EXP} FROM ${SQL_TABLE_LOCAL} WHERE ${SQL_GUILD} = ? ORDER BY ${SQL_LEVEL} DESC, ${SQL_EXP} DESC LIMIT ${limit}`, [guildID]);
				}).then((rows) => {
					let arr = [];
					rows.forEach(row => {
						let data = {};
						data[SQL_USER_ID] = row[SQL_USER_ID];
						data[SQL_LEVEL] = row[SQL_LEVEL];
						arr.push(data);
					});
					return Promise.resolve(arr);	
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};
	}

};

function _initDb() {
	return _initGlobal()
		.then(_initLocal())
		.catch((error) => {
			console.error(error);
		});
}

function _initGlobal() {
	const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${SQL_TABLE_PROFILE}
    (
        ${SQL_USER_ID} TEXT NOT NULL UNIQUE,      
        ${SQL_LEVEL} INTEGER NOT NULL DEFAULT 0, 
        ${SQL_EXP} INTEGER NOT NULL DEFAULT 0,
        ${SQL_REP} INTEGER NOT NULL DEFAULT 0,
        ${SQL_BACKGROUND} TEXT,
        ${SQL_BIO} TEXT,
        ${SQL_TITLE} TEXT,
        ${SQL_BIRTHDAY_MONTH} INTEGER,
        ${SQL_BIRTHDAY_DAY} INTEGER,
		${SQL_AGE} INTEGER,
		${SQL_TICKETS} INTEGER,
        PRIMARY KEY ('${SQL_USER_ID}')
    )`;

	return db.run(sqlCreateTable);
}


function _dbExist() {
	if (!db) {
		return Promise.reject('Database does not exist');
	}
	return Promise.resolve(db);
}

function _initLocal() {
	const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${SQL_TABLE_LOCAL}
    (
        ${SQL_USER_ID} TEXT NOT NULL,   
        ${SQL_GUILD} TEXT NOT NULL,   
        ${SQL_LEVEL} INTEGER NOT NULL DEFAULT 0, 
        ${SQL_EXP} INTEGER NOT NULL DEFAULT 0,
        UNIQUE(${SQL_USER_ID}, ${SQL_GUILD}) ON CONFLICT IGNORE
    )`;

	return db.run(sqlCreateTable);
}