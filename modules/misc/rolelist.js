const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	require("../../functions/helpfunctions.js")(bot);

	rolelist = function rolelist(message) {

		let i = 1;
		let roles = message.guild.roles.array().sort((a,b) => b.position - a.position).map(x => `${i++}. ${x.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (#${x.id}, ${x.hexColor})`);

		var pages = toEmbedPages(roles);

		let embed = new Discord.RichEmbed()
			.setColor("#FFAEB9")
			.setAuthor(`Roles for ${message.guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
		embedPages(message, embed, pages);
		return;
	};

	memberCount = function memberCount(message){

		let i = 1;
		let roles = message.guild.roles.array().sort((a,b) => b.position - a.position).map(x => `${i++}. ${x.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \`# of members: ${x.members.size}\``);

		var pages = toEmbedPages(roles);

		let embed = new Discord.RichEmbed()
			.setColor("#FFAEB9")
			.setAuthor(`Bias stats for ${message.guild.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
		embedPages(message, embed, pages);
		return;
	};

};
