# Changelog

All future milestones & current issues can be found on https://github.com/MikeRogers0/LivePage/issues

## [2.0.0](https://github.com/MikeRogers0/LivePage/tree/2.0.0) (2016-05-20)

 - Fixed bug where files being served from `http://localhost/` where not treated as local file.
 - Updating options page to read more clearly
 - Changed options to run in new [chrome style](https://developer.chrome.com/extensions/optionsV2). I didn't add support for [chrome.storage.sync](https://developer.chrome.com/extensions/storage) as it would require a change in permissions.
 - Bumping to 2.0.0 - It's a pretty major change.

## 1.6.0

 - A small code tidy up.

## [1.5.3](https://github.com/MikeRogers0/LivePage/tree/1.5.3) (2015-08-22)
 - Fixing a bug where linking to CSS files was erroring out.

## [1.5.2](https://github.com/MikeRogers0/LivePage/tree/1.5.2) (2015-03-07)
 - Removing LESS support, the setup I had for LESS support was not viable long term. Instead LESS has its own way of keeping its own CSS fresh ( http://lesscss.org/usage/#using-less-in-the-browser-watch-mode ). 

## 1.5.1
 - Updating version of LESS from 1.3.0 to 1.4.1

## 1.5.0
 - Support added for monitoring additional html, css, js and less files using <link rel="livePage" href="/path/to/file"> in your HTML (Thank you to micflan for this).
 - Improved support for where @import is used in an externall CSS file (Thanks damirfoy!).

## 1.4.4
 - Patching issue where @import was not working on file:// protocol.

## 1.4.3
 - Fixing bug with inline CSS @imports not loading correctly.

## 1.4.2
 - Adding support for @import
 - Fixing bug where changing session will not affect superior resources.
 - Adding option to ignore inline JavaScript & hidden form values. 
 - Added in option to force GET requests.
 - Scans the pages using document, instead of doing an ajax request - could mess up massivly.

## 1.4.1
 - Fallback for when sockets between the background tab & livepage fails.
 - LivePage now respects url parameters while cache breaking.

## 1.4.0.0
 - Massively tidied up the livepage.js file.
 - Fixed bug where localhost URLs can be problematic.
 - Improved fault tolerance  when polling URLs
 - Added "the file your working on get polled more often" feature.  
 - Made "Check for newer resources every" a range field, new default for this option is 200ms from 750ms (new code structure is more efficient)
 - Rearranged options page to be a little more tidier.

## 1.3.1.2
 - Fixed bug where sometimes html changes were not detected.
 - Moved queue push higher up the script, so it should run faster.

## 1.3.1.1

 - Added option to ignore anchors in URLs. Thanks gsurrel for noticing.
 -  Small improvement upon I18n & L10n. 
 - AJAX requests now not async, this makes the backend code a little tidier.


## 1.3.1.0

 - Added a test to check for if the "Allow access to file URLs" had been checked. 

## 1.3.0.0

 - Adding in Less, enite domain and file:// protocol support.
