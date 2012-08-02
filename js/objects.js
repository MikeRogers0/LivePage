// The Settings object.

function Settings(){
	// Set the default options:
	this.options = {
		monitor_css: true,
		monitor_less: true,
		monitor_js: true,
		monitor_html: true,
		hosts_session: false,
		skip_external: true,
		entire_hosts: false,
		tidy_html: true,
		use_css_transitions: true,
		debug_mode: false,
		refresh_rate: 750
	};
	
	// Check for old settings and do the upgrade
	
	
	this.refresh();
};

// LocalStorage functions based on https://github.com/Gaya/Locale-Storager
Settings.prototype.set = function(key, value){
 	localStorage.setItem(key, JSON.stringify(value));
};
Settings.prototype.get = function(key){
	// if we don't have the setting, fallback to the default one.
	var getSetting = JSON.parse(localStorage.getItem(key));
 	if(getSetting !== null){
 		return getSetting;
 	}
 	//console.log(key+' : '+getSetting+' so returning '+this.options[key]);
 	return this.options[key];
};
Settings.prototype.remove = function(key){
 	localStorage.removeItem(key);
 	return true;
};

Settings.prototype.refresh = function(){
 	for(var key in this.options){
 		this.options[key] = this.get(key);
 	}
 	return true;
};


var settings = new Settings();

// The livePages object.

function livePages(){
	this.livePages = {};
	this.loadAll();
};

livePages.prototype.loadAll = function(){
	this.livePages = settings.get('livePages');
	if(settings.get('livePages') == null){
		this.livePages = {};
	}
};


livePages.prototype.removeAll = function(){
	settings.set('livePages', null);
};

livePages.prototype.remove = function(tab){
	this.loadAll();
	
	if(settings.options.entire_hosts == true){
		delete this.livePages[this.getHost(tab.url)];
	} else {
		delete this.livePages[tab.url];
	}
	
	settings.set('livePages', this.livePages);
	this.stop(tab);
};

livePages.prototype.add = function(tab){
	this.loadAll();
	settings.refresh();
	
	// If the user wants entire hosts, just put the host name in.
	if(settings.options.entire_hosts == true){
		this.livePages[this.getHost(tab.url)] = true;
	} else {
		this.livePages[tab.url] = true;
	}
	
	settings.set('livePages', this.livePages);
	this.start(tab);
};

// Gets the hostname from a URL
livePages.prototype.getHost = function(url){
	var a = document.createElement('a');
	a.href = url;
	return a.hostname;
};

livePages.prototype.isLive = function(url){
	this.loadAll();
	
	if(settings.options.entire_hosts == true){
		url = this.getHost(url);
	}
	
	if(this.livePages[url] != undefined){
		return true;
	}
	return false;
};

livePages.prototype.start = function(tab){
	settings.refresh();
	
	// Update the Icon
	chrome.browserAction.setBadgeText({text: "Live", tabId: tab.id});
	chrome.browserAction.setTitle({title: 'Disable LivePage on '+tab.url, tabId: tab.id});
	
	// Make the page Live
	chrome.tabs.executeScript(tab.id, {code: 'var $livePageConfig = '+JSON.stringify(settings.options)+';'});
	if(settings.options.monitor_less == true){ // Only load the less stuff if we need it.
		chrome.tabs.executeScript(tab.id, {file: 'js/less-1.3.0.min.js'});
	}
	chrome.tabs.executeScript(tab.id, {file: 'js/livepage.js'});
}
livePages.prototype.stop = function(tab){
	chrome.tabs.executeScript(tab.id, {code: 'if(typeof $livePage != "undefined"){$livePage.options.enabled = false;}'});
	chrome.browserAction.setBadgeText({text: '', tabId: tab.id});
	chrome.browserAction.setTitle({title: 'Enable LivePage on '+tab.url, tabId: tab.id});
}

var livepages = new livePages();