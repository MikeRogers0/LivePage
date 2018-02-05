/* 
 * LivePage is based on Live.js by Martin Kool (@mrtnkl). 
 * Rewritten by Mike Rogers (@MikeRogers0)
 */
function livePage(config) {
  // Set up some defaults variables
  this.options = config;
  this.options.enabled = true;
  this.resources = [];
  this.lastChecked = 0;
  this.url = document.URL;
};

/*
 * Asks the page to scan itself, than looks for elements to track.
 */
livePage.prototype.scanPage = function() {
  // Add resources checkers in here
  if (this.options.monitor_css == true) {
    this.scanCSS();
  }

  if (this.options.monitor_js == true) {
    this.scanJS();
  }

  if (this.options.monitor_img == true) {
    this.scanImg();
  }

  if (this.options.monitor_custom == true) {
    this.scanCustom();
  }

  if (this.options.monitor_html == true) {
    this.addResource( new LiveResource(this.url) );
  }

  // Randomise the checking process, so were not hitting groups the same of files.
  this.resources.sort(function() {
    return 0.5 - Math.random();
  });

  this.checkBatch();
}

livePage.prototype.scanJS = function(){
  elements = document.querySelectorAll('script[src*=".js"]');
  for (var key = 0; key < elements.length; key++) {
    this.addResource(new LiveResource(elements[key].src));
  }
};

livePage.prototype.scanImg = function(){
  elements = document.querySelectorAll('img[src*="."]');
  for (var key = 0; key < elements.length; key++) {

    this.addResource(new LiveImgResource(elements[key].src, elements[key]));
  }
};

livePage.prototype.scanCSS = function(){
  styleSheets = document.styleSheets;

  for (var key = 0; key < styleSheets.length; key++) {
    var sheet = styleSheets[key];

    if (sheet) {
      // If it has a href we can monitor
      if (sheet.href) {
        this.addResource(new LiveCSSResource(sheet.href, sheet.media.mediaText, sheet.ownerNode));
      }

      // Now lets checks for @import stuff within this stylesheet.
      try {
        if (sheet.cssRules != null && sheet.cssRules.length > 0) {
          for (var ruleKey = 0; ruleKey < sheet.cssRules.length; ruleKey++) {
            var rule = sheet.cssRules[ruleKey];
            if (rule && rule.href && rule.styleSheet.href) {
              this.addResource(new LiveResource(rule.styleSheet.href));
            }
          }
        }
      } catch(error) {
        // TODO
        // External stylesheets don't let me read their rules anymore. I'll have
        // parse their contents by reading them with AJAX (boo!).
      }
    }
  }
};

livePage.prototype.scanCustom = function(){
  elements = document.querySelectorAll('link[rel="livePage"]');
  for (var key = 0; key < elements.length; key++) {
    if (elements[key].href) {
      this.addResource(new LiveResource(elements[key].href));
    }
  }
};

/*
 * Adds live resources to the list of trackable objects.
 */
livePage.prototype.addResource = function(resource) {
  // Normalize the URL
  resource.url = this.normalizeURL(resource.url);

  // Check the URL is ok
  if (!this.trackableURL(resource.url)) {
    return false;
  }

  this.resources[this.lastChecked++] = resource;
}

/*
 *
 */
livePage.prototype.removeResource = function(url) {
  for (r in this.resources) {
    if (this.resources[r].url == url) {
      delete this.resources[r];
    }
  }

  // Now shuffle the stack.
  this.resources.sort(function() {
    return 0.5 - Math.random();
  });
}

/*
 * Normalise the URL. - Remove anything after a #
 */
livePage.prototype.normalizeURL = function(url) {

  if (this.options.ignore_anchors == true) {
    url = url.split('#');
    return url[0];
  }
  return url;
}

/*
 * saveScrollPosition / restoreScrollPosition
 * Keeps page looking at some scrolll position
 * Handy for when you're working on the bottom of a page between
 * reloads and redraws.
 */
livePage.prototype.saveScrollPosition = function() {
  if( !this.options.persist_scroll_points || !this.supportsSessionStorage() ){
    return;
  }

  sessionStorage.setItem("livepage-scrollpoints", JSON.stringify({
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }));
}

livePage.prototype.restoreScrollPosition = function() {
  if( !this.options.persist_scroll_points || !this.supportsSessionStorage() ){
    return;
  }
  
  var scrollPoints = JSON.parse(sessionStorage.getItem("livepage-scrollpoints"));

  // No points? Don't restore anything.
  if(scrollPoints == null){
    return false;
  }

  window.scroll(scrollPoints.scrollX, scrollPoints.scrollY);

  sessionStorage.removeItem("livepage-scrollpoints");
}

livePage.prototype.supportsSessionStorage = function() {
  try {
    window.sessionStorage
  } catch( e ) {
    return false;
  }
  return true;
}

/*
 * Tells LivePage if the URL is ok.
 */
livePage.prototype.trackableURL = function(url) {
  if (this.options.skip_external == false) {
    return true;
  }

  // Always return true for Localhosts
  if(
    url.indexOf("localhost") !== -1 || 
    url.indexOf("127.0.0.1") !== -1 ||
    url.indexOf("file://") !== -1 
  ){
    return true;
  }

  var parsedUrl = document.createElement('a');
  parsedUrl.href = url;

  // When no host exists, return we can track this.
  if(parsedUrl.host === "" ){
    return true;
  }

  // The hosts match, we can track this.
  if(location.href.indexOf( parsedUrl.host ) !== -1 ){
    return true;
  }

  return false;
}

/*
 * Lets us check the resources in small batches.
 */
livePage.prototype.checkBatch = function() {
  if (this.options.enabled == false) {
    return false;
  }
  this.check();
}

/*
 * Triggers a resource check.
 */
livePage.prototype.check = function() {
  // Que up the next resource, if it dosen't exist start again.
  this.lastChecked++;
  if (this.resources[this.lastChecked] == undefined) {
    this.lastChecked = 0;
    if (this.resources[this.lastChecked] == undefined) { // Nothing left to check
      window.$livePage.options.enabled = false;
      return;
    }
  }

  this.resources[this.lastChecked].check(function(){
    setTimeout(function() { 
      if( typeof(window.$livePage.checkBatch) == "function" ){
        window.$livePage.checkBatch();
      }
    }, window.$livePage.options.refresh_rate);
  });
}

if (typeof window.$livePageConfig == "object") {
  window.$livePage = new livePage(window.$livePageConfig);
  window.$livePage.restoreScrollPosition();
  window.$livePage.scanPage();
}
