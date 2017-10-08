
const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Insert Token Here';
const geoffToken = 'Insert Token Here';

const commandhandler = require("./commandhandler.js").init();
const geoff = require("./geoff.js");

bot.on('ready', () => {
	console.log('I am ready!');
});

// create an event listener for messages
bot.on('message', message => {
	if (message.author != bot.user) {
		commandhandler.executeName(message);
		geoff.run(message);
	}
});

// log our bot in
bot.login(geoffToken);

