var FarmersMarketSearch = FarmersMarketSearch || {};
FarmersMarketSearch.UI = {};

/*
	Geolocation
	
	app/res/xml/config.xml
	<plugin name="Geolocation" value="org.apache.cordova.GeoBroker" />

	app/AndroidManifest.xml
	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
*/
FarmersMarketSearch.UI.searchByGeo = function() {
	function geoSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var heading = position.coords.heading;
		FarmersMarketSearch.zip = null;
		FarmersMarketSearch.lat = lat;
		FarmersMarketSearch.lng = lng;
		FarmersMarketSearch.heading = heading;
		$.mobile.changePage('#search-results');
		FarmersMarketSearch.UI.getSearchResults();
	}

	function geoFail(error) {
		FarmersMarketSearch.UI.displayError(error);
	}
	navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);
}

/*
	Zip Search
*/
FarmersMarketSearch.UI.searchByZip = function() {
	// validate
	var zipRegex = /\d{5}/;
	var zip = $('#zip').val().trim();
	if(!zipRegex.test(zip)) {
		$.mobile.changePage('#invalid-zip-dialog');
		return false;
	}
	else
	{
		FarmersMarketSearch.zip = zip;
		FarmersMarketSearch.lat = null;
		FarmersMarketSearch.lng = null;
		FarmersMarketSearch.heading = null;
		$.mobile.changePage('#search-results');
		FarmersMarketSearch.UI.getSearchResults();
	}
}

/*
	UI and navigation
*/
FarmersMarketSearch.UI.populateSearchResults = function(results) {
	var json = JSON.parse(results);
	for(var k in json.results) {
		json.results[k] = FarmersMarketSearch.DataCleaning.cleanMarketSearchData(json.results[k]);
	}
	var html = FarmersMarketSearch.Templating.buildMarketListHTML(json);
	$('#search-results-container').html(html);

	//reset search state
	FarmersMarketSearch.zip = FarmersMarketSearch.lat = FarmersMarketSearch.lng = null;
	
	Carousel.init(json, $('#search-results-container'));
}

FarmersMarketSearch.UI.displayError = function(jqXHR, state, error) {
	alert(error);
}

FarmersMarketSearch.UI.getSearchResults = function() {
	// save state
	FarmersMarketSearch.UI.saveState();
	
	function isUndefined(obj) {
		return typeof(obj) === 'undefined' || obj == null;
	}
	
	$('#search-results-container').html('<img class="loading-img" src="css/themes/images/ajax-loader.gif"/>');
	var d = [
		FarmersMarketSearch.zip,
		FarmersMarketSearch.lat,
		FarmersMarketSearch.lng,
		FarmersMarketSearch.heading
	];

	alert(JSON.stringify(d));

	if(!isUndefined(FarmersMarketSearch.zip)) {
		FarmersMarketSearch.WebService.zipSearch(FarmersMarketSearch.zip,
				FarmersMarketSearch.UI.populateSearchResults,
				FarmersMarketSearch.UI.displayError);
	}
	else if(!isUndefined(FarmersMarketSearch.lat) && !isUndefined(FarmersMarketSearch.lng)) {
		FarmersMarketSearch.WebService.locSearch(FarmersMarketSearch.lat, FarmersMarketSearch.lng, 
				FarmersMarketSearch.UI.populateSearchResults, 
				FarmersMarketSearch.UI.displayError);
	}
}

FarmersMarketSearch.UI.saveState = (function() {
	// save app state
	var keys = ['zip', 'lat', 'lng', 'heading'];
	var D = {};
	for(var k in keys) {
		D[ keys[k] ] = FarmersMarketSearch[ keys[k] ] || null;
	}
	$('#app-state').val( JSON.stringify(D) );
});

FarmersMarketSearch.UI.retrieveState = (function() {
	// retrieve app state
	var keys = ['zip', 'lat', 'lng', 'heading'];
	console.log($('#app-state').val());
	var D = JSON.parse($('#app-state').val());
	for(var k in keys) {
		FarmersMarketSearch[ keys[k] ] = D[ keys[k] ]|| null;
	}

	FarmersMarketSearch.UI.getSearchResults();
});

FarmersMarketSearch.UI.init = (function() {
	FarmersMarketSearch.UI.saveState();
	
	$("#zip-search-button").on('click', FarmersMarketSearch.UI.searchByZip);
	$('#geo-search-button').on('click', FarmersMarketSearch.UI.searchByGeo);
	$('#search-results').on('pageshow', FarmersMarketSearch.UI.retrieveState);
	
	FarmersMarketSearch.Load.finishedLoading('UI');
});
