// The Settings object.

function Settings(){
	// Set the default options:
	this.options = {
		monitor_css: true,
		monitor_js: true,
		monitor_html: true,
		hosts_session: false,
		skip_external: false,
		entire_hosts: false,
		refresh_rate: 'auto'
	};
	
	
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

var settings = new Settings();

// The livePages object.

function livePages(){
	this.livePages = settings.get('livePages');
};

livePages.prototype.loadAll = function(){
	this.livePages = settings.get('livePages');
};


livePages.prototype.removeAll = function(){
	settings.set('livePages', null);
};

livePages.prototype.remove = function(url){
	this.loadAll();
	delete this.livePages[url];
	settings.set('livePages', this.livePages)
};

livePages.prototype.add = function(url){
	this.loadAll();
	this.livePages[url] = true;
	settings.set('livePages', this.livePages)
};

livePages.prototype.isLive = function(url){
	this.loadAll();
	if(this.livePages[url] === true){
		return true;
	}
	return false;
};

var livepages = new livePages();

function Person(){
	
}
Person.prototype.Hi = function(){
	alert('hi'); 
}
var person = new Person();