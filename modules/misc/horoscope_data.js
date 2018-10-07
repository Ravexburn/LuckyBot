const sql = require("sqlite");
const mkdirp = require("mkdirp");

const SQL_FILE = "./data/lastfm/horoscope.sqlite";

const SQL_TABLE_PROFILE = "horoscope";
const SQL_USER_ID = "user_id";
const SQL_SIGN = "sunsign";

let db = null;
module.exports = class Horoscope {
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
	
		this.getHoroscopeData = function getHoroscopeData(userID) {
			return _dbExist()
				.then((db) => {
					return db.get(`SELECT * FROM ${SQL_TABLE_PROFILE} WHERE ${SQL_USER_ID} = ?`, [userID]);
				}).then((row) => {
					if (!row) {
						let data = {};
						data[SQL_SIGN] = null;
						data[SQL_USER_ID] = userID;
						return Promise.resolve(data);
					}
					let data = {};
					data[SQL_SIGN] = row[SQL_SIGN];
					data[SQL_USER_ID] = row[SQL_USER_ID];
					return Promise.resolve(data);
				}).catch((reason) => {
					return Promise.reject(reason);
				});
		};
	
		this.setSign = function setSign(userID, sunsign) {
			return _dbExist()
				.then((db) => {
					return db.run(`UPDATE ${SQL_TABLE_PROFILE} SET ${SQL_SIGN} =? WHERE ${SQL_USER_ID} =?`, [sunsign, userID]);
				}).then((statement) => {
					if (statement.stmt.changes === 0) {
						return db.run(`INSERT INTO ${SQL_TABLE_PROFILE} (${SQL_USER_ID}, ${SQL_SIGN}) VALUES (?, ?)`, [userID, sunsign]);
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
        ${SQL_SIGN} TEXT,
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