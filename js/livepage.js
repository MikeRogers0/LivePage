/* LivePage is based on Live.js by Martin Kool (@mrtnkl). */

function livePage($livePageConfig){
	// Set up some defaults variables
	this.options = $livePageConfig;
	this.options.enabled = true;
	this.resources = {};
	this.url = document.URL;
	this.resources.urls = {};
	this.resources.count = 0;
	this.headers = {"Etag": 1, "Last-Modified": 1, "Content-Length": 1};
	this.head = document.querySelector("head");
	this.body = document.querySelector('body');
	
	// Add the nice CSS morph
	if(this.options.use_css_transitions == true){
		style = document.createElement("style"),
		css = '.livepage-loading * {-webkit-transition: all .2s ease-in;}';
		style.setAttribute("type", "text/css");
		this.head.appendChild(style);
		style.appendChild(document.createTextNode(css));
		document.querySelector('html').className += ' livepage-loading';
	}
	
	// Ok snappy! Lets load the current page we have, save it & scan it for all the stuff we need.
	this.loadPage();
};

function $LivePageDebug(message){
	if($livePage.options.debug_mode == true){
		console.log('LivePage: ', message);
	}
};

// Load the current page were on & save the resonse.
livePage.prototype.loadPage = function(){
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.url+'?livePage='+(new Date() * 1), true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			$livePage.resources.page = xhr.responseText;
			$livePage.scanPage();
		}
	}
	xhr.send();
};

// Scans the page were on looking for resources.
livePage.prototype.scanPage = function(){
	$LivePageDebug('Scanning page for elements to monitor.');

	// turn the HTML recieved into a element so we can scan it easily.
 	var livePage_element = document.createElement('livePageDiv');
 	var elements = null;
	livePage_element.innerHTML = this.resources.page;
	
	elem_count = 0;
	
	// if the users wants to track it, add it to the resources object.
	if(this.options.monitor_css == true){
		// Cycle through all the elements & put them into a big object.
		elements = livePage_element.querySelectorAll('link[href*=".css"]');
		
		for(var key=0; key<elements.length; key++){
			if(this.isCheckable(elements[key].getAttribute('href'))){
				this.resources.urls[elem_count++] = {
					element: elements[key],
					url: this.cleanURL(elements[key].getAttribute('href')), 
					type: 'css',
					headers: {},
					cache: ''
				}
			}
		}
	}
	if(this.options.monitor_less == true){
		// Cycle through all the elements & put them into a big object.
		elements = livePage_element.querySelectorAll('link[href*=".less"]');
		for(var key=0; key<elements.length; key++){
			if(this.isCheckable(elements[key].getAttribute('href'))){
				this.resources.urls[elem_count++] = {
					element: elements[key],
					url: this.cleanURL(elements[key].getAttribute('href')), 
					type: 'less',
					headers: {},
					cache: ''
				}
			}
		}
	}
	if(this.options.monitor_js == true){
		elements = livePage_element.querySelectorAll('script[src*=".js"]');
		for(var key=0; key<elements.length; key++){
			if(this.isCheckable(elements[key].getAttribute('src'))){
				 this.resources.urls[elem_count++] = {
				 	url: this.cleanURL(elements[key].getAttribute('src')), 
				 	type: 'js',
				 	headers: {},
					cache: ''
				 }
			}
		}
	}
	if(this.options.monitor_html == true){
		if(this.isCheckable(this.url)){
			this.resources.urls[elem_count++] = {
			 	url: this.cleanURL(this.url), 
			 	type: 'html',
			 	headers: {},
				cache: ''
			 }
		 }
	}
	
	this.checkResources();
};

livePage.prototype.isCheckable = function(url){
	// from: http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
	if(this.options.skip_external == false){
		return true;
	}
	
	var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return false;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return false;
    return true;
}

livePage.prototype.cleanURL = function (url){
	// From http://jelaniharris.com/2008/remove-anchors-from-a-url-in-javascript/
	if(this.options.ignore_anchors == true){
		var a = document.createElement('a');
		a.href = url;
		return a.protocol+a.port+'//'+a.hostname+a.pathname+a.search;
	}
	return url;
}

