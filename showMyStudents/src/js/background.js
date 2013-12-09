


chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.storage.local.get("ACTIVE", function(result) {
		var active = result["ACTIVE"];
		
		if(active === undefined) {
			chrome.storage.local.set({"ACTIVE": false });
			active = false;
		}

		if(active) {
			chrome.storage.local.set({"ACTIVE": false });
		} else {
			chrome.storage.local.set({"ACTIVE": true });
		}

		setCorrectIcon(tab);
	});
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
	if(tab.url.indexOf('https://studentsubmissions.app.cloud.it.liu.se') === 0) {

		chrome.pageAction.show(tabID);

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabID, {message: "update"}, function(response) {
		  });
		});

		setCorrectIcon(tab);
	}
});

function setCorrectIcon(tab) {
	chrome.storage.local.get("ACTIVE", function(result) {
		if(result["ACTIVE"]) {
			chrome.pageAction.setIcon({tabId : tab.id, path : "images/icon19_on.png"});
		} else {
			chrome.pageAction.setIcon({tabId : tab.id, path : "images/icon19_off.png"});
		}
	});
}
