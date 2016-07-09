/*
 * i18n Helper
 * Makes working with googles i18n a touch cleaner.
 */
function i18nHelper(){}

// Depending on users 'entire_hosts' setting returns 
// @enable_on_this_(page/site)
// Allows us to be more specifc with 18in
i18nHelper.prototype.enable_on = function(){
  return chrome.i18n.getMessage(settings.options.entire_hosts ? "@enable_on_this_host" : "@enable_on_this_page");
}

i18nHelper.prototype.disable_on = function(){
  return chrome.i18n.getMessage(settings.options.entire_hosts ? "@disable_on_this_page" : "@disable_on_this_host");
}

i18nHelper.prototype.url_list_empty = function(){
  return chrome.i18n.getMessage("@options_url_list_empty");
}

/*
 * Populates a span with the key from the i18n
 */
i18nHelper.prototype.populateElementsCopy = function(){
  inputElements = document.querySelectorAll('input[data-i18n-key]');
  spanElements = document.querySelectorAll('[data-i18n-key]:not(input)');

  for (var key = 0; key < inputElements.length; key++) {
    var inputElement = inputElements[key]
    inputElement.value = chrome.i18n.getMessage(inputElement.attributes["data-i18n-key"].value)
  }

  for (var key = 0; key < spanElements.length; key++) {
    var spanElement = spanElements[key]
    spanElement.innerText = chrome.i18n.getMessage(spanElement.attributes["data-i18n-key"].value)
  }
}
