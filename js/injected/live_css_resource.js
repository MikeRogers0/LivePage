/*
 * LiveCSSResource Object
 */

function LiveCSSResource(url, media, ownerNode) {
  this.url = url;
  this.element = ownerNode;
  this.media = media;
}

LiveCSSResource.prototype = new LiveResource();
LiveCSSResource.prototype.constructor = LiveCSSResource;

/*
 * Refresh the element in place
 */
LiveCSSResource.prototype.refresh = function(){
  var _this = this;
  // create a new html element
  var cssElement = document.createElement('link');
  cssElement.setAttribute("type", "text/css");
  cssElement.setAttribute("rel", "stylesheet");
  cssElement.setAttribute("href", this.nonCacheURL() + "?LivePage=" + new Date() * 1);
  cssElement.setAttribute("media", this.media);

  cssElement.addEventListener("load", function(){
    _this.element.parentNode.removeChild(_this.element);

    // Update reference
    _this.element = cssElement;

    // Restore the scroll point
    $livePage.restoreScrollPosition();
  });

  // Replace the new one in the palace of the old one.
  this.element.parentNode.insertBefore(cssElement, this.element)
}
