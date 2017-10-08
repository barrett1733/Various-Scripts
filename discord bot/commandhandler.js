const modules = [];
const commandIdentifier = '!';

var commands = [];

exports.init = function () {
	if (commands.length == 0) {
		modules.push(require("./commands/general.js"));
		modules.push(require("./commands/audio.js"));
		modules.forEach(function (module) {
			module.commands.forEach(function (command) {
				commands.push(module[command]);
			})
		})
	}
	return this;
};
	
exports.exists = function (message) {
	for (var index = 0; index < commands.length; index++) {
		if (commands[index].regex.test(message.content)) {
			return true;
		}
	}
	return false;
};
	
function getArgs(message) {
	var args = message.content.split(" ");
	args.shift();
	return args;
};

exports.executeName = function (message) {
	commands.forEach(function (command) {
		if (message.content.startsWith(commandIdentifier + command.name)) {
			if (command.name == "help")
				command.call(message, [false, commands]);
			else
				command.call(message, getArgs(message));
		}
	});
};
	
exports.executeRegex = function (message) {
	commands.forEach(function (command) {
		if (command.regex.test(message.content)) {
			if (command.name == "help")
				command.call(message, [true, commands]);
			else
				command.call(message, message.content.split(command.regex)[1].trim().split(" "));
		}
	});
};

