chrome.contextMenus.create({"title": "Download Image", "contexts": ["image"], "onclick": ContextMenuOnClick});
chrome.contextMenus.create({"title": "Download Video", "contexts": ["video"], "onclick": ContextMenuOnClick});

function ContextMenuOnClick(info, tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log(tab.url);
		var matchFound = false;
		regexTable.forEach(function(item) {
			if(item.regex.test(tab.url)) {
				chrome.tabs.sendMessage(tabs[0].id, new Message(siteInfoTable[item.site], info.srcUrl, info.mediaType));
				matchFound = true;
				console.log(tab.url);
			}
		})
		if(!matchFound)
			chrome.downloads.download({"url":info.srcUrl, "conflictAction":"prompt" });		
	});	
}

function getFilename(url) {
	return /(.*(?:\\|\/)+)?((.*)(\.([^?\s]*)))\??(.*)?/g.exec(url)[2];
}

chrome.runtime.onMessage.addListener(RecieveMessage);
function RecieveMessage(message, sender, sendResponse) {
	currentSite = message.site;
	if(siteInfoTable[currentSite]) {
		siteInfoTable[currentSite].data = message.data;
	}
	chrome.downloads.download({"url":message.url, "conflictAction":"prompt"});
}

chrome.downloads.onDeterminingFilename.addListener(DetermineFilename);
function DetermineFilename(item, suggest) {
	if(siteInfoTable[currentSite]) {
		suggest({filename: siteInfoTable[currentSite].filenameCallBack(siteInfoTable[currentSite], item.filename)});
	}
	else {
		suggest({filename: item.filename});
	}
	currentSite = "";
}

var currentSite;
var regexTable = [
	{site:"twitter", regex:/.*twitter/g},
	{site:"instagram", regex:/.*instagram/g},
	{site:"ig story", regex:/.*bojgejgifofondahckoaahkilneffhmf.*/},
	];
var siteInfoTable = {
	"twitter": new SiteInfo("twitter", "DoNothing", null, TwitterRename),
	"instagram": new SiteInfo("instagram", "GetName", {name:""}, InstagramRename),
	"ig story": new SiteInfo("ig story", "GetNameIGStory", {name:""}, InstagramRename)
};

function SiteInfo(site, action, data, filenameCallBack) {
	this.site = site;
	this.action = action;
	this.data = data;
	this.filenameCallBack = filenameCallBack;
}

function Message(siteInfo, url, mediaType) {
	this.site = siteInfo.site;
	this.url = url;
	this.mediaType = mediaType;
	this.action = siteInfo.action;
	this.data = siteInfo.data;
}

function TwitterRename(siteInfo, filename) {
	return siteInfo.site + "/" + /(.*)[\-\:]large/g.exec(filename)[1];
}

function InstagramRename(siteInfo, filename) {
	if(siteInfo.data.name == "")
		return siteInfo.site + "/" + filename;
	else
		return siteInfo.site + "/" + siteInfo.data.name + "/" + filename;
}

