/* 
 * LivePage is based on Live.js by Martin Kool (@mrtnkl). 
 * Rewritten by Mike Rogers (@MikeRogers0)
 */

function livePage(config){
	// Set up some defaults variables
	this.options = config;
	this.options.enabled = true;
	this.resources = [];
	this.superiorResource = null;
	this.lastChecked = 0;
	this.lastUpdatedResource = null;
	this.url = document.URL;
	this.head = document.querySelector("head");
	this.html = document.querySelector('html');
	
	// Add the nice CSS morph
	if(this.options.use_css_transitions == true){
		style = document.createElement("style"),
		css = '.livepage-loading * {-webkit-transition: all .2s ease-in;}';
		style.setAttribute("type", "text/css");
		this.head.appendChild(style);
		style.appendChild(document.createTextNode(css));
		this.html.className += ' livepage-loading';
	}
	
	// if we have a sessionStorage of the last updated resource, pop it in.
	if(sessionStorage['LivePage_LastUpdatedResource'] != undefined){
		this.lastUpdatedResource = JSON.parse(sessionStorage.getItem('LivePage_LastUpdatedResource'));
	}
};

/*
 * Asks the page to scan itself, than looks for elements to track.
 */
livePage.prototype.scanPage = function(){
	$LivePageDebug(['Scanning Page']);
	

	
	// Add resources checkers in here
	if(this.options.monitor_css == true){
		// First go through the linked elemented
		elements = document.querySelectorAll('link[href*=".css"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'css', false, elements[key].media);
		}
		
		// Now go through the @import elements
		styleSheets = document.styleSheets;
		
		for(var key=0; key<styleSheets.length; key++){
			var sheet = styleSheets[key];
			
			if(sheet){			
				// If it has a href we can monitor
				if(sheet.href){
					this.addResource(sheet.href, 'css', false, sheet.media.mediaText);
				}
				
				if(sheet.cssRules){
					// Now lets checks for @import stuff within this stylesheet.	
					for(var ruleKey=0; ruleKey<sheet.cssRules.length; ruleKey++){
						 var rule = sheet.cssRules[ruleKey];
						 if(rule && rule.href){
						 	this.addResource(rule.href, 'css', false, rule.media.mediaText);
						 }
					}
				}
			}
		}
	}
	
	if(this.options.monitor_less == true){
		elements = document.querySelectorAll('link[href*=".less"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'less', false, false);
		}
	}
	
	if(this.options.monitor_js == true){
		elements = document.querySelectorAll('script[src*=".js"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].src, 'js', false, false);
		}
	}
	
	if(this.options.monitor_html == true){
		this.addResource(this.url, 'html', false, false);
	}
	
	// Randomise the checking process, so were not hitting groups the same of files.
	this.resources.sort(function() { return 0.5 - Math.random(); });
	
	// Add the last resource updated to a more frequently checked list.
	if(this.lastUpdatedResource != null & this.lastChecked > 4){
	
		if((this.lastUpdatedResource.type == 'js' && this.options.monitor_js == true) || (this.lastUpdatedResource.type == 'less' && this.options.monitor_less == true) || (this.lastUpdatedResource.type == 'html' && this.options.monitor_html == true)){
			// Add it to the superior resources list.
			this.addResource(this.lastUpdatedResource.url, this.lastUpdatedResource.type, true, this.lastUpdatedResource.media);
		
			$LivePageDebug(['Monitoring '+this.lastUpdatedResource.url+' at higher priority']);
		}
	}
	
	$LivePageDebug(['Monitoring '+this.resources.length+' resources', this.resources]);
	
	this.checkBatch();
}

/*
 * Adds live resources to the objects.
 */
livePage.prototype.addResource = function(url, type, superior, media){
	// Normalize the URL
	url = this.normalizeURL(url);
	
	// Check the URL is ok
	if(!this.trackableURL(url)){
		return false;
	}
	
	if(superior == true){
		this.superiorResource = new LiveResource(url, type, media);
		return;
	}
	
	this.resources[this.lastChecked++] = new LiveResource(url, type, media);

}

