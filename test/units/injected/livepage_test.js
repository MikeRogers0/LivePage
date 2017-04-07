QUnit.module( "normalizeURL" );

QUnit.test( "normalizeURL - Return everything before the # in a url when ignore_anchors is enabled", function( assert ) {
  assert.equal( new livePage({}).normalizeURL("http://www.site.com/"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: true}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: false}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/#hello" );
});


QUnit.test( "trackableURL - Returns boolean if a URL is external to the current site", function( assert ) {
  // Always return true when false as it means we want to track all resources.
  assert.equal( new livePage({skip_external: false}).trackableURL("http://www.site.com/"), true );

  assert.equal( new livePage({skip_external: true}).trackableURL("http://localhost/"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL(location.href), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("http://google.com/"), false );
});
