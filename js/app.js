// fix back button transition from outside apps (like maps)
document.addEventListener('deviceready', function() {
	FarmersMarketSearch.Load.init(function() {
		//document.addEventListener('pause', FarmersMarketSearch.UI.saveState, false); 
		//document.addEventListener('resume', FarmersMarketSearch.UI.retrieveState, false);
	});
}, false);
