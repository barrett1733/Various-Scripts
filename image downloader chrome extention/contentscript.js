function log(str) {
	if (false) console.log(str);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.action == "GetName") {
		message.data.name = GetName(message.url, message.mediaType);
	}
	else if(message.action == "GetNameIGStory") {
		message.data.name = GetNameIGStory();
	}
	log(message);
	chrome.runtime.sendMessage(message);
});

function GetName(url, mediaType) {
	var name = /taken-by=(.*)/.exec(document.URL);
	if(name != undefined && name[1] != "")
		return name[1];
	
	if (document.URL != "https://www.instagram.com/") { // downloading from profile page
		log("instagram profile page");
		var profileNameCSS = "_2g7d5 notranslate _iadoq"
		var profileName = document.getElementsByClassName(profileNameCSS);
		if(profileName.length > 0)
			return profileName[0].title;
	}
	else { // downloading from instagram main page
		if(document.getElementsByClassName("storyAuthorUsername").length > 0) {
			log("instagram story viewer");
			return document.getElementsByClassName("storyAuthorUsername")[0].innerText.match(/([^-]+) -/)[1];
		}
		else {
			log("instagram main page");
			var articleCSS = "_s5vjd _622au _5lms4 _8n9ix" // article
			var nameCSS = "_2g7d5 notranslate _iadoq" // name
			var imageCSS = "_2di5p" // image
			var videoCSS = "_sajt6" // video
			var articles = document.getElementsByClassName(articleCSS);
			
			log("Articles " + articles);
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
	}
}

function GetNameIGStory() {
	var nameCSS = "storyAuthorAttribution"
	var name = document.getElementsByClassName(nameCSS)[0].getElementsByTagName("P")[0].innerText;
	return name;
}