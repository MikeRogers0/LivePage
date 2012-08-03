var errorMessage = null;

// Checks if the protocol is one javascript will let livepage run on.
function supportedProtocol(tab){
	// Quickly check were ok to work on this URL:
	if(tab.url.indexOf('https://') == 0 || tab.url.indexOf('http://') == 0 || tab.url.indexOf('file://') == 0){
		return true;
	}
	//console.log('The protocol not supported.');
	errorMessage = chrome.i18n.getMessage('@protocol_not_supported');
	return false;
}


// Add the listners

// Check if the URL were on has requested liveJS
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	
	// When the tab is loading, check if we can fire away at it.
	if(changeInfo.status == "loading"){
		if(!supportedProtocol(tab)){
			return false;
		}
		
		if(livepages.isLive(tab.url)){
			livepages.start(tab);
		}else{
			livepages.stop(tab);
		}
	}
	
});

// If the user clicks the icon - make the site liveJS enanabled/disabled
chrome.browserAction.onClicked.addListener(function(tab) {
	
	if(!supportedProtocol(tab)){
		alert(errorMessage);
		return false;
	}

	if(livepages.isLive(tab.url)){
		livepages.remove(tab);
	} else {
		livepages.add(tab);
	}
});

// The script which will reload the tabs (it got weird on file://)
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == 'reload'){
		chrome.tabs.reload(sender.tab.id, {bypassCache: true});
	}
});