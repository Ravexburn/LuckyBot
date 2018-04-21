module.exports = (bot = Discord.Client) => {

	//Requires

	require("./../modules/messagelogs.js")(bot);

	leaveHandler = async function leaveHandler(member) {

		if (!message.member && message.guild) {
			bot.fetchMember(message.author.id);
		}

		//Functions

		leaveMsg(member);

	};
};