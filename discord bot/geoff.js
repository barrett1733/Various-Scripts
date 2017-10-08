const geoffResponse = require("./geoff response.js");
const commandhandler = require("./commandhandler.js").init();

exports.run = function(message) {
	const geoffRegex = /g+e+o+f+f+/i;
    if (geoffRegex.test(message.content) || message.isMentioned(message.client.user)) {
		if (commandhandler.exists(message))
			commandhandler.executeRegex(message);
		else {
			let msgOut = '<:silverfish:287146587149303809>';
			msgOut += geoffResponse.run(message);
			message.channel.send(msgOut);
		}
    }
}
