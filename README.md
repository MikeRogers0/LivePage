# LivePage

LivePage is a developer tool which reloads website resources (such as CSS, HTML and JavaScript) as they change on the server, so you are always looking at the most up-to-date version of a web page. It can make developing websites a lot faster, by helping productivity. You can install LivePage via the [Chrome Web Store](https://chrome.google.com/webstore/detail/livepage/pilnojpmdoofaelbinaeodfpjheijkbh/details).

Features:
 * Entire domains can be made live
 * file:// protocol is now supported, though required "Allow access to file URLs" to be checked on the chrome extensions page.

It's recommended you use this extension only in a local development environment and not in a production environment.

## Running development version in Chrome

1. Clone this repo to your local machine. 
2. Then visit to `chrome://extensions/` in Chrome. 
3. Within the Extension page, check the "Developer Mode" checkbox. 
4. A button with the label "Load unpacked extension" should have appeared, click it. 
5. A modal will popup with your local file system, navigate to where you cloned the repo to and click "Select".

### Handy scripts for local development

#### Build the CSS

    sass -w css/options.scss:css/options.css

#### Run the local demo folder

    php -S 127.0.0.1:8000 -t demo/

## Roadmap

### 3.0.0

Version 3.0.0 will be primarily be aimed at making LivePage a better experience for non-english speakers. Here are they main stories I intend to do:

 * Simplify the english on the options pages.
 * ~~Localise the options page~~
 * Add translations for Spanish, ~~German~~, French & Russian. This can we done via the chrome store after confirming copy is a-ok!
 * Add permissions explanations into the description
 * ~~A new logo. I think I can come up with something the implies reloading more clearly.~~
 * ~~Update promotional images / videos. I really want to emphasise it simply polls for changes, but is simple to setup.~~
 * ~~I'm going to look into ways of monetising via LivePage. I'm undecided whether this will be by asking for donations or making 3.0 a paid for version. Either way, all current users shouldn't have to pay.~~
     * ~~I've adjusted the lisence to be AGPL. At the end of June 2016 I'll convert the extension in the chrome store to be free for 30 days, then a yearly subscription.~~

## Footnotes

Contribute on GitHub: https://github.com/MikeRogers0/LivePage

Find it in the Chrome Web Store: https://chrome.google.com/webstore/detail/pilnojpmdoofaelbinaeodfpjheijkbh/

Extension by: Mike Rogers ([@MikeRogers0](https://twitter.com/mikerogers0)) / [https://mikerogers.io/](https://mikerogers.io/)

Icon By: [Tibi Lehocz](https://creativemarket.com/VectorBurn)

LivePage was originally based on [LiveJS](http://livejs.com/) by [@mrtnkl](https://twitter.com/mrtnkl).
