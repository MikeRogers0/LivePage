var errorMessage = null;


// Checks if the protocol is one javascript will let livepage run on.
function supportedProtocol(tab){
	errorMessage = null;

	// Quickly check were ok to work on this URL:
	if(tab.url.indexOf('https://') == 0 || tab.url.indexOf('http://') == 0 || tab.url.indexOf('file://') == 0){
		return true;
	}
	
	// Generic error message.
	errorMessage = chrome.i18n.getMessage('@protocol_not_supported');
	
	return false;
}


// Add the listners

// Check if the URL were on has requested liveJS
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	
	// When the tab is loading, check if we can fire away at it.
	if (changeInfo.status === 'loading') return;
	
	if(!supportedProtocol(tab)){
		return false;
	}
	
	// If livepage is on this guy, lets start it.
	if(livepages.isLive(tab.url)){
		livepages.start(tab);
	}
	
});

// If the user clicks the icon - make the site liveJS enanabled/disabled
chrome.browserAction.onClicked.addListener(function(tab) {
	
	// Check it's a supported protocol
	if(!supportedProtocol(tab)){
		alert(errorMessage);
		return false;
	}
	
	
	// If the url is known, remove and stop it. Or add and start it if not.
	if(livepages.isLive(tab.url)){
		livepages.remove(tab);
	} else {
		// If it's file:// check we have permission
		if(tab.url.indexOf('file://') == 0 && typeof sessionStorage['file-test'] == 'undefined'){
			$LivePageDebug(['Testing file://', 'Started']);
			
			// It's a file, so lets run a quick test to see if we support it. Based on http://pastebin.com/3deXunJV because Chromes API dosen't throw errors!
		    chrome.tabs.executeScript(tab.id, {file: 'js/file_protocol_test.js'}, function() {
		        // This function always fires *after* the attempt to run the code
		        var exec_error = setTimeout(function(){alert(chrome.i18n.getMessage('@file_protocol_needs_enabling')); $LivePageDebug(['Testing file://', 'Failed']);}, 100);
		        chrome.tabs.sendRequest(tab.id, 'Ping', function(result) {
		            if (result === 'Pong') {
		                clearTimeout(exec_error);
		                sessionStorage['file-test'] = true;
		                livepages.add(tab);
		                $LivePageDebug(['Testing file://', 'Passed & cached for this session']);
		            }
		        });
		    });
		} else {
			livepages.add(tab);
		}
	}
});

// The script which will reload the tabs (it got weird on file://)
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == 'reload'){
		chrome.tabs.reload(sender.tab.id, {bypassCache: true});
	}
});