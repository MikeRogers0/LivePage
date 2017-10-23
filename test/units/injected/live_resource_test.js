QUnit.module( "nonCacheURL", {
  beforeEach: function(){
    timekeeper.freeze(new Date());
  },
  afterEach: function(){
    timekeeper.reset();
  }
} );

QUnit.test( "Append the cache breaker when hard caching is enabled", function( assert ) {
  window.$livePage = {};
  window.$livePage.options = {};

  window.$livePage.options.use_hard_cache_breaker = true;

  assert.equal( new LiveResource('http://www.site.com/').nonCacheURL(), "http://www.site.com/"+ '?livePage=' + (new Date() * 1) );
  assert.equal( new LiveResource('http://www.site.com/?apple=true').nonCacheURL(), "http://www.site.com/?apple=true" + '&livePage=' + (new Date() * 1) );

  window.$livePage.options.use_hard_cache_breaker = false;
  assert.equal( new LiveResource('http://www.site.com/').nonCacheURL(), "http://www.site.com/" );
  assert.equal( new LiveResource('http://www.site.com/?apple=true').nonCacheURL(), "http://www.site.com/?apple=true" );
});
