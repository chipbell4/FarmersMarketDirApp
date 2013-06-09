var FarmersMarketSearch = FarmersMarketSearch || {};

FarmersMarketSearch.Load = new (function() {
	this.loaded = {};
	this.finishedLoading = function(moduleName) {
		this.loaded[moduleName] = true;
		// check and see that everybody is loaded
	};

	this.init = function(callback) {
		var allModules = ['WebService', 'DataCleaning', 'Templating', 'UI'];
		for(var k in allModules) {
			var moduleName = allModules[k];
			this.loaded[ moduleName ] = false;
			FarmersMarketSearch[ moduleName ].init();
		}
		
		// initialize state database
		FarmersMarketSearch.db = new KeyValueDatabase();
		FarmersMarketSearch.db.initialize(function() {
			FarmersMarketSearch.UI.retrieveState(function(){});
			callback();
		});
	}
});
