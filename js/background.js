// Add the listners

// When a page tell us it has has loaded successfully, it tells us & we start the script.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  var tab = sender.tab;

  // If it's some other message, ignore it.
  if(request.action != "injected"){
    return;
  }

  if (!supportedProtocol(tab)) {
    return false;
  }

  // If livepage is on this guy, lets start it.
  if (livepages.isLive(tab.url)) {
    livepages.start(tab);
  } else {
    livepages.setEnableOnText(tab);
  }
});

// The script which will reload the tabs (it got weird on file://)
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'reload') {
    chrome.tabs.reload(sender.tab.id, {
      bypassCache: true
    });
  }
});

// If the user clicks the icon - make the site liveJS enanabled/disabled
chrome.browserAction.onClicked.addListener(function(tab) {

  // Check it's a supported protocol
  if (!supportedProtocol(tab)) {
    alert(chrome.i18n.getMessage('@protocol_not_supported'));
    return false;
  }

  // If the page is Live, make it not live.
  if (livepages.isLive(tab.url)) {
    livepages.remove(tab);
  } else {
    // It's not live, so start LivePage on it.
    
    // If it's file:// check we have permission (file:// access enabled) to run LivePage on it.
    if (tab.url.indexOf('file://') == 0 && typeof sessionStorage['file-test'] == 'undefined') {
      // Throw an error in a moment.
      var exec_error = setTimeout(function() {
        alert(chrome.i18n.getMessage('@file_protocol_needs_enabling'));
      }, 100);
      
      // Now check the file responds to our JS request, if it won't the above error will be thrown.
      chrome.tabs.sendRequest(tab.id, 'Ping', function(result) {
        if (result === 'Pong') {
          clearTimeout(exec_error);
          sessionStorage['file-test'] = true;
          livepages.add(tab);
        }
      });

    } else {
      livepages.add(tab);
    }
  }
});

chrome.runtime.onInstalled.addListener(function() {
  //chrome.tabs.create({'url': 'https://livepage.mikerogers.io/thank-you.html'}, function(window) {}); 
});
