function enableLivePage(tab){
	settings.refresh();
	
	// Update the Icon
	chrome.browserAction.setBadgeText({text: "Live", tabId: tab.id});
	chrome.browserAction.setTitle({title: 'Disable LivePage on '+tab.url, tabId: tab.id});
	
	// Make the page Live
	chrome.tabs.executeScript(tab.id, {code: 'var $livePageConfig = '+JSON.stringify(settings.options)+';'});
	chrome.tabs.executeScript(tab.id, {file: 'livepage.js'});
}
function disableLivePage(tab){
	chrome.tabs.executeScript(tab.id, {code: 'if(typeof $livePage != "undefined"){$livePage.options.enabled = false;}'});
	chrome.browserAction.setBadgeText({text: '', tabId: tab.id});
	chrome.browserAction.setTitle({title: 'Enable LivePage on '+tab.url, tabId: tab.id});
}



// Add the listners

// Check if the URL were on has requested liveJS
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "loading"){
		if(livepages.isLive(tab.url)){
			enableLivePage(tab);
		}else{
			disableLivePage(tab);
		}
	}
	
});

// If the user clicks the icon - make the site liveJS enanabled/disabled
chrome.browserAction.onClicked.addListener(function(tab) {
	if(livepages.isLive(tab.url)){
		livepages.remove(tab.url);
		disableLivePage(tab);
	} else {
		livepages.add(tab.url);
		enableLivePage(tab);
	}
});