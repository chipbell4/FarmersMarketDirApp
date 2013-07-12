var FarmersMarketSearch = FarmersMarketSearch || {};

/*
	Code building
*/
FarmersMarketSearch.Templating = (function() {
	var templateData = '';
	return {
		buildMarketListHTML: function(json) {
			var listMarkup = $('.templates #market-list-template').html();
			return Mustache.render(listMarkup, json);
		},
		buildMarketInfoHTML: function(id, json) {
			var infoMarkup = $('.templates #market-info-template').html();
			return Mustache.render(infoMarkup, json);
		},
		buildEmptyCarouselMessage: function() {
			var emptyMessageMarkup = $('.templates #no-results-template').html();
			return Mustache.render(emptyMessageMarkup);
		},
		init: function() {
			FarmersMarketSearch.Load.finishedLoading('Templating');
		}
	}
})();