/*
 *
 */
livePage.prototype.removeResource = function(url){
	for(r in this.resources){
		if(this.resources[r].url == url){
			delete this.resources[r];
		}
	}
	
	// Now shuffle the stack.
	this.resources.sort(function() { return 0.5 - Math.random(); });
}

/*
 * Normalise the URL. Right now, just removes anything after hash.
 */
livePage.prototype.normalizeURL = function(url){
	
	if(this.options.ignore_anchors == true){
		url = url.split('#');
		return url[0];
	}
	return url;
}

/*
 * Tells LivePage if the URL is ok.
 */
livePage.prototype.trackableURL = function(url){
	// from: http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
	if(this.options.skip_external == false){
		return true;
	}
	
	match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return false;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return false;
    return true;
}

/*
 * Lets us check the resources in small batches.
 */
livePage.prototype.checkBatch = function(){
	if(this.options.enabled == false){
		return false;
	}
	
	// Run the superior resource in every batch.
	if(this.superiorResource != null){
		this.superiorResource.check();
	}
	
	this.check();
	
	setTimeout(function(){$livePage.checkBatch();}, this.options.refresh_rate);
}

/*
 * Triggers a resource check.
 */
livePage.prototype.check = function(){
	// Que up the next resource, if it dosen't exist start again.
	this.lastChecked++;
	if(this.resources[this.lastChecked] == undefined){
		this.lastChecked = 0;
		if(this.resources[this.lastChecked] == undefined){ // Nothing left to check
			$livePage.options.enabled = false;
			return ;
		}
	}
	
	// Store lastChecked incase the next check runs before this one finishes.
	var lastChecked = this.lastChecked;
	
	// Check the superior resource. If we do, make sure we don't check it with the non-superior object.
	if(this.superiorResource != null){
		if(this.superiorResource.url != this.resources[lastChecked].url){
			this.resources[lastChecked].check();
		}else{
			this.resources[lastChecked] = this.superiorResource;
		}
	} else {
		this.resources[lastChecked].check();
	}
}

/*
 * LiveResource Object
 */
function LiveResource(url, type, media){
	this.url = url;
	this.type = type;
	this.element = null;
	this.media = media;
	
	// set the method, if it's a local file or html we need to check the HTML.
	this.method = 'HEAD';
	if(this.type == 'html' || this.url.indexOf('file://') == 0  || $livePage.url.indexOf('file://') == 0 || $livePage.options.use_only_get == true){
		this.method = 'GET';
	}
	
	
	this.headers = {"Etag": null, "Last-Modified": null, "Content-Length": null};
	this.cache = '';
	this.response = '';
	this.xhr = null;
}

/*
 * Generated a URL with a cache breaker in it.
 */
LiveResource.prototype.nonCacheURL = function(){
	if(this.url.indexOf('?') > 0 ){
		return this.url+'&livePage='+(new Date() * 1);
	}
	return this.url+'?livePage='+(new Date() * 1);
}


/*
 * Checks if a newer version of the file is there.
 */
LiveResource.prototype.check = function(){
	//$LivePageDebug(['Checking', this.url]);
	
	this.xhr = new XMLHttpRequest();
	
	// Catch errors & remove bad links.
	try{
		this.xhr.open(this.method, this.nonCacheURL(), false);
		//this.xhr.setRequestHeader('If-Modified-Since', (new Date(0) * 1));
		//this.xhr.setRequestHeader('Cache-Control', 'no-cache');
		//this.xhr.setRequestHeader('Pragma', 'no-cache');
		this.xhr.send();
		
		// If it 404s
		if(this.xhr.status == 404){
			throw "Error 404";
		}
	}catch(e){
		$LivePageDebug(['Error Checking', this.url, e, 'Removing from list']);
		$livePage.removeResource(this.url);
		return;
	}
	
	
	if (this.xhr.readyState == 4 && this.xhr.status != 304) {
		// Pull all the headers
		this.xhr.getAllResponseHeaders();
	
		// Firstly, tidy up the code
		this.response = this.tidyCode(this.xhr.responseText);
		
		// If this is the first check, cache it and than move along.
		if(this.method != 'HEAD' && this.cache == '' && this.response != ''){
			this.cache = this.response;
			return;
		}
		
		// Compare the headers && responseText
		if(this.checkHeaders() && this.checkResponse()){
			this.refresh();
		}
	}
	
	this.xhr = null;
}

