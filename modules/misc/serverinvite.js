const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	serverInvite = async function serverInvite(message, helpServer) {
		let dmMsg = await message.author.send(`Want ${bot.user.username} for your server? Have any questions on how to use ${bot.user.username}? Join here ${helpServer} and make sure to read the welcome channel!`).catch(console.error);

		if (!dmMsg) {
			message.channel.send("I am unable to send a DM to you. Please check your settings and try again!").catch(console.error);
		} else {
			message.channel.send(`Sent a DM <:luckysushi:418558090682695681>`).catch(console.error);
		}

		return;
	};

};