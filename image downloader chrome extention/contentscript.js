chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.action == "GetName") {
        SendResponse(message.url);
    }
});

function GetName(url) {
	var articleCSS = "_h2d1o _j5hrx _4xyiw _j64nz" // article
	var nameCSS = "_4zhc5 notranslate _jozwt" // name
	var imagedivCSS = "_jjzlb" // image div
	var imageCSS = "_icyx7" // image
	var videoCSS = "_c8hkj" // video

	// don't have to worry about hidden pics/vids in albums
	// _9a6xd _qwk2e coreSpriteRightChevron
	// _9a6xd _envdc coreSpriteLeftChevron
	
	var articles = document.getElementsByClassName(articleCSS);
	var names = document.getElementsByClassName(nameCSS);
	var imagedivs = document.getElementsByClassName(imagedivCSS);
	var images = document.getElementsByClassName(imageCSS);
	var videos = document.getElementsByClassName(videoCSS);
	
	for(var i=0; i<images.length; i++) {
		if (images[i].src == url) {
			return names.length == 1 ? names[0].title : names[i].title;
		}
	}
}

function SendResponse(url) {
	var igname = GetName(url);
	if(igname != "") chrome.runtime.sendMessage({action:"RecieveName", name: igname, url:url});
}