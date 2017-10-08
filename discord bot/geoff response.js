exports.run = function(message) {
	let msgOut = "";
	let responseGiven = false;
	for (let i = 0; i < responseList.length; i++) {
		if (responseList[i].regex.test(message.content)) {
			msgOut += createResponse(message, responseList[i].response, responseList[i].min, responseList[i].max);
			responseGiven = true;
		}
	}
	if (!responseGiven) {
		let randomResponseIndex = getRandomNumber(1, responseList.length - 1);
		msgOut += createResponse(message, responseList[randomResponseIndex].response, responseList[randomResponseIndex].min, responseList[randomResponseIndex].max);
	}
	return msgOut;
}

const responseList = [{
    'name': 'flame',
    'regex': /f+l+a+m+e+/i,
	'response': ':fire:',
	'min': 1,
	'max': 1
}, {
    'name': 'fire',
    'regex': /f+i+r+e+/i,
 	'response': ':fire:',
	'min': 0,
	'max': 15
}, {
    'name': 'blaze',
    'regex': /b+l+a+z+e+/i,
	'response': ':fire:',
	'min': 0,
	'max': 30
}, {
    'name': 'inferno',
    'regex': /i+n+f+e+r+n+o+/i,
 	'response': ':fire:',
	'min': 0,
	'max': 50
}, {
    'name': 'boom',
    'regex': /b+o+o+m+/i,
	'response': ':boom:',
	'min': 1,
	'max': 1
}, {
    'name': 'explode',
    'regex': /e+x+p+l+o+d+e+/i,
	'response': ':boom:',
	'min': 1,
	'max': 1
}];

function getRandomNumber(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function createResponse(message, response, min, max) {
	let userIds = message.mentions.users.keyArray();
    let msg = '';
	for (let i = 0; i < userIds.length; i++) {
		if (userIds[i] != message.client.user.id)
			userIds.push(userIds.shift());
		else
			userIds.shift();
	}

	let newMin = min < userIds.length * 2 ? userIds.length * 2 : min;
	let newMax = max < userIds.length * 2 ? userIds.length * 2 : max;
    let amt = getRandomNumber(newMin, newMax);
	let divider = Math.floor(amt/(userIds.length + 1));
    for (let i = 0; i < amt; i++) {
		if (i != 0 && i % divider == 0 && userIds.length > 0) {
			msg += '<@' + userIds.shift() + '>';
		}
        msg += response;
	}
    return msg;
}
