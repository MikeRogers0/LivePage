/* 
 * LivePage is based on Live.js by Martin Kool (@mrtnkl). 
 * Rewritten by Mike Rogers (@MikeRogers0)
 */

function livePage(config){
	// Set up some defaults variables
	this.options = config;
	this.options.enabled = true;
	this.resources = [];
	this.lastChecked = 0;
	this.lastUpdatedResource = null;
	this.url = document.URL;
	this.head = document.querySelector("head");
	this.html = document.querySelector('html');
	
	// Add the nice CSS morph
	if(this.options.use_css_transitions == true){
		css = document.createTextNode('.livepage-loading * {-webkit-transition: all .2s ease-in;}');
		style = document.createElement("style").setAttribute("type", "text/css").appendChild(css);
		
		this.head.appendChild(style);
		this.html.className += ' livepage-loading';
	}
	
	// if we have a sessionStorage of the last updated resource, pop it in.
	if(sessionStorage['LivePage_LastUpdatedResource'] != undefined){
		this.lastUpdatedResource = JSON.parse(sessionStorage['LivePage_LastUpdatedResource']);
	}
};

/*
 * Asks the page to scan itself, than looks for elements to track.
 */
livePage.prototype.scanPage = function(){
	$LivePageDebug(['Scanning Page']);
	
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.url, false);
	xhr.send({'livePage': (new Date() * 1)});
	
	// Make the resonse page an element & scan it
	var livePage_element = document.createElement('livePageDiv');
	livePage_element.innerHTML = xhr.responseText;
	
	// Add resources checkers in here
	if(this.options.monitor_css == true){
		elements = livePage_element.querySelectorAll('link[href*=".css"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'css', elements[key]);
		}
	}
	
	if(this.options.monitor_less == true){
		elements = livePage_element.querySelectorAll('link[href*=".less"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].href, 'less', elements[key]);
		}
	}
	
	if(this.options.monitor_js == true){
		elements = livePage_element.querySelectorAll('script[src*=".js"]');
		for(var key=0; key<elements.length; key++){
			this.addResource(elements[key].src, 'js', elements[key]);
		}
	}
	
	if(this.options.monitor_html == true){
		this.addResource(this.url, 'html', null);
	}
	
	// Add the last resource which was updated in a few times to make it checked a bit more often.
	if(this.lastUpdatedResource != null & this.lastChecked <= 3){
		// Add it in a few times.
		for(i = 0; i < (this.lastChecked / 3); i++){
			this.addResource(this.lastUpdatedResource.url, this.lastUpdatedResource.type, this.lastUpdatedResource.element);
		}
		
		// Now delete it, so we don't trigger it too much.
		delete sessionStorage['LivePage_LastUpdatedResource'];
		
		// Now suffle the resources. Thanks to http://css-tricks.com/snippets/javascript/shuffle-array/ for the sane shuffle.
		this.resources.sort(function() { return 0.5 - Math.random(); });
	}
	
	this.check();
}

/*
 * Adds live resources to the objects.
 */
livePage.prototype.addResource = function(url, type, element){
	// Normalize the URL
	url = this.normalizeURL(url);
	
	// Check the URL is ok
	if(!this.trackableURL(url)){
		return false;
	}
	
	// this.resources - count
	this.resources[this.lastChecked++] = new LiveResource(url, type, element);
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
	
	this.resources[this.lastChecked].check();
	
	setTimeout(function(){$livePage.check();}, this.options.refresh_rate);
}

/*
 * LiveResource Object
 */
function LiveResource(url, type, element){
	this.url = url;
	this.type = type;
	this.element = element;
	
	// set the method, if it's a local file or html we need to check the HTML.
	this.method = 'HEAD';
	if(this.type == 'html'|| this.url.indexOf('file://') == 0){
		this.method = 'GET';
	}
	
	
	this.headers = {"Etag": null, "Last-Modified": null, "Content-Length": null};
	this.cache = '';
	this.xhr = null;
	
	$LivePageDebug(['Monitoring', this.url]);
}

/*
 * Checks if a newer version of the file is there.
 */
LiveResource.prototype.check = function(){
	$LivePageDebug(['Checking', this.url]);
	
	this.xhr = new XMLHttpRequest();
	this.xhr.open(this.method, this.url+'?livePage='+(new Date() * 1), false);
	try{
		this.xhr.send();
		this.xhr.getAllResponseHeaders();
	}catch(e){
		// Ok an error occoured, so lets remove it from the array than shuffle.
		$LivePageDebug(['Error Checking', this.url, e, 'Removing from list']);
		$livePage.removeResource(this.url);
		return;
		//debugger;
	}
	
	if (this.xhr.readyState == 4 && this.xhr.status != 304) {
	
		// Firstly, tidy up the code
		this.xhr.responseText = this.tidyCode(this.xhr.responseText);
		
		// If this is the first check, cache it and than move along.
		if(this.cache == '' && this.xhr.responseText != ''){
			this.cache = this.xhr.responseText;
			return;
		}
		
		// Compare the headers && responseText
		if(this.checkHeaders() || this.checkResponse()){
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
			$LivePageDebug(['Header Changed', [this.url, h, this.xhr.getResponseHeader(h)]])
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
	if(this.method == 'GET' && this.cache != this.xhr.responseText){
		this.cache = this.xhr.responseText
		return true;
	}
	return false;
}


/*
 * Refresh the code
 */
LiveResource.prototype.refresh = function (){
	$LivePageDebug(['Refreshing', this.url]);
	sessionStorage['LivePage_LastUpdatedResource'] = JSON.stringify(this);
	
	if(this.type = 'css'){
		// create a new html element
		var cssElement = document.createElement('link').setAttribute("type", "text/css").setAttribute("rel", "stylesheet");
		cssElement.setAttribute("href", this.element.url + "?LivePage=" + new Date() * 1);
		
		$livePage.head.appendChild(cssElement);
		
		$livePage.head.removeChild(document.querySelector('link[href^="'+this.element.url+'"]'));
	}else if(xhr.type == 'less'){
		// Tell LESS CSS to reload.
		$LivePageLESS.refresh(document.querySelector('link[href^="'+this.element.url+'"]'));	
	}else{
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

if(typeof $livePageConfig == "object"){var $livePage = new livePage($livePageConfig); $livePage.scanPage();}

/*
 * Displays debugging information.
 */
function $LivePageDebug(message){
	if($livePage.options.debug_mode == true){
		console.log('LivePage: ', message);
	}
};