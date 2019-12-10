const Discord = require("discord.js");
const botSettings = require("./botsettings.json");
const InvCache = require("./modules/modding/invites");
const bot = new Discord.Client({ disableEveryone: true, messageCacheMaxSize: 100 });
bot.botSettings = botSettings;
bot.invCache = new InvCache(bot);

//Required Files

require("./server_settings.js")(bot);
require("./handlers/messagehnd.js")(bot);
require("./handlers/msgupdate.js")(bot);
require("./handlers/guildmemberadd.js")(bot);
//require("./handlers/guildcreate.js")(bot);
//require("./handlers/guilddelete.js")(bot);
require("./handlers/msgdelete.js")(bot);
require("./handlers/memberleave.js")(bot);
require("./functions/functions.js")(bot);

//Generates join link and shows ready status.

bot.on("ready", async () => {
	bot.log('Ready');
	try {
		let link = await bot.generateInvite();
		console.log(link);
	} catch (error) {
		bot.log(error.stack);
	}
	bot.user.setActivity(`on ${bot.guilds.size} servers | ${botSettings.prefix}help for list of commands`);
	bot.guilds.forEach(guild => {
		bot.invCache.guildInvites(guild).catch(console.error);
	});
});

//When the bot joins a server.

bot.on("guildCreate", guild => {
	bot.invCache.guildInvites(guild).catch(console.error);
	bot.user.setActivity(`on ${bot.guilds.size} servers | ${botSettings.prefix}help for list of commands`);
	//guildCreateHandler(guild);
});

//When the bot leaves a server. 

bot.on("guildDelete", guild => {
	bot.user.setActivity(`on ${bot.guilds.size} servers | ${botSettings.prefix}help for list of commands`);
	//guildDeleteHandler(guild);
});

//When a message is created.

bot.on("message", async message => {
	msgHandler(message);
});

//When a message is updated.

bot.on("messageUpdate", (oldMessage, message) => {
	msgUpdateHandler(oldMessage, message);
});

//When a reaction is added to a message.

bot.on("messageReactionAdd", async message => {
	reactHandler(message);
});

//When a reaction is removed from a message.

bot.on("messageReactionRemove", async message => {
	reactHandler(message);
});

//When a message is deleted.

bot.on("messageDelete", message => {
	delHandler(message);
});

//When a member joins a server.

bot.on("guildMemberAdd", member => {
	memberJoinHandler(member);
});

//When a member leaves a server.

bot.on("guildMemberRemove", member => {
	leaveHandler(member);
});

//Whenever a connection error occurs.

bot.on("error", error => {
	bot.log(error);
});

//General Debug info.

bot.on("debug", debug => {
	bot.log(debug);
});

//General Warnings

bot.on("warn", warning => {
	bot.log(warning);
});

//Handle raw events for non-cached messages

bot.on('raw', packet => {
	//This list can be expanded if we need to parse more types of raw events
	if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

	const channel = bot.channels.get(packet.d.channel_id);
	if (channel.messages.has(packet.d.message_id)) return;

	channel.fetchMessage(packet.d.message_id).then(message => {

		//Reaction handling
		const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
		const reaction = message.reactions.get(emoji);
		if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
		if (packet.t === 'MESSAGE_REACTION_ADD') {
			bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
		}
		if (packet.t === 'MESSAGE_REACTION_REMOVE') {
			bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
		}
	});
});


bot.login(botSettings.token);

//SHIFT ALT F to format