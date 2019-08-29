/*
 * The Settings object, it stores users options.
 */
function Settings() {
  // Set the default options:
  this.options = {
    monitor_css: true,
    monitor_js: true,
    monitor_html: true,
    monitor_img: false,
    monitor_custom: true,
    hosts_session: false,
    skip_external: true,
    entire_hosts: false,
    ignore_anchors: true,
    tidy_html: true,
    ignore_hidden_fields: true,
    ignore_inline_js: true,
    refresh_rate: 200,
    refresh_delay: 1,
    persist_scroll_points: true,
    use_hard_cache_breaker: false,
    blocked_url_list: [
      "https://sample-blocked-host.com/",
      "sample-blocked-file.js",
      "/jquery.min.js",
      "/bootstrap.min.css",
      "fonts.googleapis.com",
      ".bootstrapcdn.com",
      "maxcdn.bootstrapcdn.com",
      "://code.jquery.com/",
      "://pagecdn.io/",
      "://cdnjs.cloudflare.com",
      "://cdn.jsdelivr.net",
      "://ajax.googleapis.com",
      "://ajax.aspnetcdn.com",
      "://unpkg.com"
    ]
  };

  // Check for old settings and do the upgrade
  this.refresh();
};

/*
 * LocalStorage functions based on https://github.com/Gaya/Locale-Storager
 */
Settings.prototype.set = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};
Settings.prototype.get = function(key) {
  // if we don't have the setting, fallback to the default one.
  var getSetting = JSON.parse(localStorage.getItem(key));
  if (getSetting !== null) {
    return getSetting;
  }
  //console.log(key+' : '+getSetting+' so returning '+this.options[key]);
  return this.options[key];
};
Settings.prototype.remove = function(key) {
  localStorage.removeItem(key);
  return true;
};
Settings.prototype.refresh = function() {
  for (var key in this.options) {
    this.options[key] = this.get(key);
  }
  return true;
};

var settings = new Settings();
