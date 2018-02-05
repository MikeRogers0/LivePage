# Changelog

All future milestones & current issues can be found on https://github.com/MikeRogers0/LivePage/issues

## [2.6.8](https://github.com/MikeRogers0/LivePage/tree/2.6.8) (2018-02-05)

 - Suppressing the "email me" message until I can work on a proper fix.

## [2.6.7](https://github.com/MikeRogers0/LivePage/tree/2.6.7) (2018-02-02)

 - Adding Try/Catch around stylesheet error - Couldn't recreate it, but users reported it.

## [2.6.5](https://github.com/MikeRogers0/LivePage/tree/2.6.5) (2017-11-01)

 - Added automated translation script. 
 - Added Chinese translation

## [2.6.4](https://github.com/MikeRogers0/LivePage/tree/2.6.4) (2017-11-01)

 - Making cache breaker optional - Thanks @Opensourcecommunitydevelopment

## [2.6.3](https://github.com/MikeRogers0/LivePage/tree/2.6.3) (2017-09-11)

 - Fix for duplicate cache breaker in URL - Thanks @Opensourcecommunitydevelopment

## [2.6.2](https://github.com/MikeRogers0/LivePage/tree/2.6.2) (2017-07-09)

 - Fix for trackable URL when no hosts exists.

## [2.6.1](https://github.com/MikeRogers0/LivePage/tree/2.6.1) (2017-07-09)

 - Reports of LivePage just stopping working we're reported, changing where I got the URL from when testing trackable URLs.

## [2.6.0](https://github.com/MikeRogers0/LivePage/tree/2.6.0) (2017-07-08)

 - Fixing bug where urls with ports were always considered an external resource.

## [2.5.2](https://github.com/MikeRogers0/LivePage/tree/2.5.2) (2017-04-06)

 - Fixing issue where localhost not considered an external host.

## [2.5.1](https://github.com/MikeRogers0/LivePage/tree/2.5.1) (2017-03-08)

 - Correcting Portuguese (Brazil) translations folder location.

## [2.5.0](https://github.com/MikeRogers0/LivePage/tree/2.5.0) (2017-02-28)

 - We now have Japanese and Portuguese (Brazil) translations.

## [2.4.4](https://github.com/MikeRogers0/LivePage/tree/2.4.4) (2017-02-20)

 - Fix to not throw error when using sessionStorage on file:// protocols. #93 - Thanks you @gromimol for reporting.

## [2.4.3](https://github.com/MikeRogers0/LivePage/tree/2.4.3) (2017-01-20)

 - Fix to stop LivePage crashing when resource throws a 503 error #88. Thank you @timsayshey !

## [2.4.2](https://github.com/MikeRogers0/LivePage/tree/2.4.2) (2017-01-09)

 - Fixes typo where settings page was unable to load. Fixes #82 

## [2.4.1](https://github.com/MikeRogers0/LivePage/tree/2.4.1) (2017-01-08)

 - Fixes issue where LivePage would be injected multiple times #81

## [2.4.0](https://github.com/MikeRogers0/LivePage/tree/2.4.0) (2017-01-02)

 - Split Ignore inline JavaScript & hidden fields in HTML into two different options. #74
 - "Monitor adhoc files using:"" would be better worded "Monitor files specified using:". #75
 - Add test suite #77 - It's only simple, but long term I can start building more confidently. 

## [2.3.2](https://github.com/MikeRogers0/LivePage/tree/2.3.2) (2016-11-26)

 - A correct fix for "Cannot read property 'refresh_rate' of undefined" bug #71 - Thank you @codeandcats

## [2.3.1](https://github.com/MikeRogers0/LivePage/tree/2.3.1) (2016-11-04)

 - Improvements to translations and removing a hardcoded string. Thank you @Hativ3 !

## [2.3.0](https://github.com/MikeRogers0/LivePage/tree/2.3.0) (2016-11-03)

 - Adding in refresh delay setting into options to help users who have a multistep build process. Thanks @arechsteiner
 - Only saving settings on options page if they're valid, otherwise it's revert to the default option.
 - Adding experimental image support.
 - Added extra note in the options page asking for a review.
 - Rescoping `$livePage` to be `window.$livePage` with a check that `checkBatch()` is a function before we try and run it.

## [2.2.3](https://github.com/MikeRogers0/LivePage/tree/2.2.3) (2016-07-30)

  - Added Spanish, Russian and French translations
  - Improved phrasing for describing Omnibar. It's now refered to as address bar. Closed #54
  - Simplified "Changes on the server" phrasing to be "updated on the server". Closed #55

## [2.2.2](https://github.com/MikeRogers0/LivePage/tree/2.2.2) (2016-07-09)

  - Added German translations

## [2.2.1](https://github.com/MikeRogers0/LivePage/tree/2.2.1) (2016-07-09)

  - Setup options page for internationalisation
  - Added en_US and en_GB transations. Closes #51.
  - Fixes issue where ports were not showing correct on options page. Closes #48.
  - LivePage now attempts to persist the scroll position between reloads/redraws, closes #50 - Thank you @arechsteiner 

## [2.2.0](https://github.com/MikeRogers0/LivePage/tree/2.2.0) (2016-06-24)

  - New logo / icon
  - Bugfix for 404's not being remove from global list correctly, fixes #49 - thank you @CodinCat

## [2.1.1](https://github.com/MikeRogers0/LivePage/tree/2.1.1) (2016-06-02)

 - Fixes #39 where CSS stylesheets outside of the `<head>` tag threw an error.
 - Removing option to only use "GET" requests. All requests are now GET requests. Removed LiveResource.checkHeaders() method.
 - Removed unused LiveResource.sessionCache() method.
 - Broke LiveResource into two objects. We now have LiveResource and LiveCSSResource. 

## [2.0.1](https://github.com/MikeRogers0/LivePage/tree/2.0.1) (2016-05-22)

 - By default, it now ignores CloudFlares email protection URLs, doubleclick adverts and any references to the cache breakers URL attribute.

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
