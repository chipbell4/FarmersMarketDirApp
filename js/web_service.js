var FarmersMarketSearch = FarmersMarketSearch || {};

/*
	Web Service calls
*/
FarmersMarketSearch.WebService = (function() {
	var wsUrl = 'http://search.ams.usda.gov/FarmersMarkets/v1/data.svc/';
	function callFMService(serviceMethod, serviceParams, successFn, errorFn) {
		$.ajax({
			'type': 'GET',
			'contentType': 'application/json',
			'crossDomain': true,
			'url': wsUrl + serviceMethod, 
			'data': serviceParams, 
			'success': successFn, 
			'error': errorFn}
		);
	}

	return {
		zipSearch: function(zipCode, success, error) {
			callFMService('zipSearch', {'zip':zipCode}, success, error);
		},
		locSearch: function(lat, lng, success, error) {
			callFMService('locSearch', {'lat':lat, 'lng':lng}, success, error);
		},
		mktDetail: function(id, success, error) {
			callFMService('mktDetail', {'id':id}, success, error);
		},
		init: function() {
			FarmersMarketSearch.Load.finishedLoading('WebService');
		}
	};
})();
