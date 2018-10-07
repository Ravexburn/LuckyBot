/**
 * Invites Caching Class
 * (To attempt to determine which invite was used)
 * Author: OrigamiCoder
 */

const Discord = require("discord.js");
const Client = Discord.Client;
const Guild = Discord.Guild;
const Invite = Discord.Invite;
const Collection = Discord.Collection;

const invitesCache = new Collection();

const Messages = {

};

/**
 * Stores data for an invite
 * @param {Invite} [invite] - The invite.
 * @returns {void}
 */
const inviteData = function (invite) {
	this.code = invite.code || "";
	this.guild = invite.guild.id || "";
	this.inviter = getInviterID(invite);
	this.createdTimestamp = invite.createdTimestamp || 0;
	this.uses = invite.uses || 0;
};

module.exports = class InvitesCache {
	constructor(client = Client, debug = () => { }) {

		this.debug = client.debug || debug;

		/**
         * Caches invites for a Guild
         * @param {Guild} [guild] - The guild.
         * @returns {Promise<Collection<string,any>>}
         */
		this.cacheGuildInvites = function cacheGuildInvites(guild) {
			this.debug(`Caching invites for [${guild.name}].`);
			const guildInvitesCache = new Discord.Collection();
			return fetchInvites(guild)
				.then(invites => {
					this.debug("invites: ", invites);
					invites.forEach((invite, key) => {
						const inviterID = getInviterID(invite);
						this.debug(`${invite.code} : ${inviterID} [${invite.uses}]`);

						const data = new inviteData(invite);
						guildInvitesCache.set(invite.code, data);
					});
					return Promise.resolve(guildInvitesCache);
				}).then(guildInvitesCache => {
					invitesCache.set(guild.id, guildInvitesCache);
					this.debug(invitesCache);
					return Promise.resolve(invitesCache);
				}).catch(reason => {
					return Promise.reject(reason);
				});
		};

		/**
         * Caches invites for a Guild
         * @param {Guild} [guild] - The guild.
         * @returns {Promise<Collection<string,any>>}
         */
		this.guildInvites = this.cacheGuildInvites;

		/**
         * Identifies and returns invites with changed uses for a Guild
         * @param {Guild} [guild] - The guild.
         * @returns {Promise<?Invite>}
         */
		this.usedInvite = function usedInvite(guild) {
			let guildInvitesCache = new Discord.Collection();
			return getInvitesCache(guild)
				.then(invites => {
					guildInvitesCache = invites;
					return fetchInvites(guild);
				}).then(invites => {
					const guildUsedInvites = new Discord.Collection();
					invites.forEach((invite, key) => {
						const inviterID = getInviterID(invite);
						this.debug(`${invite.code} : ${inviterID} [${invite.uses}]`);

						if (guildInvitesCache.has(invite.code)) {
							// Compare
							const inv = guildInvitesCache.get(invite.code);
							const cacheUses = inv.uses;
							const currentUses = invite.uses;
							if (currentUses !== cacheUses) {
								inv.uses = cacheUses + 1;
								guildInvitesCache.set(invite.code, inv);
								guildUsedInvites.set(invite.code, invite);
							}
						} else {
							const data = new inviteData(invite);
							guildInvitesCache.set(invite.code, data);
							if (invite.uses === 1) {
								guildUsedInvites.set(invite.code, invite);
							}
						}
					});
					invitesCache.set(guild.id, guildInvitesCache);
					this.debug(guildUsedInvites);
					return Promise.resolve(guildUsedInvites);
				}).then(guildUsedInvites => {
					if (guildUsedInvites.size !== 1) {
						// Uncertain?
						// Some error occurred with caching?
						return Promise.reject(`Error: ${guildUsedInvites.size} invites returned. (Expected 1)`);
					}
					this.debug("Used invite: ", guildUsedInvites.first());
					return Promise.resolve(guildUsedInvites.first());
				}).catch(reason => {
					// console.error(reason);
					return Promise.reject(reason);
				});
		};

		/**
         * Clears cached invites for a Guild
         * @param {Guild} [guild] - The guild.
         * @returns {Promise<boolean>} - Returns true if guild had a cache that was cleared, or false if guild had no cache.
         */
		this.clearGuildInvites = function clearGuildInvites(guild) {
			this.debug(`Clearing cached invites for [${guild.name}].`);
			return Promise.resolve(invitesCache.delete(guild.id));
		};
	}
};

/**
 * Get guild ID
 * @param {Guild|string} guild
 * @returns {?string} The guild ID or null if invalid parameter
 */
function getGuildID(guild) {
	// client.debug("function getGuildID");
	// client.debug(typeof guild);
	let idString = null;
	if (guild instanceof Guild) {
		idString = guild.id;
	} else if (guild instanceof String) {
		idString = guild;
	}
	// client.debug(`Guild ID: ${idString}`);
	return idString;
}

/**
 * Fetch invites for guild or ID.
 * @param {Guild|string} guild
 * @returns {Promise<Collection<string, Invite>>} invites
 */
function fetchInvites(guild) {
	if (!(guild instanceof Guild)) {
		return Promise.reject(`Invalid or Missing guild parameter.`);
	}
	if (!guild.me) {
		return Promise.reject(`Not a member of [${guild.name}].`);
	}
	if (!guild.me.hasPermission("MANAGE_GUILD")) {
		return Promise.reject(`Couldn't get invites for [${guild.name}] (Missing 'MANAGE_GUILD' permission).`);
	}
	return guild.fetchInvites();
}


/**
 * Get Invites Cache
 * @param {Guild} guild
 * @returns {Promise<Collection<string, Invite>>}
 */
function getInvitesCache(guild) {
	const guildID = getGuildID(guild);
	const guildInvitesCache = invitesCache.get(guildID);
	if (!guildInvitesCache) {
		return Promise.reject(`Couldn't get cached invites for [${guild.name}].`);
	}
	return Promise.resolve(guildInvitesCache);
}
/**
 * Get Invites Cache
 * @param {Guild} guild
 * @returns {Promise<Collection<string, Invite>>}
 */
function getCachedInvites(guild) {
	return getInvitesCache(guild);
}

/**
 * Get inviter ID
 * @param {Invite} invite
 * @returns {?string} id - The inviter ID or empty string if none.
 */
function getInviterID(invite) {
	// return ((invite.inviter) ? invite.inviter.id : "");

	if (invite.inviter) {
		return invite.inviter.id;
	} else {
		return "";
	}
}