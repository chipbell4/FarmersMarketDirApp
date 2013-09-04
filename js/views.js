
/*
 * The search-form, allowing for geolocation
 * and zip search
 */
var SearchView = Backbone.View.extend({

	/*
	 * The main container for this view
	 */
	el: '#page',

	/*
	 * Base function to render this view
	 */
	render: function() {
		this.$el.html($('#search-template').html());
	},

	/*
	 * Event handlers for this view. For instance,
	 * 'click #blah' : 'func' means that whenever an
	 * element with id blah is clicked, call func.
	 */
	events: {
		'click #zip-search': 'zip_search',
		'click #geo-search': 'geo_search',
	},

	/*
	 * Event handler for clicking the Geolocation search
	 * button
	 */
	geo_search: function() {

		// Callback for successful location retrieval
		function geoSuccess(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			window.location = '#search/' + lat + ',' + lng;
		}

		// Callback for unsuccessful location retrieval
		function geoFail(error) {
			alert('There was an error getting your location: ' + error.message);
		}

		navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);

	},

	/*
	 * Event handler for click the Zip search button
	 */
	zip_search: function() {
		// TODO: validate and show error view
		var zip = $('#zip-input').val().trim();
		window.location = '#search/' + zip;
	}
});

/*
 * The view for showing a listing of search results
 */
var ListView = Backbone.View.extend({

	// the main container for this view
	el: '#page',

	// the template div for this view
	template: '#search-results-list-template',

	/*
	 * Basic initialization, compiles the Mustache template for
	 * this view
	 */
	initialize: function(options) {
		this.template = Mustache.compile($(this.template).html());
		this.collection = options.collection;
	},

	/*
	 * Renders the templated HTML to the containing element
	 */
	render: function() {
		this.$el.html(this.template({'search_results': this.collection.toJSON(), 'zip':this.collection.zip}));
	},

	/*
	 * Back button event setup
	 */
	events: {
		'click .back': 'back',
	},

	back: function() {
		window.history.back();
	},
});

/*
 * The view for showing details about a market
 */
var DetailsView = Backbone.View.extend({

	// the main container for the page
	el: '#page',

	// the template for the view
	template: '#details-template',

	/*
	 * Basic template initialization, and assigning the model in
	 */
	initialize: function(options) {
		this.template = Mustache.compile($(this.template).html());
		this.model = options.model;
	},

	/*
	 * Standard rendering, using the template and model
	 */
	render: function() {
		/*
		 *{
			'market': {
				'marketname':'Chip',
				'products': [],
				'schedule': 'asdfasdf'
			}
		 }
		 */
		this.$el.html(this.template({'market': this.model.toJSON()}));
	},

	/*
	 * Back button event handling
	 */
	events: {
		'click .back': 'back',
	},

	back: function() {
		window.history.back();
	},
});
