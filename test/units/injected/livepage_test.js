QUnit.module( "normalizeURL" );

QUnit.test( "Return everything before the # in a url when ignore_anchors is enabled", function( assert ) {
  assert.equal( new livePage({}).normalizeURL("http://www.site.com/"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: true}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/" );
  assert.equal( new livePage({ignore_anchors: false}).normalizeURL("http://www.site.com/#hello"), "http://www.site.com/#hello" );
});

QUnit.module( "trackableURL" );

QUnit.test( "When dosen't want to skip external, return true for all.", function( assert ) {
  // Always return true when false as it means we want to track all resources.
  assert.equal( new livePage({skip_external: false}).trackableURL("http://www.site.com/"), true );
  assert.equal( new livePage({skip_external: false}).trackableURL("http://localhost/somethingelse"), true );
});

QUnit.test( "Returns boolean if a URL is external to the current site", function( assert ) {
  // Return true for localhosts
  assert.equal( new livePage({skip_external: true}).trackableURL("http://localhost/"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("https://127.0.0.1/"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("file:///Users/SomeFile.html"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("SomeFile.html"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("user/SomeFile.html"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("/User/SomeFile.html"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("http://localhost/somethingelse"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("http://localhost:3300/"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL("http://localhost:3300/somethingelse"), true );
  assert.equal( new livePage({skip_external: true}).trackableURL(location.href), true );

  // Ignore external stuff
  assert.equal( new livePage({skip_external: true}).trackableURL("https://google.com/"), false);
  assert.equal( new livePage({skip_external: true}).trackableURL("https://google.com/thefilename"), false);
});
