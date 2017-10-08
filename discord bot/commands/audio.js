const ytdl = require('ytdl-core');
const auth = require('./auth.js');
const streamOptions = { seek: 0, volume: 1 };
const ytregex = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/i

const apikey = "AIzaSyCGeVU30mQeInk8jSHP8vK5z_-CDRQ_0Gg";

var globalQueue = [];
var playerState = "stopped";
var globalVolume = 1;

const volumeMax = 2;
const volumeMin = 0.01;

exports.commands = [
    "whoareyou",
    "leave",
    "join",
	"play",
	"pause",
	"stop",
	"resume",
	"volumecurrent",
	"volumeset",
	"volumeup",
	"volumedown",
	"queue",
	"enqueue",
    "dequeue"
    //"search"
];

exports.whoareyou = {
	name: 'whoareyou',
	regex: /(?:who)|(?:what).*are.*you/i,
	desc: "Tell my origin",
	call: function (message, args) {
		const link = "https://www.youtube.com/watch?v=GNakA3i4h14";
		exports.play.call(message, [link]);
	}
}

exports.leave = {
	name: 'leave',
	regex: /leave/i,
	desc: "Leave the voice chat",
	call: function (message) {
		message.member.voiceChannel.leave();
	}
}

exports.join = {
	name: 'join',
	regex: /join/i,
	desc: "Join the voice chat",
	call: function (message) {
		if (message.member.voiceChannel == null)
			message.channel.send("You are not in a voice channel");
		else
			message.member.voiceChannel.join();
	}
}

exports.play = {
	name: 'play',
	regex: /play/i,
	desc: "Play audio from youtube link",
	call: function (message, args) {
        if (args.length > 0)
            exports.enqueue.call(message, args);

		if (globalQueue.length == 0) 
            message.channel.send("Nothing to play");
        else {
			if (message.member.voiceChannel == null)
				message.channel.send("You are not in a voice channel");
            else {
                playerState = "playing";
                playQueue(message);
            }
		}
	}
}

exports.pause = {
	name: 'pause',
	regex: /pause/i,
	desc: "Pause the current audio",
    call: function (message, args) {
        playerState = "paused";
        const voiceConnection = message.client.voiceConnections.get(message.guild.id);
        if (voiceConnection && voiceConnection.player.dispatcher)
            voiceConnection.player.dispatcher.pause();
	}
}

exports.stop = { 
	name: 'stop',
	regex: /stop/i,
	desc: "Stop playing the current audio and leave",
    call: function (message, args) {
        playerState = "stopped";
        const voiceConnection = message.client.voiceConnections.get(message.guild.id);
        if (voiceConnection && voiceConnection.player.dispatcher)
            voiceConnection.player.dispatcher.end();
	}
}

exports.resume = {
	name: 'resume',
	regex: /resume/i,
	desc: "Resume playing the current audio",
    call: function (message, args) {
        playerState = "playing";
        const voiceConnection = message.client.voiceConnections.get(message.guild.id);
        if (voiceConnection && voiceConnection.player.dispatcher)
            voiceConnection.player.dispatcher.resume();
	}
}

exports.volumecurrent = {
	name: 'volumecurrent',
	regex: /current.*volume/i,
	desc: "Display current volume",
	call: function(message, args) {
        message.channel.send("Current volume is " + globalVolume * 100 + "%");
	}
}

exports.volumeset = {
	name: 'volumeset',
	regex: /(?:set|change).*volume/i,
	desc: "Change the volume to 1 ~ 200",
	call: function (message, args) {
		const newvol = args.filter(function (e){
			if (!isNaN(e))
				return +e;
        })[0];

        if (newvol / 100 >= volumeMin && newvol / 100 <= volumeMax) {
            globalVolume = newvol / 100;
            const voiceConnection = message.client.voiceConnections.get(message.guild.id);
            if (voiceConnection && voiceConnection.player.dispatcher) {
                voiceConnection.player.dispatcher.setVolume(globalVolume);
		    }
        }
		else
			message.channel.send("Out of range. 1 ~ 200");
	}
}

exports.volumeup = {
	name: 'volumeup',
	regex: /increase.*volume/i,
	desc: "Increase the volume by 10",
	call: function (message, args) {
        globalVolume += 0.1;
        const voiceConnection = message.client.voiceConnections.get(message.guild.id);
        if (voiceConnection && voiceConnection.player.dispatcher && globalVolume < volumeMax) {
            voiceConnection.player.dispatcher.setVolume(globalVolume);
        }
	}
}

exports.volumedown = {
	name: 'volumedown',
	regex: /decrease.*volume/i,
	desc: "Decrease the volume by 10",
	call: function (message, args) {
        globalVolume -= 0.1;
        const voiceConnection = message.client.voiceConnections.get(message.guild.id);
        if (voiceConnection && voiceConnection.player.dispatcher && globalVolume > volumeMin) {
            voiceConnection.player.dispatcher.setVolume(globalVolume);
        }
	}
}

exports.queue = {
	name: 'queue',
    regex: /(?:show|display|what).*queue/i,
	desc: "Displays queue",
    call: function (message, args) {
        if (globalQueue.length == 0)
            message.channel.send("Queue empty");
        else {
            let out = "Queue:\n";
            for (let index = 0; index < globalQueue.length; index++) {
                out += index + ": " + globalQueue[index] + "\n";
            }
            message.channel.send(out);
        }
	}
}

exports.enqueue = {
	name: 'enqueue',
    regex: /enqueue/i,
	desc: "Adds to queue",
    call: function (message, args) {
        args.forEach(arg => {
            if (ytregex.test(arg))
                globalQueue.push(arg);
        });
	}
}

exports.dequeue = {
	name: 'dequeue',
	regex: /dequeue/i,
	desc: "Removes from queue <_/all/numbers>",
    call: function (message, args) {
        if (args.length == 0)
            globalQueue.shift();
        else if (args[0] == "all")
            globalQueue = [];
        else
            args.forEach(arg => {
                if (!isNaN(arg) && +arg < globalQueue.length) {
                    console.log(+arg);
                    globalQueue = globalQueue.splice(+arg, 1);
                }
            });
    }
}

function playQueue(message) {
    if (playerState == "playing")
        message.member.voiceChannel.join().then(connection => {
            if (globalQueue.length > 0) {
                let stream = ytdl(globalQueue[0], { filter: 'audioonly' });
                connection.dispatcher = connection.playStream(stream);

                connection.dispatcher.setVolume(globalVolume);

                connection.dispatcher.on('debug', (i) => console.log("debug: " + i));

                connection.dispatcher.on('error', (err) => {
                    msg.channel.sendMessage("fail: " + err);
                    globalQueue.shift();
                    playQueue(message);
                });

                connection.dispatcher.on('end', function () {
                    setTimeout(function () {
                        globalQueue.shift();
                        playQueue(message);
                    }, 1000);
                });
            }
        }).catch(console.error);
}
/*
exports.search = {
    name: 'search',
    regex: /search/i,
    desc: "Searches Youtube for a clip and plays it",
    call: function (message, args) {
        var keywords = args.reduce(function (a, b) {
            return a + b;
        }, []);

        gapi.client.load('youtube', 'v3', function () {
            gapi.client.setApiKey(apikey);

            var request = gapi.client.youtube.search.list({
                part: 'snippet',
                q: keywords
            });
            request.execute(function (response) {
                response.items[0];
            });
        });
    }
}*/