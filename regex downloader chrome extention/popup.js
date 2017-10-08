var htmlElement = 'html_extention_popup';
var regexElement = 'regex_extention_popup';
var resultsElement = 'results_extention_popup';
var downloadButton = 'downloadButton_extention_popup';
var results = [];

function getCurrentTabUrl(callback) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      callback(tabs[0].url);
  });
}

function getFromPage(actionStr, callback) {
    getCurrentTabUrl(function (url) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendMessage(tab.id, { action: actionStr }, function (response) {
                if (response != null)
                    callback(response.message);
            });
        });
    });
}

function storeHtml(html) {
	document.getElementById(htmlElement).innerText = html;
}

function processInput() {
	var html = document.getElementById(htmlElement).innerText;
	var str = document.getElementById(regexElement).value;
	var results = document.getElementById(resultsElement);
	
	// store string to background page
	chrome.extension.getBackgroundPage().inputstorage = str;
	
	// clear results
	while (results.firstChild) {
		results.removeChild(results.firstChild);
	}
	
	// process html using regex and store in results
	if (str != "") {
		var regex = new RegExp(str, 'gm');
		regexHtml(regex, html, results);
	}
}

function regexHtml(regex, html, resultsElement) {
	var matches = html.match(regex);
	results = matches;
    if (matches != null) {
		var unique = matches.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
		resultsElement.innerHTML = "# of Matches: " + unique.length;
		for (var i=0; i < unique.length; i++)
			createResult(resultsElement, unique[i]);
    }
}

function createResult(element, text) {
    var resultButton = document.createElement('div');

    resultButton.id = 'result';
    resultButton.className = 'result';
    resultButton.innerHTML = text;
    resultButton.onclick = function() {
		chrome.downloads.download({ url:text });
    };

    element.appendChild(resultButton);
}

function downloadAll() {
	var list = document.getElementsByClassName('result');
	if (list.length > 0) {
		for(var i = 0; i < list.length; i++) {
			chrome.downloads.download({ url:list[i].innerHTML });
		}
	}
}

function loadFromStorage() {
	var inputStr = chrome.extension.getBackgroundPage().inputstorage;
	inputStr = inputStr == "undefined" ? "" : inputStr;
	document.getElementById(regexElement).value = inputStr;
}

document.addEventListener('DOMContentLoaded', function () {
    getFromPage("getDOM", function(message) {
		storeHtml(message);
		loadFromStorage();
		processInput();
	});
	document.getElementById(regexElement).oninput = processInput;
	document.getElementById(downloadButton).onclick = downloadAll;
});

