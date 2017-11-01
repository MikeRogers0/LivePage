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

## "Price not available" in Chrome Web Store

If you are seeing "Price not available" as the only download option in Chrome Web Store, this is caused by Google not being able to determine your local currency. As a workaround, append `&gl=us` to the URL, for example : https://chrome.google.com/webstore/detail/livepage/pilnojpmdoofaelbinaeodfpjheijkbh?hl=en&gl=us

### Handy scripts for local development

#### Build the CSS

    sass -w css/options.scss:css/options.css

#### Run the local demo folder

    php -S 127.0.0.1:8000 -t demo/

### Testing

#### Setup the enviroment

Install npm, then run:

    npm install -g grunt-cli &&
    npm install

#### Run the tests (Qunit)

    grunt qunit:all

Or drag and drop the files from `/test/index.html` into your browser.

### Releasing

Run

    npm run release

Then upload the generated zip file to the chrome store.

## Roadmap

The upcoming milestones can be found [on the GitHub milestones](https://github.com/MikeRogers0/LivePage/milestones) page.

## Footnotes

Contribute on GitHub: https://github.com/MikeRogers0/LivePage

Find it in the Chrome Web Store: https://chrome.google.com/webstore/detail/pilnojpmdoofaelbinaeodfpjheijkbh/

Extension by: Mike Rogers ([@MikeRogers0](https://twitter.com/mikerogers0)) / [https://mikerogers.io/](https://mikerogers.io/)

Icon By: [Tibi Lehocz](https://creativemarket.com/VectorBurn)

LivePage was originally based on [LiveJS](http://livejs.com/) by [@mrtnkl](https://twitter.com/mrtnkl).
