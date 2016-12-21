QUnit.module("LivePage injected file", {
  beforeEach: function(){
    // Rescope the document?
  }
});

// normalizeURL
QUnit.test( "normalizeURL - Return everything before the # in a url when ignore_anchors is enabled", function( assert ) {
  assert.equal( new livePage({}).normalizeURL("http://www.site.com/"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: true}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: false}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/#hello" );
});
