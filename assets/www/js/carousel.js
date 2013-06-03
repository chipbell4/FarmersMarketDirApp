var Carousel = (function() {
	var $carouselContainer= null;
	var i = 0;
	var marketList = null;
	var marketInfo = {};
	var N = 0;
	function leftButtonClick() {
		i--;
		if(i < 0) {
			i = 0;
		}
		rerenderCarousel();
	}

	function rightButtonClick() {
		i++;
		if( i >= N) {
			i = N - 1;
		}
		rerenderCarousel();
	}

	function mktDetailSuccess(jsonText) {
		var jsonObj = JSON.parse(jsonText);
		var html = FarmersMarketSearch.Templating.buildMarketInfoHTML(i, jsonObj.marketdetails);
		$($('.market-details', $carouselContainer).get(i)).html(html);
		$($('.carousel-item', $carouselContainer).get(i)).show();
		
		// update marketInfo
		marketInfo[i] = jsonObj;
		
		// ui updates
		$carouselContainer.trigger('create');

	}

	function rerenderCarousel() {
		$('.carousel-item', $carouselContainer).hide();
		$($('.carousel-item', $carouselContainer).get(i)).show();
		// check that market data is loaded for that id
		if(!marketInfo.hasOwnProperty(i)) {
			// retrieve
			var id = marketList[i].id;
			FarmersMarketSearch.WebService.mktDetail(id, mktDetailSuccess, $.noop);
		}
	}

	function renderEmptyCarousel() {
		var html = FarmersMarketSearch.Templating.buildEmptyCarouselMessage();
		$('.carousel', $carouselContainer).html(html);
	}
	
	return {
		init: function(json, $container) {
			marketList = json.results;
			marketInfo = {};
			i = 0;
			N = 0;
			$carouselContainer = $container;
			$carouselContainer.trigger('create');
			if(typeof(marketList) !== 'undefined') {
				N = marketList.length;
			}
			if(N > 0) {
				$('.left-button', $carouselContainer).click(leftButtonClick);
				$('.right-button', $carouselContainer).click(rightButtonClick);
				rerenderCarousel();
			}
			else
			{
				renderEmptyCarousel();
			}
		}
	}
})();
