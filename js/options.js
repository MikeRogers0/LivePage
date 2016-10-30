// Set the global varibles.
var host_list = document.querySelector('#host_list');
var clear_all = document.querySelector('#clear_all');
var settingFields = document.querySelectorAll('#options select, #options input[type="checkbox"], #options input[type="range"], #options input[type="number"]');

// Add the change event, so we can fire changes on load.
var changeEvent = document.createEvent('Event');
changeEvent.initEvent('change', true, false);

// i18n up the page
livepages.i18n.populateElementsCopy();


// Build the listner for when options are updated.
function updateValue(e) {
  var elm = e.srcElement; // the elements which was clicked.

  // If something invalid has been added, clear the value of the element
  if(elm.validity.valid != true) {
    settings.remove(elm.id, elm.checked);
    return;
  }

  if (elm.getAttribute('type') == 'checkbox') {
    settings.set(elm.id, elm.checked);
  } else {
    settings.set(elm.id, elm.value);
  }
}

// build the listner for when all the URL's are cleared.
function clearLivePages() {
  host_list.innerHTML = host_list.innerHTML = '<li>' + livepages.i18n.url_list_empty() + '</li>';
  livepages.removeAll();
}

// Add the list of URLs/Hosts were tracking
host_list.innerHTML = '<li>' + livepages.i18n.url_list_empty() + '</li>';
if (livepages.livePages != undefined) {
  for (var i in livepages.livePages) {
    host_list.innerHTML = '';
    break;
  }
  for (var i in livepages.livePages) {
    host_list.innerHTML += '<li><a href="' + i + '">' + i + '</a></li>';
  }
}


// Add the clear all listner
clear_all.addEventListener('click', clearLivePages, false);

// now update the checkboxes and select field with values from the database.
for (var key = 0; key < settingFields.length; key++) {
  if (settingFields[key].getAttribute('type') == 'checkbox') {
    // If the checkbox value is the same as the one in the database check it
    settingFields[key].checked = false; // uncheck it by default
    if (settingFields[key].getAttribute('value') == '' + settings.get(settingFields[key].id)) {
      settingFields[key].checked = true;
    }
  } else {
    // Otherwise it's a normal input field, so treat it as such.
    settingFields[key].value = '' + settings.get(settingFields[key].id);
  }

  // now add the listner
  settingFields[key].addEventListener('change', updateValue, false);
}
for (var key = 0; key < settingFields.length; key++) {
  settingFields[key].dispatchEvent(changeEvent);
}
