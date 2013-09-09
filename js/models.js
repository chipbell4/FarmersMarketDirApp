/*
 * The details for a market
 */
var MarketDetails = Backbone.Model.extend({
	// the base url for the market details webservice
	baseUrl: 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=',

	/*
	 * Anytime that the id changes on the model, we need to rebuild the url
	 * at which we pull the model
	 */
	initialize: function(options) {
		this.listenTo(this, 'change:id', this.rebuildUrl);
	},

	/*
	 * Rebuilds the url to pull this model from the webservice
	 */
	rebuildUrl: function() {
		this.url = this.baseUrl + this.get('id');
	},

	/*
	 * Override of the Backbone.Model method parse. The purpose of this
	 * function is to retrieve relevant data from the raw JSON object returned
	 * by the webservice. In this case, we essentially assign the values over, but
	 * we're also splitting the product information by ';' so that we get a list
	 * rather than an ugly string.
	 */
	parse: function(response, xhr) {
		var d = {};
		d.address = response.marketdetails.Address;
		d.google_link = response.marketdetails.GoogleLink;

		// map product to an object, so we can parse it with mustache
		d.products = response.marketdetails.Products.split('; ').map(function(product){
			return {'product': product};
		});
		
		// clean up empty products
		if (d.products.length == 1 && d.products[0].product == '') {
		    d.products = [ ];
		}

		// TODO: attempt to parse this into meaningful data
		console.log("[" + response.marketdetails.Schedule + "]");
		d.schedule = response.marketdetails.Schedule.trim();

		return d;
	}
});

/*
 * A single search result
 */
var SearchResult = Backbone.Model.extend({
	/*
	 * The way we extract data in this case is assign the id, but we
	 * also extract out distance data. Market names, for some reason
	 * come in this format: 42.5 A market name
	 * So, we pull off the first token, which is the distance, and assign
	 * that to a distance variable. The rest we join back together and
	 * save as the market name
	 */
	parse: function(response, xhr) {
		var d = {};
		d.id = response.id;
		var split = response.marketname.split(' ');
		d.distance = split[0];
		d.marketname = split.splice(1).join(' ');
		return d;
	},
});

/*
 * A Collection of search results
 */
var SearchResultsCollection = Backbone.Collection.extend({

	// the base url for searching for a market
	baseUrl: 'http://search.ams.usda.gov/FarmersMarkets/v1/data.svc',

	// the model that this collection holds
	model: SearchResult,

	/*
	 * Method for setting the zip. When we set the zip, we need to null out latitude
	 * and longitude. Also, we need to rebuild the url to search by zip, instead of
	 * longitude
	 */
	setZip: function(zip) {
		this.zip = zip;
		this.lat = null;
		this.lng = null;
		this.url = this.baseUrl + '/zipSearch?zip='+this.zip;
	},

	/*
	 * Method for setting the longitude and latitude. When these get set, we need to null
	 * out zip, and set the url to search by lat/long instead of zip.
	 */
	setLatLng: function(lat, lng) {
		this.zip = null;
		this.lat = lat;
		this.lng = lng;
		this.url = this.baseUrl + '/locSearch?lat=' + this.lat + '&lng=' + this.lng;
	},

	/*
	 * Custom function for parsing results pulled back in AJAX call. The service nests
	 * all results inside of a 'results' key, so we essentially pull out the value of
	 * this entry
	 */
	parse: function(response, xhr) {
		return response.results;
	},
});