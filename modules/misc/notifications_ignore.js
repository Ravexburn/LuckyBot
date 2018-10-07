/*
 * Notifications Ignore
 * Author: OrigamiCoder
 */


const Discord = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const guildIgnored = new Enmap({ provider: new EnmapLevel({ name: 'ignored-guild' }) });
const userIgnored = new Enmap({ provider: new EnmapLevel({ name: 'ignored-user' }) });

const userDefault = {
	guilds: [],
	channels: []
}

const FUNCTION = "%FUNCTION%";
const PARAM = "%PARAM%";
const PARAM_VALUE = "%PARAM_VALUE%";
const errorMessage = `Error: Function '${FUNCTION}' called with invalid '${PARAM}': ${PARAM_VALUE}.`;

module.exports = class Notifications_Ignore {
	constructor() {
	}

    /*
     * Guild Ignore Settings
     */

    /**
     * Checks if a channel is ignored by a guild.
     * @param {string} guildID - The guild ID.
     * @param {string} channelID - The channel ID.
     * @returns {Promise<boolean>}
     */
	isGuildIgnoredChannel(guildID, channelID) {
		const functionName = this.isGuildIgnoredChannel.name;
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const guildIgnChannels = this.getGuildIgnoredChannels(guildID);
		return Promise.resolve(guildIgnChannels.includes(channelID));
	}

    /**
     * Gets guild's ignored channels.
     * @param {string} guildID - The guild ID.
     * @returns {string[]} array - Returns an empty array if doesn't exist.
     */
	getGuildIgnoredChannels(guildID) {
		let guildIgnChannels = null;
		if (guildIgnored.has(guildID)) {
			guildIgnChannels = guildIgnored.get(guildID);
		}
		if (!(Array.isArray(guildIgnChannels))) {
			guildIgnChannels = [];
		}
		if (!guildIgnChannels) {
			guildIgnChannels = [];
		}
		return guildIgnChannels;
	}

    /**
     * Sets guild's ignored channels.
     * @param {string} guildID 
     * @param {string[]} guildIgnChannels 
     */
	setGuildIgnoredChannels(guildID, guildIgnChannels) {
		guildIgnored.set(guildID, guildIgnChannels);
	}

    /**
     * Ignore channel for guild.
     * @param {string} guildID - The guild ID.
     * @param {string} channelID - The channel ID.
     * @returns {Promise}
     */
	guildIgnoreChannel(guildID, channelID) {
		const functionName = this.guildIgnoreChannel.name;
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const guildIgnChannels = this.getGuildIgnoredChannels(guildID);

		const result = _arrayAdd(guildIgnChannels, channelID);
		guildIgnored.set(guildID, guildIgnChannels);
		return Promise.resolve(result);
	}

    /**
     * Unignore channel for guild.
     * @param {string} guildID - The guild ID.
     * @param {string} channelID - The channel ID.
     * @returns {Promise}
     */
	guildUnignoreChannel(guildID, channelID) {
		const functionName = this.guildUnignoreChannel.name;
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const guildIgnChannels = this.getGuildIgnoredChannels(guildID);

		const result = _arrayRemove(guildIgnChannels, channelID);
		guildIgnored.set(guildID, guildIgnChannels);
		return Promise.resolve(result);
	}

    /**
     * Toggle ignore status of channel for guild.
     * @param {string} guildID - The guild ID.
     * @param {string} channelID - The channel ID.
     * @returns {Promise<number>}
     */
	guildToggleIgnoreChannel(guildID, channelID) {
		const functionName = this.guildToggleIgnoreChannel.name;
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const guildIgnChannels = this.getGuildIgnoredChannels(guildID);

		const result = _arrayToggle(guildIgnChannels, channelID);
		guildIgnored.set(guildID, guildIgnChannels);
		return Promise.resolve(result);
	}

    /*
     * User Ignore Settings - Guilds
     */

    /**
     * Checks if a guild is ignored by user.
     * @param {string} userID - The user ID.
     * @param {string} guildID - The guild ID.
     * @returns {Promise<boolean>}
     */
	isUserIgnoredGuild(userID, guildID) {
		const functionName = this.isUserIgnoredGuild.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}

		const userIgnGuilds = this.getUserIgnoredGuilds(userID);
		return Promise.resolve(userIgnGuilds.includes(guildID));
	}

    /**
     * Gets user's ignored guilds.
     * @param {string} userID - The user ID.
     * @returns {string[]} array - Returns an empty array if doesn't exist.
     */
	getUserIgnoredGuilds(userID) {
		const userIgn = _getUserIgnore(userID);

		let userIgnGuilds = null;
		if (userIgn) {
			userIgnGuilds = userIgn.guilds;
		}
		if (!(Array.isArray(userIgnGuilds))) {
			userIgnGuilds = [];
		}
		if (!userIgnGuilds) {
			userIgnGuilds = [];
		}
		return userIgnGuilds;
	}

    /**
     * Sets user's ignored guilds.
     * @param {string} userID - The user ID.
     * @param {string[]} userIgnGuilds - Array of ignored guilds.
     */
	setUserIgnoredGuilds(userID, userIgnGuilds) {
		const userIgn = _getUserIgnore(userID);
		userIgn.guilds = userIgnGuilds;
		_setUserIgnore(userID, userIgn);
	}

    /**
     * User ignores a guild.
     * @param {string} userID - The user ID.
     * @param {string} guildID - The guild ID.
     */
	userIgnoreGuild(userID, guildID) {
		const functionName = this.userIgnoreGuild.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}

		const userIgnGuilds = this.getUserIgnoredGuilds(userID);

		const result = _arrayAdd(userIgnGuilds, guildID);
		this.setUserIgnoredGuilds(userID, userIgnGuilds);
		return Promise.resolve(result);
	}
    /**
     * User unignores a guild.
     * @param {string} userID - The user ID.
     * @param {string} guildID - The guild ID.
     */
	userUnignoreGuild(userID, guildID) {
		const functionName = this.userUnignoreGuild.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}

		const userIgnGuilds = this.getUserIgnoredGuilds(userID);

		const result = _arrayRemove(userIgnGuilds, guildID);
		this.setUserIgnoredGuilds(userID, userIgnGuilds);
		return Promise.resolve(result);
	}
    /**
     * User toggles the ignore status of a guild.
     * @param {string} userID - The user ID.
     * @param {string} guildID - The guild ID.
     */
	userToggleIgnoreGuild(userID, guildID) {
		const functionName = this.userToggleIgnoreGuild.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!guildID) {
			return Promise.reject(_rejectMessage(functionName, "guildID", guildID));
		}

		const userIgnGuilds = this.getUserIgnoredGuilds(userID);

		const result = _arrayToggle(userIgnGuilds, guildID);
		this.setUserIgnoredGuilds(userID, userIgnGuilds);
		return Promise.resolve(result);
	}

    /*
     * User Ignore Settings - Channels
     */

    /**
     * Checks if a channel is ignored by user.
     * @param {string} userID - The user ID.
     * @param {string} guildID - The guild ID.
     * @returns {Promise<boolean>}
     */
	isUserIgnoredChannel(userID, channelID) {
		const functionName = this.isUserIgnoredChannel.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const userIgnChannels = this.getUserIgnoredChannels(userID);
		return Promise.resolve(userIgnChannels.includes(channelID));
	}

    /**
     * Gets user's ignored channels.
     * @param {string} userID - The user ID.
     * @returns {string[]} array - Returns an empty array if doesn't exist.
     */
	getUserIgnoredChannels(userID) {
		const userIgn = _getUserIgnore(userID);

		let userIgnChannels = null;
		if (userIgn) {
			userIgnChannels = userIgn.channels;
		}
		if (!(Array.isArray(userIgnChannels))) {
			userIgnChannels = [];
		}
		if (!userIgnChannels) {
			userIgnChannels = [];
		}
		return userIgnChannels;
	}

    /**
     * Sets user's ignored channels.
     * @param {string} userID - The user ID.
     * @param {string[]} userIgnChannels - Array of ignored channels.
     */
	setUserIgnoredChannels(userID, userIgnChannels) {
		const userIgn = _getUserIgnore(userID);
		userIgn.channels = userIgnChannels;
		_setUserIgnore(userID, userIgn);
	}

    /**
     * User ignores a channel.
     * @param {string} userID - The user ID.
     * @param {string} channelID - The channel ID.
     */
	userIgnoreChannel(userID, channelID) {
		const functionName = this.userIgnoreChannel.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const userIgnChannels = this.getUserIgnoredChannels(userID);

		const result = _arrayAdd(userIgnChannels, channelID);
		this.setUserIgnoredChannels(userID, userIgnChannels);
		return Promise.resolve(result);
	}
    /**
     * User unignores a channel.
     * @param {string} userID - The user ID.
     * @param {string} channelID - The channel ID.
     */
	userUnignoreChannel(userID, channelID) {
		const functionName = this.userUnignoreChannel.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const userIgnChannels = this.getUserIgnoredChannels(userID);

		const result = _arrayRemove(userIgnChannels, channelID);
		this.setUserIgnoredChannels(userID, userIgnChannels);
		return Promise.resolve(result);
	}
    /**
     * User toggles the ignore status of a channel.
     * @param {string} userID - The user ID.
     * @param {string} channelID - The channel ID.
     */
	userToggleIgnoreChannel(userID, channelID) {
		const functionName = this.userToggleIgnoreChannel.name;
		if (!userID) {
			return Promise.reject(_rejectMessage(functionName, "userID", userID));
		}
		if (!channelID) {
			return Promise.reject(_rejectMessage(functionName, "channelID", channelID));
		}

		const userIgnChannels = this.getUserIgnoredChannels(userID);

		const result = _arrayToggle(userIgnChannels, channelID);
		this.setUserIgnoredChannels(userID, userIgnChannels);
		return Promise.resolve(result);
	}
}

