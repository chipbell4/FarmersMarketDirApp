var FarmersMarketSearch = FarmersMarketSearch || {}

FarmersMarketSearch.DataCleaning = (function() {
	function fixAMPMMonthSpace(text) {
		var amPm = ['AM', 'PM'];
		var months = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'];
		for(var i in amPm) {
			for(var j in months) {
				var t = amPm[i];
				var m = months[j]
				text = text.replace(t + m, t + ' ' + m);
			}
		}
		return text;
	}
	return {
		cleanSingleMarketData: function(marketData) {
			marketData.Schedule = fixAMPMMonthSpace(marketData.Schedule);

			return marketData;
		},
		cleanMarketSearchData: function(marketData) {
			var marketList = marketData.marketname.split(' ');
			marketData.distanceTo = marketList[0].trim();
			marketData.marketname = marketList.slice(1).join(' ');
			return marketData;
		},
		init: function() {
			FarmersMarketSearch.Load.finishedLoading('DataCleaning');
		},
	}
})();
