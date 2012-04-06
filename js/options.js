function settings(){
	// Set the default options:
	this.options = {
		monitor_css: true,
		monitor_js: true,
		monitor_html: true,
		hosts_session: false,
		skip_external: false,
		entire_hosts: false,
		refresh_rate: 1000
	};
	
	// Now load the options from the localStorage
	for (var key in this.options){
		this.options[key] = localeStorager.get(key);
	}
	
	this.livePages = localeStorager.get('livePages');
}


function showHosts(){
	if(localStorage["liveSites"] !== 'undefined'){
		var liveSites = JSON.parse(localStorage["liveSites"]);
		var host_list = document.getElementById("host_list");
		var url_count = 0;
		for (var i in liveSites){
			url_count++;
			host_list.innerHTML += '<li><a href="'+i+'">'+i+'</a></li>';
		}
		
		if(url_count === 0){
			host_list.innerHTML = host_list.innerHTML+'<li>No URLs added :/</li>';
		}else {
			document.getElementById("url_count").innerHTML = url_count;
		}
	}
	if(localStorage["LiveActions"] !== 'undefined'){
		var liveAction = new Array();
		liveAction = localStorage["LiveActions"].replace('#','').split(',');
		for(var i in liveAction){
			document.getElementById('liveactions_'+liveAction[i]).checked = true;
		}
	}
}
function updateValues(){
	var liveAction = new Array();
	var liveAction_count = 0;
	var liveAction_value = '';
	
	for(var i in document.options.liveactions){
		if(document.options.liveactions[i].checked === true){
			liveAction[liveAction_count++] = document.options.liveactions[i].value;
		}
	}
	if(liveAction.join(',') != ''){
		liveAction_value = '#'+liveAction.join(',');
	}
	
	localStorage["LiveActions"] = liveAction_value;
	console.log('Updated LiveActions to: '+localStorage["LiveActions"]);
	updateNotice('Updated LiveActions to: '+localStorage["LiveActions"]);
}
showHosts();
document.getElementById("LiveActions").addEventListener('change',updateValues,false);