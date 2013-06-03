function test(name, fn) {
	var innerHTML = name;
	var testState = 'pass';
	try {
		var result = fn();
		if(result !== '') {
			console.log(result);
			throw new Error(result);
		}
	}
	catch(err) {
		innerHTML = name + ': ' + err;
		testState = 'fail';
	}
	document.getElementById('test-container').innerHTML +=
		'<div class=\'test ' + testState + '\'>' + innerHTML  + '</div>';
	return;
}

function checkExpected(expected, actual) {
	if(expected === actual) {
		return '';
	}
	return 'Expected ' + expected + ', got ' + actual;
}

function runTests() {
	test('Clean Single Market Data', function() {
		var badSchedule = "April - November Thursday 3:00 PM to 7:00 PMDecember Thursday 3:00 PM to 6:00 PM";

		var marketData = {
			'Schedule': badSchedule
		};

		var goodSchedule = "April - November Thursday 3:00 PM to 7:00 PM December Thursday 3:00 PM to 6:00 PM";

		var cleanedSchedule = FarmersMarketSearch.DataCleaning.cleanSingleMarketData(marketData).Schedule;
		if(cleanedSchedule !== goodSchedule) {
			return 'Got ' + cleanedSchedule + ' instead of ' + goodSchedule;
		}
		return '';
	});
}
