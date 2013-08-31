
/*
 * Setup the application, by creating a router and initializing it.
 * The router will then look at the url and route accordingly (it
 * should go to the index). We also turn on history tracking so our
 * back button works.
 */
var router = null;
$(document).ready(function() {
	router = new FarmersMarketRouter();
	Backbone.history.start({pushState:false});
});
