/*
 * The Settings object, it stores users options.
 */
function Settings() {
  // Set the default options:
  this.options = {
    monitor_css: true,
    monitor_js: true,
    monitor_html: true,
    monitor_custom: true,
    hosts_session: false,
    skip_external: true,
    entire_hosts: false,
    ignore_anchors: true,
    tidy_html: true,
    tidy_inline_html: true,
    refresh_rate: 200
  };

  // Check for old settings and do the upgrade
  this.refresh();
};

/*
 * LocalStorage functions based on https://github.com/Gaya/Locale-Storager
 */
Settings.prototype.set = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};
Settings.prototype.get = function(key) {
  // if we don't have the setting, fallback to the default one.
  var getSetting = JSON.parse(localStorage.getItem(key));
  if (getSetting !== null) {
    return getSetting;
  }
  //console.log(key+' : '+getSetting+' so returning '+this.options[key]);
  return this.options[key];
};
Settings.prototype.remove = function(key) {
  localStorage.removeItem(key);
  return true;
};
Settings.prototype.refresh = function() {
  for (var key in this.options) {
    this.options[key] = this.get(key);
  }
  return true;
};

var settings = new Settings();

/*
 * The livePages object, manages making pages live & storing the live setting.
 */
function livePages() {
  // The object of pages we have marked as live.
  this.livePages = {};
  this.refresh();
};

// Refreshes livePages from database.
livePages.prototype.refresh = function() {
  this.livePages = settings.get('livePages');
  if (settings.get('livePages') == null) {
    this.livePages = {};
  }
};

// Wipes the database of all live pages.
livePages.prototype.removeAll = function() {
  settings.set('livePages', null);
};

/*
 * Transforms the URLS into the type the users have configured.
 */
livePages.prototype.cleanURL = function(url) {
  settings.refresh();
  var a = document.createElement('a');
  a.href = url;

  // If they only want entire hosts, just return the host name
  if (settings.options.entire_hosts == true) {
    if (a.hostname != '') {
      return a.hostname;
    }
    // Fallback for file:// protocol if there isn't one.
    return 'Local Files (file://)';
  }

  /*
   * Strips the hash from the URL. 
   * See https://developer.mozilla.org/en-US/docs/DOM/window.location#Properties for more info about the properties
   */
  if (settings.options.ignore_anchors == true) {
    return a.protocol + a.port + '//' + a.hostname + a.pathname + a.search;
  }

  return url;
}

// Deletes a url from livePages list.
livePages.prototype.remove = function(tab) {
  this.refresh();
  tab.url = this.cleanURL(tab.url);

  delete this.livePages[tab.url];
  settings.set('livePages', this.livePages);
  this.stop(tab);
};

// Add page to LivePages.
livePages.prototype.add = function(tab) {
  this.refresh();
  tab.url = this.cleanURL(tab.url);

  this.livePages[tab.url] = true;
  settings.set('livePages', this.livePages);
  this.start(tab);
};

// Check if the url is on the livePages list.
livePages.prototype.isLive = function(url) {
  this.refresh();
  url = this.cleanURL(url);

  if (typeof this.livePages[url] != "undefined") {
    return true;
  }
  return false;
};

// Turns on the LivePage on the tab.
livePages.prototype.start = function(tab) {
  settings.refresh();

  // Update the Icon
  chrome.browserAction.setBadgeText({
    text: chrome.i18n.getMessage('@live'),
    tabId: tab.id
  });
  chrome.browserAction.setTitle({
    title: chrome.i18n.getMessage('@disable_on_this_tab'),
    tabId: tab.id
  });

  // Make the page Live
  chrome.tabs.executeScript(tab.id, {
    code: 'var $livePageConfig = ' + JSON.stringify(settings.options) + '; var $livePage = false;'
  });
  chrome.tabs.executeScript(tab.id, {
    file: 'js/injected/live_resource.js'
  });
  chrome.tabs.executeScript(tab.id, {
    file: 'js/injected/live_css_resource.js'
  });
  chrome.tabs.executeScript(tab.id, {
    file: 'js/injected/livepage.js'
  });
}

// Turns off live page on the tab.
livePages.prototype.stop = function(tab) {
  // Stop live page running if it's there.
  chrome.tabs.executeScript(tab.id, {
    code: 'if(typeof $livePage != "undefined"){$livePage.options.enabled = false;}'
  });
  chrome.browserAction.setBadgeText({
    text: '',
    tabId: tab.id
  });
  chrome.browserAction.setTitle({
    title: chrome.i18n.getMessage('@enable_on_this_tab'),
    tabId: tab.id
  });
}

var livepages = new livePages();
