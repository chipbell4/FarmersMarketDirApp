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
		
	},
	zip_search: function() {
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
		this.$el.html(this.template({'search_results': this.collection.toJSON()}));
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
		this.$el.html(this.template({'market': this.model.toJSON()}));
	}
});
