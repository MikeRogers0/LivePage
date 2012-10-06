# LivePage

## Overview

LivePage is a developer tool which reloads website resources (such as CSS, LESS, HTML and JavaScript) as they change on the server, so you are always looking at the most up-to-date version of a web page. It can make developing websites a lot faster, by helping productivity.

Key features in version 1.3 are:
	* LESS support
	* Entire domains can be made live
	* file:// protocol is now supported

It's recommended you use this extension in a development environment (Such as XAMPP).

## Changelog

All future milestones will be listed on https://github.com/MikeRogers0/LivePage/issues

### 1.4.0.0
 * Fixed bug where localhost URLs can be problematic.
 * Improved fault tollerence when polling URLs
 * Added "the file your working on get polled more often" feature.  

### 1.3.1.2
 * Fixed bug where sometimes html changes were not detected.
 * Moved queue push higher up the script, so it should run faster.

### 1.3.1.1

* Added option to ignore anchors in URLs. Thanks gsurrel for noticing.
* Small improvement upon I18n & L10n. 
* AJAX requests now not async, this makes the backend code a little tidier.


### 1.3.1.0

* Added a test to check for if the "Allow access to file URLs" had been checked. 

### 1.3.0.0

* Adding in Less, enite domain and file:// protocol support.


## Footnotes

Contribute on GitHub: https://github.com/MikeRogers0/LivePage
Find it in the Chrome Web Store: https://chrome.google.com/webstore/detail/pilnojpmdoofaelbinaeodfpjheijkbh/

Extension by: Mike Rogers (@MikeRogers0)
Original LiveJS: @mrtnkl / http://livejs.com/
Icon By: Everaldo Coelho http://www.iconfinder.com/icondetails/17829/128/global_internet_network_planet_seo_web_icon