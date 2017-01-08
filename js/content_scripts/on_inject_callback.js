// When a page has loaded (This script is injected), we tell LivePage to start its job!
chrome.runtime.sendMessage( { action: "injected" } );
