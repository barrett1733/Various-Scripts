chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.action == "GetName") {
		message.data.name = GetName(message.url, message.mediaType);
	}
	else if(message.action == "GetNameIGStory") {
		message.data.name = GetNameIGStory();
	}
	chrome.runtime.sendMessage(message);
});

function GetName(url, mediaType) {
	var articleCSS = "_h2d1o _j5hrx _4xyiw _j64nz" // article
	var nameCSS = "_4zhc5 notranslate _jozwt" // name
	var imageCSS = "_icyx7" // image
	var videoCSS = "_c8hkj" // video
	var articles = document.getElementsByClassName(articleCSS);
		
	for(var i=0; i<articles.length; i++) {
		if (mediaType == "image") {
			var imagehtml = articles[i].getElementsByClassName(imageCSS)[0];
			if (imagehtml != null && imagehtml.src == url) {
				return articles[i].getElementsByClassName(nameCSS)[0].title;
			}
		}
		if (mediaType == "video") {
			var videohtml = articles[i].getElementsByClassName(videoCSS)[0];
			if (videohtml != null && videohtml.src == url) {
				return articles[i].getElementsByClassName(nameCSS)[0].title;
			}
		}
	}
}

function GetNameIGStory() {
	var nameCSS = "storyAuthorAttribution"
	var name = document.getElementsByClassName(nameCSS)[0].getElementsByTagName("P")[0].innerText;
	return name;
}