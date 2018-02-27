const Discord = require("discord.js");
const Message = Discord.Message;

module.exports = (bot = Discord.Client) => {

    //Help command for General Commands
    generalHelp = function generalHelp(message, prefix, embed) {
        embed.addField(":information_source: Information", `\*\* ${prefix}help\*\* - Shows this list of commands.
\*\* ${prefix}mod\*\* - Sends a list of mod commands in direct messages.
\*\* ${prefix}userinfo\*\* - Shows a user's information.
\*\* ${prefix}serverinfo\*\* - Shows the server's information.
\*\* ${prefix}botinfo\*\* - Shows Lucky Bot's information.
\*\* ${prefix}trello\*\* - Sends a link to Lucky Bot's trello page.
\*\* ${prefix}github\*\* - Sends a link to Lucky Bot's github page.
\*\* ${prefix}issue\*\* - Please report any issues you are having with Lucky Bot using this command.
\*\* ${prefix}suggestion\*\* - Have a suggestion for Lucky Bot? Use this command to have it heard!`)
    }

    //Help command for Notifications
    notifyHelp = function notifyHelp(message, prefix, embed) {
        embed.addField(":round_pushpin: Notificatons", `\*\* ${prefix}notify\*\* - Shows this list of commands for notifications.
\*\* ${prefix}notify list\*\* - Direct messages a list of keywords for the server.
\*\* ${prefix}notify clear\*\* - Removes all keywords for the server.
\*\* ${prefix}notify add <keyword>\*\* - Adds a <keyword> to notify you about on the server.
\*\* ${prefix}notify remove <keyword>\*\* - Removes a <keyword> you were notified about on the server.
\*\* ${prefix}notify global list\*\* - Direct messages a list of global keywords.
\*\* ${prefix}notify global clear\*\* - Removes all global keywords you have.
\*\* ${prefix}notify global add <keyword>\*\* - Adds a <keyword> to notify you about on all servers.
\*\* ${prefix}notify global remove <keyword>\*\* - Removes a <keyword> you were notified about on all servers.
\*\* ${prefix}notify ignore <channel> <#channel>\*\* - Ignores all keyword triggers in <#channel>.
\*\* ${prefix}notify ignore server\*\* - Ignores all keyword triggers in the server.`)
    }

    //Help command for Custom Commands
    commandsHelp = function commandsHelp(message, prefix, embed) {
        embed.addField(":speech_left: Custom Commands", `\*\* ${prefix}command\*\* - Shows this list of commands for commands.
\*\* ${prefix}command list\*\* - Direct messages a list of custom commands on the server.
\*\* ${prefix}command add <name> <command>\*\* - Adds a custom command to the server.
\*\* ${prefix}command remove <name> <command>\*\* - Removes a custom command on the server.
\*\* ${prefix}command edit <name> <command>\*\* - Edits a custom command on the server.`)
    }

    //Help command for Roles
    rolesHelp = function rolesHelp(message, prefix, embed) {
        embed.addField(":art: Roles", `\*\*+<role> \*\* - Allows user to add the <role>.
\*\*-<role> \*\* - Allows user to remove the <role>.
:warning: When adding and removing roles, names must match role name exactly!`)
    }

    //Help for Server Commands
    ownerServerHelp = function ownerServerHelp(message, prefix, embed) {
            embed.addField(":speech_left: Sever Commands", `\*\* ${prefix}server\*\* - Shows this list of commands for server.
\*\* ${prefix}server list\*\* - Shows the servers Lucky Bot is in.
\*\* ${prefix}server leave\*\* - Allows Lucky Bot to leave a server it is in.`)
    }

    //Help for Relay Commands
    relayHelp = function relayHelp(message, prefix, embed) {
            embed.addField(":arrows_counterclockwise: Relay", `\*\* ${prefix}relay\*\* - Shows this list of commands for relay.
\*\* ${prefix}relay list\*\* - Shows existing relays.
\*\* ${prefix}relay toggle <name>\*\* - Toggles embed on the relay.
\*\* ${prefix}relay start <name> <type> <chanID1> <chanID2>\*\* - Starts a relay of <type> between at least two channels.
\*\* ${prefix}relay add <name> <chanID>\*\* - Adds a channel to an existing relay.
\*\* ${prefix}relay remove <name> <chanID>\*\* - Removes a channel from an existing relay.
\*\* ${prefix}relay delete <name>\*\* - Deletes an existing relay.`)
    }

}