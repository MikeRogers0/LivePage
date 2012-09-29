/* 
 * LivePage is based on Live.js by Martin Kool (@mrtnkl). 
 * Rewritten by Mike Rogers (@MikeRogers0)
 */

/*
 * Displays debugging information.
 */
function $LivePageDebug(message){
	if($livePage.options.debug_mode == true){
		console.log('LivePage: ', message);
	}
};

function livePage($livePageConfig){
	// Set up some defaults variables
	this.options = $livePageConfig;
	this.options.enabled = true;
	this.resources = array ();
	/*this.resources[0] = {
		urL: document.URL,
		type: 'html',
		headers: {},
		element: null,
		cache: ''	
	};*/
	this.url = document.URL;
	this.headers = {"Etag": 1, "Last-Modified": 1, "Content-Length": 1};
	this.head = document.querySelector("head");
	this.html = document.querySelector('html');
	
	// Add the nice CSS morph
	if(this.options.use_css_transitions == true){
		css = document.createTextNode('.livepage-loading * {-webkit-transition: all .2s ease-in;}');
		style = document.createElement("style").setAttribute("type", "text/css").appendChild(css);
		
		this.head.appendChild(style);
		this.html.className += ' livepage-loading';
	}
	
	// Ok snappy! Lets load the current page we have, save it & scan it for all the stuff we need.
	this.scanPage();
};

/*
 * Asks the page to scan itself, than looks for elements to track.
 */
livePage.prototype.scanPage = function(){
	$LivePageDebug(['Scanning page', this.url]);
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.url, false);
	xhr.send({'livePage': (new Date() * 1)});
	
	// Make the resonse page an element & scan it
	var livePage_element = document.createElement('livePageDiv');
	livePage_element.innerHTML = xhr.responseText;
	
}

/*
 * Adds live resources to the objects.
 */
livePage.prototype.addLiveResource = function(url, type){
	// Do some checks
	// this.resources - count
	this.resources[0] = new LiveResource(url, type);
}

/*
 * Triggers a resource check.
 */
livePage.prototype.check = function(){
	this.resources[0].check();
	// Set the timeout to trigger this in 500 ms.
}

/*
 * LiveResource Object
 */
function LiveResource(url, type){
	this.url = url;
	this.type = type;
	this.method = 'GET';
	this.headers = {};
	this.element = null;
	this.cache = '';
}

LiveResource.prototype.check = function(){
	$LivePageDebug(['Checking', this.url]);
	
	var xhr = new XMLHttpRequest();
	xhr.open(this.method, this.url, false);
	xhr.send({'livePage': (new Date() * 1)});
	
	
}