/**
 * Gets user ignore object.
 * @param {string} userID - The user ID.
 */
function _getUserIgnore(userID) {
	if (!userIgnored.has(userID)) {
		userIgnored.set(userID, userDefault);
	}
	const userIgn = userIgnored.get(userID);

	_setupUserIgnore(userIgn);

	return userIgn;
}

/**
 * Sets user ignore object.
 * @param {string} userID 
 * @param {object} userIgn 
 */
function _setUserIgnore(userID, userIgn) {
	if (userIgn) {
		_setupUserIgnore(userIgn);
	}
	userIgnored.set(userID, userIgn);
}

/**
 * Sets up object structure.
 * @param {object} userIgn 
 */
function _setupUserIgnore(userIgn) {
	for (let key in userDefault) {
		if (!(userIgn.hasOwnProperty(key))) {
			userIgn[key] = userDefault[key];
		}
	}
	return userIgn;
}

/**
 * Adds an element if value doesn't exist. Returns true if the value was added successfully.
 * @param {string[]} array - The array.
 * @param {string} value - The value.
 * @returns {boolean} success - Whether the value was added successfully.
 */
function _arrayAdd(array, value) {
	const index = array.indexOf(value);
	if (index !== -1) {
		return false;
	}
	array.push(value);
	return true;
}

/**
 * Removes an element if value exists. Returns true if the value was removed successfully.
 * @param {string[]} array - The array.
 * @param {string} value - The value.
 * @returns {boolean} success - Whether the value was removed successfully.
 */
function _arrayRemove(array, value) {
	const index = array.indexOf(value);
	if (index === -1) {
		return false;
	}
	array.splice(index, 1);
	return true;
}

/**
 * Removes an element if value exists. Returns 1, if the value was added. Returns -1, if the value was removed.
 * @param {string[]} array - The array.
 * @param {string} value - The value.
 * @returns {number} result - 1, if the value was added. -1, if the value was removed.
 */
function _arrayToggle(array, value) {
	const index = array.indexOf(value);
	if (index === -1) {
		array.push(value);
		return 1;
	} else {
		array.splice(index, 1);
		return -1;
	}
}

/**
 * Creates a reject message.
 * @param {string} functionName 
 * @param {string} paramName 
 * @param {string} paramValue 
 */
function _rejectMessage(functionName, paramName, paramValue) {
	let msg = errorMessage.replace(FUNCTION, functionName)
		.replace(PARAM, paramName).replace(PARAM_VALUE, paramValue.toString());
	return msg;
}