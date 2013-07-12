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
		FarmersMarketSearch.UI.saveState(function() {
			$.mobile.changePage('#search-results');
		});
	}

	function geoFail(error) {
		alert('There was an error getting your location: ' + error.message);
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
		alert('You entered an invalid ZIP code');
		return false;
	}
	else
	{
		FarmersMarketSearch.zip = zip;
		FarmersMarketSearch.lat = null;
		FarmersMarketSearch.lng = null;
		FarmersMarketSearch.heading = null;
		FarmersMarketSearch.UI.saveState(function() {
			$.mobile.changePage('#search-results');
		});
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
	alert('The web service request had an error: ' + error);
}

FarmersMarketSearch.UI.getSearchResults = function() {
	
	function isUndefined(obj) {
		return typeof(obj) === 'undefined' || obj == null || obj == 'null' ;
	}
	
	$('#search-results-container').html('<img class="loading-img" src="css/themes/images/ajax-loader.gif"/>');
	var d = [
		FarmersMarketSearch.zip,
		FarmersMarketSearch.lat,
		FarmersMarketSearch.lng,
		FarmersMarketSearch.heading
	];

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

FarmersMarketSearch.UI.saveState = function(callback) {
	// save app state
	var keys = ['zip', 'lat', 'lng', 'heading'];
	var k = 0;
	var N = keys.length;
	function nextCallback() {
		if(k >= N) {
			callback();
			return;
		}
		var key = keys[k];
		var value = FarmersMarketSearch[key];
		k++;
		FarmersMarketSearch.db.save(key,value,nextCallback);
	}
	nextCallback();
};

FarmersMarketSearch.UI.retrieveState = function(callback) {
	// retrieve app state
	var keys = ['zip', 'lat', 'lng', 'heading'];
	var k = 0;
	var N = keys.length;
	function nextCallback() {
		if(k >= N) {
			callback();
			return;
		}
		var key = keys[k];
		k++;
		FarmersMarketSearch.db.retrieve(key, function(val) {
			FarmersMarketSearch[key] = val;
			nextCallback();
		});
	}

	nextCallback();

};

FarmersMarketSearch.UI.init = (function() {
	$("#zip-search-button").on('click', FarmersMarketSearch.UI.searchByZip);
	$('#geo-search-button').on('click', FarmersMarketSearch.UI.searchByGeo);
	$('#search-results').on('pageshow', function() {
		FarmersMarketSearch.UI.retrieveState(FarmersMarketSearch.UI.getSearchResults);
	});
	
	FarmersMarketSearch.Load.finishedLoading('UI');
});
