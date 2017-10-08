function log(str) {
	if (false) console.log(str);
}

chrome.contextMenus.create({"title": "Download Image", "contexts": ["image"], "onclick": ContextMenuOnClick});
chrome.contextMenus.create({"title": "Download Video", "contexts": ["video"], "onclick": ContextMenuOnClick});

function ContextMenuOnClick(info, tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		log("tab url " + tab.url);
		var siteMatch = "";
		regexTable.forEach(function(item) {
			if(item.regex.test(tab.url)) {
				siteMatch = item.site;
			}
		})
		if(siteMatch != "") {
			chrome.tabs.sendMessage(tabs[0].id, new Message(siteInfoTable[siteMatch], info.srcUrl, info.mediaType));			
		}
		else {
			log("match not found onclick");
			log("tab " + tab);
			currentSite = getHost(tab.url);
			if (currentSite == "")
				currentSite = tab.title;
			chrome.downloads.download({"url":info.srcUrl, "conflictAction":"prompt"});
		}
	});	
}

function getHost(url) {
	var result = /http[s]?:\/\/?[w\.]*([^:\/\s]+\.\w{2,}).*/.exec(url);
	return result != null && result.length > 0 ? result[1] : "";
}

function getFilename(url) {
	var result = /(.*(?:\\|\/)+)?((.*)(\.([^?\s]*)))\??(.*)?/.exec(url)
	return result != null && result.length > 1 ? result[2] : "";
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
		log("siteinfoobject " + siteInfoTable[currentSite].filenameCallBack(siteInfoTable[currentSite], item.filename));
		suggest({filename: siteInfoTable[currentSite].filenameCallBack(siteInfoTable[currentSite], item.filename)});
	}
	else {
		var filename;
		if(currentSite != undefined && currentSite != "")
			filename = currentSite + "/" + item.filename;
		else
			filename = item.filename;
		log("filename " + filename);
		suggest({filename: filename});
	}
	currentSite = "";
}

var currentSite;
var regexTable = [
	{site:"twitter", regex:/.*twitter.*/},
	{site:"instagram", regex:/.*instagram.*/}
	];
var siteInfoTable = {
	"twitter": new SiteInfo("twitter", "DoNothing", null, TwitterRename),
	"instagram": new SiteInfo("instagram", "GetName", new InstagramInfo(), InstagramRename)
};

function InstagramInfo() {
	this.name = "";
}

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
	log(filename);
	log(siteInfo);
	if(siteInfo.data.name == undefined || siteInfo.data.name == "")
		return siteInfo.site + "/" + filename;
	else
		return siteInfo.site + "/" + siteInfo.data.name + "/" + filename;
}

