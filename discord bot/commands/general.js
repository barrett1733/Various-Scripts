exports.commands = [
    "botquit",
    "help"
];

exports.botquit = {
	name: 'botquit',
	regex: /command.*bot.*quit/i,
	desc: "Unused",
	call: function (message, args) {
		message.client.destroy((err) => {
			console.log(err);
		});
	}
}

exports.help = {
	name: 'help',
	regex: /(?:list.*abilities)|(?:what.*do)|(?:help)/i,
	desc: "Display this menu",
	call: function (message, args) {
		if (args[0]) {
			var out = "I can:\n";
			args[1].forEach(function (element) {
				if (element.desc != "Unused")
					out += element.desc + "\n";
			});
			message.channel.send(out);
		}
		else {
			var out = "List of commands:\n";
			args[1].forEach(function (element) {
				if (element.desc != "Unused")
					out += "!" + element.name + " - " + element.desc + "\n";
			});
			message.channel.send(out);			
		}
	}
}
