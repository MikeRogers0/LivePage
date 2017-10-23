/*
 * LiveResource Object
 */
function LiveResource(url) {
  this.url = url;
}

LiveResource.prototype.method = "GET";
LiveResource.prototype.cache = '';
LiveResource.prototype.response = '';
LiveResource.prototype.xhr = null;

/*
 * Generated a URL with a cache breaker in it.
 */
LiveResource.prototype.nonCacheURL = function() {
  if (window.$livePage.options.use_hard_cache_breaker === false) {
    return this.url;
  }

  if (this.url.indexOf('?') > 0) {
    return this.url + '&livePage=' + (new Date() * 1);
  }
  return this.url + '?livePage=' + (new Date() * 1);
}


/*
 * Checks if a newer version of the file is there.
 */
LiveResource.prototype.check = function(callback) {
  var _this = this;
  var _callback = callback;

  this.xhr = new XMLHttpRequest();

  this.xhr.open("GET", this.nonCacheURL());
  this.xhr.setRequestHeader('Cache-Control', 'no-cache');

  // Timeout or error, remove the resource
  this.xhr.ontimeout = this.xhr.onerror = function(){
    window.$livePage.removeResource(_this.url);
  }

  this.xhr.onreadystatechange = function() {

    // If it 404s, remove the resource
    if (this.status == 404) {
      window.$livePage.removeResource(_this.url);
    }

    if (this.readyState == 4){
      _callback();
    }

    if (this.readyState == 4 && this.status != 304) {
      // Firstly, tidy up the code
      _this.response = _this.tidyCode(this.responseText);

      // If this is the first check, cache it and than move along.
      if (_this.cache == '' && _this.response != '') {
        _this.cache = _this.response;
        return;
      }

      // Compare the headers && responseText
      if (_this.checkResponse()) {
        setTimeout(function(){
          window.$livePage.saveScrollPosition();
          _this.refresh();
        }, window.$livePage.options.refresh_delay);
      }
    }
  }
  this.xhr.onerror = function(){};
  this.xhr.send();
}

/*
 * Compares the responseText to the cached. 
 */
LiveResource.prototype.checkResponse = function() {
  if (this.response != '' && this.cache != this.response) {
    this.cache = this.response;
    return true;
  }
  return false;
}

/*
 * Refresh the code
 */
LiveResource.prototype.refresh = function() {
  // Now reload the page.
  try {
    // This can let us reload the page & force a cache reload.
    chrome.extension.sendMessage({
      action: 'reload'
    }, function() {});
  } catch (e) {
    // An error occoured refreshing the page with the chrome socket. Do it differently.
    document.location.reload(window.$livePage.url);
  }
}

/*
 * Tidies up HTML (Removes comments and whitespace), if the users wants.
 */
LiveResource.prototype.tidyCode = function(html) {
  if (window.$livePage.options.tidy_html == true) {
    // Remove comments and whitespace.
    html = html.replace(/<!--([\s\S]*?)-->/gim, '');
    html = html.replace(/  /gim, ' ');
    html = html.replace(/(\r\n|\n|\r|\t\s)/gim, '');

    // Remove CloudFlare's email protection URLs
    html = html.replace(/href\=\"\/cdn-cgi\/l\/email-protection#(.*?)"/gim, '');

    // Remove references to LivePages cache breaker
    html = html.replace(/livePage=([0-9]+)/gim, '');

    // Ignore doubleclick links
    html = html.replace(/"https:\/\/ad.doubleclick.net(.*?)"/gim, '');
  }

  if (window.$livePage.options.ignore_hidden_fields === true) {
    // Remove script tags and hidden inputs
    html = html.replace(/<input(.*?)hidden(.*?)>/gim, "");
  }

  if (window.$livePage.options.ignore_inline_js === true) {
    // Remove script tags and hidden inputs
    html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  }
  return html;
}
