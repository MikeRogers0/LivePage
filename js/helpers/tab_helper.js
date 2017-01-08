/*
 * A collection of helpful functions used when interacting with tabs.
 */

// Checks if the protocol is one javascript will let livepage run on.
function supportedProtocol(tab) {
  // Quickly check were ok to work on this URL:
  return (tab.url.indexOf('https://') == 0 || tab.url.indexOf('http://') == 0 || tab.url.indexOf('file://') == 0);
}

// Runs all the scripts one after the other, this stop problems where one scripts slow execution breaks everything.
function executeScriptsInSerial(tabId, scripts) {
  var script = scripts.splice(0, 1)[0];
  chrome.tabs.executeScript(tabId, script, function() {
    if (scripts.length) {
      executeScriptsInSerial(tabId, scripts);
    }
  });
}
