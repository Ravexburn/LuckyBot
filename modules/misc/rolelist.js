const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	rolelist = function rolelist(message) {

		require("../../functions/helpfunctions.js")(bot);

		let roles = message.guild.roles.array().sort((a,b) => b.position - a.position).map(x => `${x.name} (\`#${x.id}\`, \`${x.hexColor}\`) \`# of members: ${x.members.size}\``);

		var pages = toEmbedPages(roles);

		let embed = new Discord.RichEmbed()
			.setColor("#FFAEB9")
			.setAuthor(`Roles for ${message.guild.name}`);
		embedPages(message, embed, pages);
		return;
	};
};
