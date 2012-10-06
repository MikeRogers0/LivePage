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
	
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.url+'?livePage='+(new Date() * 1), false);
	xhr.send();
	
	// Make the resonse page an element & scan it
	var livePage_element = document.createElement('livePageDiv');
	livePage_element.innerHTML = xhr.responseText;
	
	// Add resources checkers in here
	if(this.options.monitor_css == true){
		elements = livePage_element.querySelectorAll('link[href*=".css"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'css', false);
		}
	}
	
	if(this.options.monitor_less == true){
		elements = livePage_element.querySelectorAll('link[href*=".less"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'less', false);
		}
	}
	
	if(this.options.monitor_js == true){
		elements = livePage_element.querySelectorAll('script[src*=".js"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].src, 'js', false);
		}
	}
	
	if(this.options.monitor_html == true){
		this.addResource(this.url, 'html', false);
	}
	
	// Add the last resource updated to a more frequently checked list.
	if(this.lastUpdatedResource != null & this.lastChecked > 4){
		
		// Add it to the superior resources list.
		this.addResource(this.lastUpdatedResource.url, this.lastUpdatedResource.type, true);
		
		$LivePageDebug(['Monitoring '+this.lastUpdatedResource.url+' more frequently']);
	}
	
	$LivePageDebug(['Monitoring '+this.resources.length+' resources', this.resources]);
	
	this.check();
}

/*
 * Adds live resources to the objects.
 */
livePage.prototype.addResource = function(url, type, superior){
	// Normalize the URL
	url = this.normalizeURL(url);
	
	// Check the URL is ok
	if(!this.trackableURL(url)){
		return false;
	}
	
	if(superior == true){
		this.superiorResource = new LiveResource(url, type);
		return;
	}
	
	this.resources[this.lastChecked++] = new LiveResource(url, type);

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
 * Triggers a resource check.
 */
livePage.prototype.check = function(){
	if(this.options.enabled == false){
		return false;
	}

	this.lastChecked++;
	if(this.resources[this.lastChecked] == undefined){
		this.lastChecked = 0;
	}
	
	// Store lastChecked incase the next check runs before this one finishes.
	var lastChecked = this.lastChecked;
	
	setTimeout(function(){$livePage.check();}, this.options.refresh_rate);
	
	// Check the superior resource. If we do, make sure we don't check it with the non-superior object.
	if(this.superiorResource != null){
		
		// Only check the superior every other poll
		if(lastChecked%2 == 0){
			this.superiorResource.check();
		}
		
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
function LiveResource(url, type){
	this.url = url;
	this.type = type;
	this.element = null;
	
	// set the method, if it's a local file or html we need to check the HTML.
	this.method = 'HEAD';
	if(this.type == 'html'|| this.url.indexOf('file://') == 0){
		this.method = 'GET';
	}
	
	
	this.headers = {"Etag": null, "Last-Modified": null, "Content-Length": null};
	this.cache = '';
	this.response = '';
	this.xhr = null;
}

/*
 * Checks if a newer version of the file is there.
 */
LiveResource.prototype.check = function(){
	$LivePageDebug(['Checking', this.url]);
	
	this.xhr = new XMLHttpRequest();
	
	// Catch errors & remove bad links.
	try{
		this.xhr.open(this.method, this.url+'?livePage='+(new Date() * 1), false);
		this.xhr.send();
		this.xhr.getAllResponseHeaders();
		
		if(this.xhr.status == 404){
			throw 'Cannot find file';
		}
	}catch(e){
		// Ok an error occoured, so lets remove it from the array than shuffle.
		$LivePageDebug(['Error Checking', this.url, e, 'Removing from list']);
		$livePage.removeResource(this.url);
		return;
		//debugger;
	}
	
	if (this.xhr.readyState == 4 && this.xhr.status != 304) {
	
		// Firstly, tidy up the code
		this.response = this.tidyCode(this.xhr.responseText);
		
		// If this is the first check, cache it and than move along.
		if(this.cache == '' && this.response != ''){
			this.cache = this.response;
			return;
		}
		
		// Compare the headers && responseText
		if(this.checkHeaders() && this.checkResponse()){
			this.refresh();
		}
		
	}
}

/*
 * Cycles through the headers recieved looking for changes.
 */
LiveResource.prototype.checkHeaders = function(){
	var headersChanged = false;
	for (var h in this.headers) {
		if(this.headers[h] != null && this.headers[h] != this.xhr.getResponseHeader(h)){
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
	if(this.method == 'GET'  && this.cache != this.response){
		this.cache = this.response;
		return false;
	}
	return true;
}

/*
 * Clears
 */
LiveResource.prototype.sessionCache = function(){
	cache = {};
	cache.url = this.url;
	cache.type = this.type;
	
	sessionStorage.setItem('LivePage_LastUpdatedResource', JSON.stringify(cache));
}

/*
 * Refresh the code
 */
LiveResource.prototype.refresh = function (){
	$LivePageDebug(['Refreshing', this.url]);
	
	// Update the Superior Resource, so it gets checked more frqeuently.
	$livePage.superiorResource = this;
	
	if(this.type == 'css'){
		// create a new html element
		var cssElement = document.createElement('link');
		cssElement.setAttribute("type", "text/css");
		cssElement.setAttribute("rel", "stylesheet");
		cssElement.setAttribute("href", this.url + "?LivePage=" + new Date() * 1);
		
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
		
		// This can let us reload the page & force a cache reload.
		chrome.extension.sendMessage({action: 'reload'}, function(){});
	}
}

/*
 * Tidies up HTML (Removes comments and whitespace), if the users wants.
 */
LiveResource.prototype.tidyCode = function(html){
	if($livePage.options.tidy_html == false){
		return html;
	}
	// Remove comments and whitespace.
	html = html.replace(/<!--(.*?)-->/gim, '');
	html = html.replace(/ /gim, '');
	html = html.replace(/(\r\n|\n|\r|\t)/gim,'');
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

if(typeof $livePageConfig == "object"){var $livePage = new livePage($livePageConfig); $LivePageDebug('Starting Up');  $livePage.scanPage();}