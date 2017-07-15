var downloadData;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //console.log(sender.tab ?
    //            "from a content script:" + sender.tab.url :
    //            "from the extension");

	if (message.action == "RecieveName") {
		downloadData.name = message.name;
		chrome.downloads.download({ "url":message.url });
    }
});

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	if(downloadData.site == "instagram") {
		suggest({filename: downloadData.name + "/" + item.filename});
		downloadData = null;
	}
	if(downloadData.site == "twitter") {
		var filename = /(.*)[\-\:]large/g.exec(item.filename)[1];
		suggest({filename: filename});
		downloadData = null;		
	}
	else suggest();
});

chrome.contextMenus.create({"title": "Download Image", "contexts": ["image", "video"], "onclick": function(info, tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if(/.*twitter.*/.test(tab.url)) {
			downloadData = {site:"twitter"};
			chrome.downloads.download({ "url":info.srcUrl });
		}
		if(/.*instagram.*/.test(tab.url)) {
			downloadData = {site:"instagram", name:""};
			chrome.tabs.sendMessage(tabs[0].id, {action:"GetName", url: info.srcUrl});
		}
	});
}});

function genericOnClick(info, tab) {
	console.log("item " + info.menuItemId + " was clicked");
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
}
