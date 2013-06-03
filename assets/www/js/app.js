// fix back button transition from outside apps (like maps)
$(document).bind('mobileinit', function() {
	$.mobile.pushStateEnabled = false;
})
$(document).ready(function() {
	FarmersMarketSearch.Load.init(function() {
		
	});
});