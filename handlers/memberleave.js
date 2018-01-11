module.exports = (bot = Discord.Client) => {

    //Requires

    require("./../modules/messagelogs.js")(bot);

    leaveHandler = async function leaveHandler(member) {

        //Functions

        leaveMsg(member);

    };
}