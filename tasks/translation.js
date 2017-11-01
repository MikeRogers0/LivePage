var TJO = require('translate-json-object')();
var fs = require('fs');
var enTranslation = JSON.parse(fs.readFileSync('../_locales/en/messages.json', 'utf8'));
var enTranslationStoreDescription = JSON.parse(JSON.stringify({text: fs.readFileSync('../_locales/en/description_from_webstore.txt', 'utf8')}));

TJO.init({
  googleApiKey: 'api_key'
});

//var languages = ['af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gu', 'ha', 'haw', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'ma', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'ny', 'pl', 'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh-CN', 'zh-TW', 'zu']
var languages = ['de', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'ko', 'zh-CN', 'zh-TW']

var targetLanguage = 'pt';

// Uses promises to run all the languages one after the other.
TJO.translate(enTranslation, targetLanguage)
  .then(function(data) {
    if (!fs.existsSync('../_locales/' + targetLanguage)){
      fs.mkdirSync('../_locales/' + targetLanguage);
    }
    fs.writeFileSync('../_locales/' + targetLanguage + '/messages.json', JSON.stringify(data, null, 2), 'utf8');
  }).catch(function(err) {
    console.log('error ', err)
  });
