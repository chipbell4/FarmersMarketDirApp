var KeyValueDatabase = function() {
	var that = this;
	that.ready = false;	
	that.error = '';
	that.db = window.openDatabase('appstate', '1.0', 'Application State', 2046);

	// callbacks
	function setWorkingState() {
		that.error = 'Working';
	}
	function readyCallback() { 
		that.ready = true; 
		that.error = '';
	}
	function errorCallback(e) { that.error = e; }
	function buildReadyCallback(callback) { return function() { readyCallback(); callback(); }};
	function buildErrorCallback(callback) { return function(e) { errorCallback(e); callback(); } };

	// initialization
	this.initialize = function(callback) {
		function createDb(tx) {
			tx.executeSql('create table if not exists appstate (`key`, `value`)');
		}
		setWorkingState();
		that.db.transaction(createDb, buildErrorCallback(callback), buildReadyCallback(callback));
	}

	// save
	this.save = function(key, value, callback) {
		function saveKeyValue(tx) {
			tx.executeSql("delete from appstate where key='" + key + "'");
			tx.executeSql("insert into appstate values ('" + key + "', '" + value + "')");
		}
		setWorkingState();
		that.db.transaction(saveKeyValue, buildErrorCallback(callback), buildReadyCallback(callback));
	}

	this.retrieve = function(key, callback) {
		var errorCallback = buildErrorCallback(callback);
		function querySuccess(tx, results) {
			if(results.rows.length == 0) {
				callback(null);
				return;
			}
			var row = results.rows.item(0);
			var value = row['value'];
			callback(value);
		}
		function findByKey(tx) {
			var sql = "select * from appstate where key='" + key + "'";
			tx.executeSql(sql, [], querySuccess, errorCallback);
		}
		setWorkingState();

		that.db.transaction(findByKey, errorCallback, function() { });
	}

	this.clear = function(callback) {
		function clearTable(tx) {
			tx.executeSql('delete from appstate where 1=1', [], callback, buildErrorCallback(callback));
		}
		setWorkingState();
		that.db.transaction(clearTable, buildErrorCallback(callback), function(){});
	}
};
