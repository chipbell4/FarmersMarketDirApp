var FarmersMarketRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'search/:lat,:lng': 'searchByLatLng',
		'search/:zip': 'searchByZip',
		'details/:market': 'marketDetails',
	},
	
	index: function() {
		var view = new SearchView();
		view.render();
	},
	
	searchByLatLng: function(lat, lng) {
		this.collection = new SearchResultsCollection();
		this.collection.setLatLng(lat, lng);
		this.listenToOnce(this.collection, 'sync', this.fetchFinish);
		this.collection.fetch();
	},

	searchByZip: function(zip) {
		this.collection = new SearchResultsCollection();
		this.collection.setZip(zip);
		this.listenToOnce(this.collection, 'sync', this.fetchFinish);
		this.collection.fetch();
		console.log("FETCHING");
	},
	
	fetchFinish: function() {
		var view = new ListView({'collection':this.collection});
		view.render();
	},
	
	marketDetails: function(id) {
		this.model = new MarketDetails();
		this.model.set('id', id);
		this.listenToOnce(this.model, 'sync', this.detailsRetrieved);
		this.model.fetch();
	},
	
	detailsRetrieved: function() {
		var view = new DetailsView({ 'model': this.model});
		view.render();
	}
});