// Remove comments and what not from the code.
livePage.prototype.tidyHTML = function(html){
	if(this.options.tidy_html == false){
		return html;
	}
	// Remove comments and whitespace.
	html = html.replace(/<!--(.*?)-->/gim, '');
	html = html.replace(/ /gim, '');
	html = html.replace(/(\r\n|\n|\r|\t)/gim,'');
	return html;
}

livePage.prototype.checkResources = function(){
	// check were turned on
	if(this.options.enabled !== true){
		return false;
	}

 	// Load the head
 	if(this.resources.urls[this.resources.count] == undefined){
 		this.resources.count = 0;
 	}
 	
	var xhr = new XMLHttpRequest();
	xhr.url = this.resources.urls[this.resources.count].url;
	xhr.type = this.resources.urls[this.resources.count].type;
	xhr.count = this.resources.count;

	$LivePageDebug(['Checking', xhr.url, this.resources.count]);
	
	if(xhr.type == 'html' || this.url.indexOf('file://') == 0){ // if it's local or html, we need to compare side by side.
		xhr.open('GET', xhr.url+'?livePage='+(new Date() * 1), false); 
	} else {
		xhr.open('HEAD', xhr.url+'?livePage='+(new Date() * 1), false); 
	}
	xhr.send();
	
	if (xhr.readyState == 4 && xhr.status != 304) {
	
		xhr.getAllResponseHeaders();
		var headersChanged = false;
		
		// If it's HTML, it might no-cache so check it like for like.
		if(xhr.type == 'html'){
			if(this.tidyHTML(xhr.responseText) != this.tidyHTML(this.resources.page)){
				headersChanged = true;
				this.resources.page = xhr.responseText; // Update our page cache. It should reload the page, but on file:// reloads are silly.
			}
		}else if(xhr.type != 'html' && xhr.status == 0){
			if(this.resources.urls[xhr.count].cache.length <= 1){ // Lets cache it this one time & compare later.
				this.resources.urls[xhr.count].cache = xhr.responseText;
			}
			if(xhr.responseText != this.resources.urls[xhr.count].cache){
				headersChanged = true;
				this.resources.urls[xhr.count].cache = xhr.responseText; // Update our cache.
			}
		} else {
			// Cycle through the headers and check them with the last one. 
			for (var h in this.headers) {
				if(this.resources.urls[xhr.count].headers[h] != undefined && this.resources.urls[xhr.count].headers[h] != xhr.getResponseHeader(h)){
					headersChanged = true;
				}
				this.resources.urls[xhr.count].headers[h] = xhr.getResponseHeader(h);
			}
		}
		
		if(headersChanged == true){
			$LivePageDebug(['Refreshing', xhr.url, xhr.type]);
			if(xhr.type == 'css'){
				this.refreshCSS(xhr.count);
			}else if(xhr.type == 'less'){
				this.refreshLESS(xhr.count);
			}else{
				this.reloadPage();
				return; // We are reloading, so stop all the things.
			}
		}
		
	}
	
	setTimeout(function(){$livePage.checkResources();}, this.options.refresh_rate);
	this.resources.count++;
};

livePage.prototype.refreshCSS = function(element){
	
	// create a new html element
	var cssElement = document.createElement('link');
	cssElement.setAttribute("type", "text/css");
	cssElement.setAttribute("rel", "stylesheet");
	cssElement.setAttribute("href", this.resources.urls[element].url + "?now=" + new Date() * 1);
	
	this.head.appendChild(cssElement);
	
	this.head.removeChild(document.querySelector('link[href^="'+this.resources.urls[element].url+'"]'));
 	
};

// Attempt to refresh the LESS CSS stuff
livePage.prototype.refreshLESS = function(element){
	// If the person has loaded the less JS libary
	$LivePageLESS.refresh(document.querySelector('link[href^="'+this.resources.urls[element].url+'"]'));	
};

livePage.prototype.reloadPage = function(){
 	//document.location.reload(this.url);
 	chrome.extension.sendMessage({action: 'reload'}, function(){});
};

// Start the script.
if(typeof $livePageConfig == 'object'){
	var $livePage = new livePage($livePageConfig);
}

