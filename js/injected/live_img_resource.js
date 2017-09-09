/*
 * LiveImgResource Object
 */

function LiveImgResource(url, element) {
  this.url = url;
  this.element = element;
}

LiveImgResource.prototype = new LiveResource();
LiveImgResource.prototype.constructor = LiveImgResource;

/*
 * Refresh the element in place
 */
LiveImgResource.prototype.refresh = function(){
  this.element.setAttribute("src", this.nonCacheURL());
}
