// Based on http://pastebin.com/3deXunJV because Chromes API dosen't throw errors!

chrome.extension.onRequest.addListener(function(req, sender, respond) {
   if (req === 'Ping') {
       respond('Pong');
   }
});