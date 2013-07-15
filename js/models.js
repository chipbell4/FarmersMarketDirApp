var SERVICE_URL = 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/';

var MarketDetails = Backbone.Model.extend({
	baseUrl: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=',
	initialize: function(options) {
		this.listenTo(this, 'change:id', this.rebuildUrl);
	},
	rebuildUrl: function() {
		this.url = this.baseUrl + this.get('id');
	},
	
	parse: function(response, xhr) {
		var d = {};
		d.address = response.marketdetails.Address;
		d.google_link = response.marketdetails.GoogleLink;
		// TODO: split this into an array (by semi-colon)
		d.products = response.marketdetails.Products;
		// TODO: attempt to parse this into meaningful data
		d.schedule = response.marketdetails.Schedule;
		
		return d;
	}
});

var SearchResult = Backbone.Model.extend({
	// unpack the distance from the search listing
	parse: function(response, xhr) {
		var d = {};
		d.id = response.id;
		var split = response.marketname.split(' ');
		d.distance = split[0];
		d.marketname = split.splice(1).join(' ');
		return d;
	},
});

var SearchResultsCollection = Backbone.Collection.extend({
	baseUrl: 'http://search.ams.usda.gov/FarmersMarkets/v1/data.svc',
	model: SearchResult,
	
	// search parameters
	setZip: function(zip) {
		this.zip = zip;
		this.lat = null;
		this.lng = null;
		this.url = this.baseUrl + '/zipSearch?zip='+this.zip;
	},
	
	setLatLng: function(lat, lng) {
		this.zip = null;
		this.lat = lat;
		this.lng = lng;
		this.url = this.baseUrl + '/locSearch?lat=' + this.lat + '&lng=' + this.lng;
	},
	
	// the service nests everything into a 'results' hash, so we'll pull it out from there
	parse: function(response, xhr) {
		return response.results;
	},
});

marketDetails = new MarketDetails();
marketDetails.set('id', "1006996");