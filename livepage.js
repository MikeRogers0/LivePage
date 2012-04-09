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

// Load the current page were on & save the resonse.
livePage.prototype.loadPage = function(){
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			$livePage.resources.html = xhr.responseText;
			$livePage.scanPage();
		}
	}
	xhr.send();
};

// Scans the page were on looking for resources.
livePage.prototype.scanPage = function(){
	// turn the HTML recieved into a element so we can scan it easily.
 	var livePage_element = document.createElement('livePageDiv');
	livePage_element.innerHTML = this.resources.html;
	
	elem_count = 0;
	
	// if the users wants to track it, add it to the resources object.
	if(this.options.monitor_css == true){
		// Cycle through all the elements & put them into a big object.
		var elements = livePage_element.querySelectorAll('link[href*="css"]');
		for(var key=0; key<elements.length; key++){
			if(this.isCheckable(elements[key].getAttribute('href'))){
				this.resources.urls[elem_count++] = {
					element: elements[key],
					url: elements[key].getAttribute('href'), 
					type: 'css',
					headers: {}
				}
			}
		}
	}
	if(this.options.monitor_js == true){
		var elements = livePage_element.querySelectorAll('script[src*="js"]');
		for(var key=0; key<elements.length; key++){
			if(this.isCheckable(elements[key].getAttribute('src'))){
				 this.resources.urls[elem_count++] = {
				 	url: elements[key].getAttribute('src'), 
				 	type: 'js',
				 	headers: {}
				 }
			}
		}
	}
	if(this.options.monitor_html == true){
		if(this.isCheckable(this.url)){
			this.resources.urls[elem_count++] = {
			 	url: this.url, 
			 	type: 'html',
			 	headers: {}
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

livePage.prototype.checkResources = function(){
	// check were turned on
	if(this.options.enabled !== true){
		return false;
	}

 	// Load the head
 	if(this.resources.urls[this.resources.count] == undefined){
 		this.resources.count = 0;
 	}
 	
	//console.log('Checking at '+new Date() * 1+': '+this.resources.urls[this.resources.count].url);
	var xhr = new XMLHttpRequest();
	xhr.url = this.resources.urls[this.resources.count].url;
	xhr.type = this.resources.urls[this.resources.count].type;
	xhr.count = this.resources.count;
	
	if(xhr.type == 'html'){
		xhr.open('GET', xhr.url+'?livePage='+(new Date() * 1), true);
	} else {
		xhr.open('HEAD', xhr.url+'?livePage='+(new Date() * 1), true); // if it's html, we need to compare side by side.
	}
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status != 304) {
		
			xhr.getAllResponseHeaders();
			// Cycle through the headers and check them with the last one. 
			var headersChanged = false;
			for (var h in $livePage.headers) {
				if($livePage.resources.urls[xhr.count].headers[h] != undefined && $livePage.resources.urls[xhr.count].headers[h] != xhr.getResponseHeader(h)){
					headersChanged = true;
				}
				$livePage.resources.urls[xhr.count].headers[h] = xhr.getResponseHeader(h);
			}
			
			// Do a check on the html.
			if(xhr.type == 'html' && headersChanged != true){
				if(xhr.responseText != $livePage.resources.html){
					headersChanged = true;
				}
			}
			
			if(headersChanged == true){
				//console.log(xhr.url + ' - updated');
				if(xhr.type == 'css'){
					$livePage.refreshCSS(xhr.count);
				}else{
					$livePage.reloadPage();
					return; // were reloading, so stop all the thing.
				}
			}
		}
	}
	xhr.send();
	this.resources.count++;
 	setTimeout(function(){$livePage.checkResources();}, this.options.refresh_rate);
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

livePage.prototype.reloadPage = function(){
 	document.location.reload(this.url);
};

// Start the script.
var $livePage = new livePage($livePageConfig);