/*
 * Cycles through the headers recieved looking for changes.
 */
LiveResource.prototype.checkHeaders = function(){
	if(this.method == 'GET' && (this.url.indexOf('file://') == 0 || $livePage.url.indexOf('file://') == 0)){ // If it's a file, it will always send bad headers. So check the content.
		return true;
	}

	var headersChanged = false;
	for (var h in this.headers) {
		if(this.headers[h] != null && (this.xhr.getResponseHeader(h) == null || this.headers[h] != this.xhr.getResponseHeader(h))){
			headersChanged = true;
		}
		// Update the headers.
		this.headers[h] = this.xhr.getResponseHeader(h);
	}
	return headersChanged;
}

/*
 * Compares the responseText to the cached. 
 */
LiveResource.prototype.checkResponse = function(){
	if(this.method == 'HEAD' || (this.response != '' && this.cache != this.response)){
		this.cache = this.response;
		return true;
	}
	this.cache = this.response;
	return false;
}

/*
 * Sets a session var of the last updated file.
 */
LiveResource.prototype.sessionCache = function(){
	cache = {};
	cache.url = this.url;
	cache.type = this.type;
	cache.media = this.media;
	
	sessionStorage.setItem('LivePage_LastUpdatedResource', JSON.stringify(cache));
}

/*
 * Refresh the code
 */
LiveResource.prototype.refresh = function (){
	$LivePageDebug(['Refreshing', this.url, this]);
	
	// Update the Superior Resource, so it gets checked more frqeuently.
	$livePage.superiorResource = this;
	
	if(this.type == 'css'){
		// create a new html element
		var cssElement = document.createElement('link');
		cssElement.setAttribute("type", "text/css");
		cssElement.setAttribute("rel", "stylesheet");
		cssElement.setAttribute("href", this.nonCacheURL() + "?LivePage=" + new Date() * 1);
		cssElement.setAttribute("media", this.media);
		
		$livePage.head.appendChild(cssElement);
		
		// Remove the old element we created in the last update. Than update.
		if(this.element != null){
			$livePage.head.removeChild(document.querySelector('link[href^="'+this.element.href+'"]'));
		}
		this.element = cssElement;
	}else if(this.type == 'less'){
		// Tell LESS CSS to reload.
		$LivePageLESS.refresh(document.querySelector('link[href^="'+this.url+'"]'));	
	}else{
		// Cache the item last updated so we poll it more.
		this.sessionCache();
		// Now reload the page.
		try{
			// This can let us reload the page & force a cache reload.
			chrome.extension.sendMessage({action: 'reload'}, function(){});
		}catch(e){
			// An error occoured refreshing the page with the chrome socket. Do it differently.
			document.location.reload($livePage.url);
		}
	}
}

/*
 * Tidies up HTML (Removes comments and whitespace), if the users wants.
 */
LiveResource.prototype.tidyCode = function(html){
	if($livePage.options.tidy_html == true){
		// Remove comments and whitespace.
		html = html.replace(/<!--([\s\S]*?)-->/gim, '');
		html = html.replace(/  /gim, ' ');
		html = html.replace(/(\r\n|\n|\r|\t\s)/gim,'');
	}
	
	if($livePage.options.tidy_inline_html == true){
		html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
		//html = html.replace(/<style(.*?)>(.*?)<\/style>/gim, '');
		html = html.replace(/<input(.*?)hidden(.*?)>/gim, '');
	}
	return html;
}

/*
 * Displays debugging information.
 */
function $LivePageDebug(message){
	if($livePage.options.debug_mode == true){
		console.log('LivePage: ', message);
	}
};

if(typeof $livePageConfig == "object"){var $livePage = new livePage($livePageConfig); $LivePageDebug('Starting Up'); $livePage.scanPage();}