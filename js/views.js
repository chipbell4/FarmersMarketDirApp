var SearchView = Backbone.View.extend({
	el: '#page',
	render: function() {
		this.$el.html($('#search-template').html());
		console.log("Rendering");
	},
	events: {
		'click #zip-search': 'zip_search',
		'click #geo-search': 'geo_search',
	},
	geo_search: function() {
	// retrieve geolocation
	function geoSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		window.location = '#search/' + lat + ',' + lng;
	}

	// TODO: Show error view
	function geoFail(error) {
		alert('There was an error getting your location: ' + error.message);
	}
	navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);

	},

	zip_search: function() {
		// TODO: validate and show error view
		var zip = $('#zip-input').val().trim();
		window.location = '#search/' + zip;
	}
});

var ListView = Backbone.View.extend({
	el: '#page',
	template: '#search-results-list-template',
	initialize: function(options) {
		this.template = Mustache.compile($(this.template).html());
		this.collection = options.collection;
	},

	render: function() {
		this.$el.html(this.template({'search_results': this.collection.toJSON(), 'zip':this.collection.zip}));
	},

	events: {
		'click .back': 'back',
	},

	back: function() {
		window.history.back();
	},
});

var DetailsView = Backbone.View.extend({
	el: '#page',
	template: '#details-template',
	initialize: function(options) {
		this.template = Mustache.compile($(this.template).html());
		this.model = options.model;
	},

	render: function() {

		console.log(this.model.toJSON());

		this.$el.html(this.template({'market': this.model.toJSON()}));
	},

	events: {
		'click .back': 'back',
	},

	back: function() {
		window.history.back();
	},
});
