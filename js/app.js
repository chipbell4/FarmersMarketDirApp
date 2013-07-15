var router = null;
$(document).ready(function() {
	router = new FarmersMarketRouter(); 
	Backbone.history.start({pushState:false});
});
