var TJO = require('translate-json-object')();
var fs = require('fs');
var enTranslation = JSON.parse(fs.readFileSync('../_locales/en/messages.json', 'utf8'));

TJO.init({
  googleApiKey: 'api_key',
  yandexApiKey: 'api_key'
});

//console.log(enTranslation);

var languages = ['zh']
var targetLanguage = null;

for(i in languages) {
  var targetLanguage = languages[i];

  TJO.translate(enTranslation, targetLanguage)
    .then(function(data) {
      if (!fs.existsSync('../_locales/' + targetLanguage)){
        fs.mkdirSync('../_locales/' + targetLanguage);
      }
      fs.writeFileSync('../_locales/' + targetLanguage + '/messages.json', JSON.stringify(data, null, 2), 'utf8');
    }).catch(function(err) {
      console.log('error ', err)
    });
}
