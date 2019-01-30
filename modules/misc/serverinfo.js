const Discord = require("discord.js");

module.exports = (bot = Discord.Client) => {

	const region = {
		"amsterdam": ":flag_nl: Amsterdam",
		"brazil": ":flag_br: Brazil",
		"eu-central": ":flag_eu: EU Central",
		"eu-west": ":flag_eu: EU West",
		"frankfurt": ":flag_de: Frankfurt",
		"hongkong" : ":flag_hk: Hong Kong",
		"japan": ":flag_jp: Japan",
		"london": ":flag_gb: London",
		"russia": ":flag_ru: Russia",
		"singapore": ":flag_sg: Singapore",
		"southafrica": ":flag_za: South Africa",
		"sydney": ":flag_au: Sydney",
		"us-central": ":flag_us: US Central",
		"us-east": ":flag_us: US East",
		"us-south": ":flag_us: US South",
		"us-west": ":flag_us: US West"
	};

	serverInfo = function serverInfo(message) {

		let embed = new Discord.RichEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL)
			.setColor("#a8e8eb")
			.setThumbnail(message.guild.iconURL)
			.setURL(message.guild.iconURL)
			.addField("Server created on", message.guild.createdAt.toLocaleString(), true)
			.addField("Owner", message.guild.owner.user.tag, true)
			.addField("Region", region[message.guild.region], true)
			.addField("Members", message.guild.memberCount, true)
			.addField("Roles", message.guild.roles.size, true)
			.addField("Text Channels", message.guild.channels.array().filter(channel => channel.type === "text").length, true)
			.addField("Voice Channels", message.guild.channels.array().filter(channel => channel.type === "voice").length, true)
			.setFooter(`Server ID: ${message.guild.id}`);
		message.channel.send(embed).catch(console.error);
		return;
	};

};