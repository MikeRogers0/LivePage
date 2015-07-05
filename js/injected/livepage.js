/* 
 * LivePage is based on Live.js by Martin Kool (@mrtnkl). 
 * Rewritten by Mike Rogers (@MikeRogers0)
 */
function livePage(config) {
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

    // if we have a sessionStorage of the last updated resource, pop it in.
    if (sessionStorage['LivePage_LastUpdatedResource'] != undefined) {
        this.lastUpdatedResource = JSON.parse(sessionStorage.getItem('LivePage_LastUpdatedResource'));
    }
};

/*
 * Asks the page to scan itself, than looks for elements to track.
 */
livePage.prototype.scanPage = function () {
    // Add resources checkers in here
    if (this.options.monitor_css == true) {
        elements = document.querySelectorAll('link[href*=".css"]');
        for (var key = 0; key < elements.length; key++) {
            this.addResource(elements[key].href, 'css', false, elements[key].media);
        }

        styleSheets = document.styleSheets;

        for (var key = 0; key < styleSheets.length; key++) {
            var sheet = styleSheets[key];

            if (sheet) {
                // If it has a href we can monitor
                if (sheet.href) {
                    this.addResource(sheet.href, 'css', false, sheet.media.mediaText);
                    var sheet_folder = sheet.href.replace(sheet.href.split('/').pop(), '');
                }else{
	                var sheet_folder = '';
                }
                
                if (sheet.cssRules) {
                    // Now lets checks for @import stuff within this stylesheet.
                    for (var ruleKey = 0; ruleKey < sheet.cssRules.length; ruleKey++) {
                        var rule = sheet.cssRules[ruleKey];

                        if (rule && rule.href) {
                            var rule_href = (function () {
                                var stack = sheet_folder.replace(/\/$/, '').split('/'),
                                    parts = rule.href.split('/');
                                for (var i = 0; i < parts.length; i++) {
                                    if (parts[i] == '.') continue;
                                    if (parts[i] == '..') stack.pop();
                                    else stack.push(parts[i]);
                                }
                                return stack.join('/');
                            });

                            this.addResource(rule_href(), 'css', false, rule.media.mediaText);
                        }
                    }
                }
            }
        }
    }

    if (this.options.monitor_js == true) {
        elements = document.querySelectorAll('script[src*=".js"]');
        for (var key = 0; key < elements.length; key++) {
            this.addResource(elements[key].src, 'js', false, false);
        }
    }
    
    if(this.options.monitor_custom == true){
		elements = document.querySelectorAll('link[rel="livePage"]');
		for(var key=0; key<elements.length; key++){
			fileType = elements[key].href.split('.').pop();
			if (['css','html','js'].indexOf(fileType)){
				this.addResource(elements[key].href, 'custom', false);
			}
		}
	}

    if (this.options.monitor_html == true) {
        this.addResource(this.url, 'html', false, false);
    }

    // Randomise the checking process, so were not hitting groups the same of files.
    this.resources.sort(function () {
        return 0.5 - Math.random();
    });

    // Add the last resource updated to a more frequently checked list.
    if (this.lastUpdatedResource != null & this.lastChecked > 4) {

        if ((this.lastUpdatedResource.type == 'js' && this.options.monitor_js == true) || (this.lastUpdatedResource.type == 'html' && this.options.monitor_html == true)) {
            // Add it to the superior resources list.
            this.addResource(this.lastUpdatedResource.url, this.lastUpdatedResource.type, true, this.lastUpdatedResource.media);
        }
    }

    this.checkBatch();
}

/*
 * Adds live resources to the objects.
 */
livePage.prototype.addResource = function (url, type, superior, media) {
    // Normalize the URL
    url = this.normalizeURL(url);

    // Check the URL is ok
    if (!this.trackableURL(url)) {
        return false;
    }

    if (superior == true) {
        this.superiorResource = new LiveResource(url, type, media);
        return;
    }

    this.resources[this.lastChecked++] = new LiveResource(url, type, media);

}

/*
 *
 */
livePage.prototype.removeResource = function (url) {
    for (r in this.resources) {
        if (this.resources[r].url == url) {
            delete this.resources[r];
        }
    }

    // Now shuffle the stack.
    this.resources.sort(function () {
        return 0.5 - Math.random();
    });
}

/*
 * Normalise the URL. Right now, just removes anything after hash.
 */
livePage.prototype.normalizeURL = function (url) {

    if (this.options.ignore_anchors == true) {
        url = url.split('#');
        return url[0];
    }
    return url;
}

/*
 * Tells LivePage if the URL is ok.
 */
livePage.prototype.trackableURL = function (url) {
    // from: http://stackoverflow.com/questions/6238351/fastest-way-to-detect-external-urls
    if (this.options.skip_external == false) {
        return true;
    }

    match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return false;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + {
        "http:": 80,
        "https:": 443
    }[location.protocol] + ")?$"), "") !== location.host) return false;
    return true;
}

/*
 * Lets us check the resources in small batches.
 */
livePage.prototype.checkBatch = function () {
    if (this.options.enabled == false) {
        return false;
    }

    // Run the superior resource in every batch.
    if (this.superiorResource != null) {
        this.superiorResource.check();
    }

    this.check();

    setTimeout(function () {
        $livePage.checkBatch();
    }, this.options.refresh_rate);
}

/*
 * Triggers a resource check.
 */
livePage.prototype.check = function () {
    // Que up the next resource, if it dosen't exist start again.
    this.lastChecked++;
    if (this.resources[this.lastChecked] == undefined) {
        this.lastChecked = 0;
        if (this.resources[this.lastChecked] == undefined) { // Nothing left to check
            $livePage.options.enabled = false;
            return;
        }
    }

    // Store lastChecked incase the next check runs before this one finishes.
    var lastChecked = this.lastChecked;

    // Check the superior resource. If we do, make sure we don't check it with the non-superior object.
    if (this.superiorResource != null) {
        if (this.superiorResource.url != this.resources[lastChecked].url) {
            this.resources[lastChecked].check();
        } else {
            this.resources[lastChecked] = this.superiorResource;
        }
    } else {
        this.resources[lastChecked].check();
    }
}

if (typeof $livePageConfig == "object") {
    var $livePage = new livePage($livePageConfig);
    $livePage.scanPage();
}
