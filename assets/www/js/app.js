// fix back button transition from outside apps (like maps)
document.addEventListener('deviceready', function() {
	FarmersMarketSearch.Load.init(function() {
		console.log('App loaded');
		//document.addEventListener('pause', FarmersMarketSearch.UI.pause, false); 
		document.addEventListener('resume', FarmersMarketSearch.UI.retrieveState, false);
	});
}, false);
