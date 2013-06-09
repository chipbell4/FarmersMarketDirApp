var KeyValueDatabase = function(size) {
	var dbName = 'appstate';
	var dbNameLong = 'Application State';
	var dbKeyColumnName = 'application_key';
	var dbValColumnName = 'application_val';

	if(typeof(size) === 'undefined') {
		size = 2056;
	}
	var that = this;
	that.ready = false;	
	that.error = '';
	that.db = window.openDatabase(dbName, '1.0', dbNameLong, size);

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
			var sql = 'create table if not exists ';
			sql += dbName + ' ';
			sql += '(' + dbKeyColumnName + ',';
			sql += dbValColumnName + ')';
			tx.executeSql(sql);
			console.log("Finished create database in db.js");
		}
		setWorkingState();
		that.db.transaction(createDb, buildErrorCallback(callback), buildReadyCallback(callback));
	}

	// save
	this.save = function(key, value, callback) {
		function saveKeyValue(tx) {
			var sql = 'delete from ' + dbName + ' where ' + dbKeyColumnName + '=?';
			tx.executeSql(sql, [key]);
			var sql = 'insert into ' + dbName + ' values (?,?)';
			tx.executeSql(sql, [key,value]);
		}
		setWorkingState();
		that.db.transaction(saveKeyValue, buildErrorCallback(callback), buildReadyCallback(callback));
	}

	this.retrieve = function(key, callback) {
		var errorCallback = buildErrorCallback(callback);
		function querySuccess(tx, results) {
			that.error = '';
			if(results.rows.length == 0) {
				callback(null);
				return;
			}
			var row = results.rows.item(0);
			var value = row[ dbValColumnName ];
			callback(value);
		}
		function findByKey(tx) {
			var sql = 'select * from ' + dbName + ' where ' + dbKeyColumnName + '=?';
			tx.executeSql(sql, [key], querySuccess, errorCallback);
		}
		setWorkingState();
		that.db.transaction(findByKey, errorCallback, function() { });
	}

	this.clear = function(callback) {
		function clearTable(tx) {
			tx.executeSql('delete from ' + dbName + ' where 1=1', [], callback, buildErrorCallback(callback));
		}
		setWorkingState();
		that.db.transaction(clearTable, buildErrorCallback(callback), function(){});
	}
};
