const sql = require("sqlite");
const mkdirp = require("mkdirp");

const SQL_FILE = "./data/lastfm/lastfm.sqlite";

const SQL_TABLE_PROFILE = "lastfm";
const SQL_USER_ID = "user_id";
const SQL_USERNAME = "username";
const SQL_LAYOUT = "layout";

let db = null;
module.exports = class Lastfm {
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

		this.getLastfmData = function getLastfmData(userID) {
			return _dbExist()
				.then((db) => {
					return db.get(`SELECT * FROM ${SQL_TABLE_PROFILE} WHERE ${SQL_USER_ID} = ?`, [userID]);
				}).then((row) => {
					if (!row) {
						let data = {};
						data[SQL_USERNAME] = null;
						data[SQL_LAYOUT] = null;
						data[SQL_USER_ID] = userID;
						return Promise.resolve(data);
					}
					let data = {};
					data[SQL_USERNAME] = row[SQL_USERNAME];
					data[SQL_LAYOUT] = row[SQL_LAYOUT];
					data[SQL_USER_ID] = row[SQL_USER_ID];
					return Promise.resolve(data);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setProfile = function setProfile(userID, username, layout) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_USERNAME} =?, ${SQL_LAYOUT} = ? WHERE ${SQL_USER_ID} =?`, [username, layout, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_USERNAME}, ${SQL_LAYOUT}) VALUES (?, ?, ?)`, [userID, username, layout]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setUsername = function setUsername(userID, username) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_USERNAME} =? WHERE ${SQL_USER_ID} =?`, [username, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_USERNAME}) VALUES (?, ?)`, [userID, username]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

		this.setLayout = function setLayout(userID, layout) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_LAYOUT} =? WHERE ${SQL_USER_ID} =?`, [layout, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_LAYOUT}) VALUES (?, ?)`, [userID, layout]);
					}
				}).then(() => {
					return Promise.resolve(true);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};

	}
};

function _initDb() {
	return _initGlobal()
		.catch((error) => {
			console.error(error);
		});
}

function _initGlobal() {
	const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${SQL_TABLE_PROFILE}
    (
        ${SQL_USER_ID} TEXT NOT NULL UNIQUE,      
        ${SQL_USERNAME} TEXT,
        ${SQL_LAYOUT} INTEGER,
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