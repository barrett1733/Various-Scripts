chrome.contextMenus.create({"title": "Download Image", "contexts": ["image"], "onclick": ContextMenuOnClick});
chrome.contextMenus.create({"title": "Download Video", "contexts": ["video"], "onclick": ContextMenuOnClick});

function ContextMenuOnClick(info, tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		siteInfoArray.forEach(function(siteInfo) {
			if(siteInfo.regex.test(tab.url)) {
				chrome.tabs.sendMessage(tabs[0].id, new Message(siteInfo, info.srcUrl, info.mediaType));
			}
		})
	});	
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	currentSite = message.site;
	siteInfoArray.forEach(function(siteInfo) {
		if(message.site == siteInfo.site) siteInfo.data = message.data;
	});
	chrome.downloads.download({"url":message.url, "conflictAction":"prompt" });
});

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	siteInfoArray.forEach(function(siteInfo){
		if(currentSite == siteInfo.site)
			siteInfo.suggestCallback(siteInfo, item, suggest);
	})
});

var currentSite;
var siteInfoArray = [
	new SiteInfo("twitter", /.*twitter.*/, "DoNothing", null, TwitterRename),
	new SiteInfo("instagram", /.*instagram.*/, "GetName", {name:""}, InstagramRename)
];	

function SiteInfo(site, regex, action, data, suggestCallback) {
	this.site = site;
	this.regex = regex;
	this.action = action;
	this.data = data;
	this.suggestCallback = suggestCallback;
}

function Message(siteInfo, url, mediaType) {
	this.site = siteInfo.site;
	this.url = url;
	this.mediaType = mediaType;
	this.action = siteInfo.action;
	this.data = siteInfo.data;
}

function InstagramRename(siteInfo, item, suggest) {
	var filename = siteInfo.site + "/" + siteInfo.data.name + "/" + item.filename;
	suggest({filename: filename});
}
function TwitterRename(siteInfo, item, suggest) {
	var filename = siteInfo.site + "/" + /(.*)[\-\:]large/g.exec(item.filename)[1];
	suggest({filename: filename});
}


