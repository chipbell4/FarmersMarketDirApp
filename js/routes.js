var FarmersMarketRouter = Backbone.Router.extend({
	/*
	 * Here is a list of all the routes for our app:
	 * the pattern is '/url/name/:variable1' : 'functionNameToCall'
	 */
	routes: {
		'': 'index',
		'search/:lat,:lng': 'searchByLatLng',
		'search/:zip': 'searchByZip',
		'details/:market': 'marketDetails',
		'errors/:zip': 'zipError',
	},

	/*
	 * Renders the index route, with all of the search information
	 */
	index: function() {
		var view = new SearchView();
		view.render();
	},

	/*
	 * Callback for a lat/long search
	 */
	searchByLatLng: function(lat, lng) {
		this.collection = new SearchResultsCollection();
		this.collection.setLatLng(lat, lng);

		// specify the callback for when the ajax call completes
		this.listenToOnce(this.collection, 'sync', this.fetchFinish);
		this.collection.fetch();
	},

	/*
	 * Callback for a zip search
	 */
	searchByZip: function(zip) {
		
		var zipCodePattern = /^\d{5}$/;
		if (!zipCodePattern.test(zip)) {
			window.location.hash = 'errors/' + zip;
			return;
		}
		 
		this.collection = new SearchResultsCollection();
		this.collection.setZip(zip);

		// specify the callback for when the ajax call completes
		this.listenToOnce(this.collection, 'sync', this.fetchFinish);

		this.collection.fetch();
	},

	/*
	 * Searches use AJAX, which is asynchronous. This is the callback
	 * for when a search completes. It essentially renders the search results
	 * to the page
	 */
	fetchFinish: function() {
		var view = new ListView({'collection':this.collection});
		view.render();
	},

	/*
	 * Renders the details for a market based on its ID.
	 */
	marketDetails: function(id) {
		this.model = new MarketDetails();
		this.model.set('id', id);

		/*
		 * the detail results for a market does not include the market name,
		 * so we provide that to the details as well, so we can use that when
		 * displaying the market
		 */
		this.model.set('marketname', this.collection.get(id).get('marketname'));

		/* once we've ajax-pulled the details for this market, we display them
		 * by calling our detailsRetrieved callback
		 */
		this.listenToOnce(this.model, 'sync', this.detailsRetrieved);
		this.model.fetch();
	},

	/*
	 * The callback for when details are retrieved for a farmer's market
	 */
	detailsRetrieved: function() {
		var view = new DetailsView({ 'model': this.model});
		view.render();
	},
	
	/*
	 * Sends an error if zip is invalid
	 */
	zipError: function(zip){
		alert('Bad zip code');
	}
});
