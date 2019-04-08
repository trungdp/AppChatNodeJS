var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var dbName = 'dlchat'
var url = "mongodb://127.0.0.1/"+dbName;

// var schemal = 

module.exports = {
	connect:function () {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			console.log("Connected to " + dbName);
			db.close();
		})
	},

	createTable:function(tableName){
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var table = dbo.collection(tableName);
			if (table === null || table === undefined){
				dbo.createCollection(tableName, function(err, res) {
					if (err) throw err;
					console.log("Created collection" + tableName);
					db.close();
				});
			}
		})
	},

	insert:function(obj,tableName){
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection(tableName);

			if (Array.isArray(obj)) {
				var mappedArray = obj.map(function (item) { return item.el; });
				table.insertMany(obj, function(err, res) {
					if (err) throw err;
					console.log("Inserted " + mappedArray.length + " documents");
					db.close();
				})
			} else {
				table.insertOne(obj, function(err, res) {
					if (err) throw err;
					console.log("Inserted 1 document");
					db.close();
				})
			}
		})
	},

	query:function(query,tableName){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection(tableName);
			table.find(query).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
				db.close();
			});
		});	
	},
	
	isValidateUser:function(query){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("User");
			var isValidateUser = false;
			table.find(query).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
				if (result.length != 0) {isValidateUser = true}
				db.close();
			});
			return isValidateUser;
		});	
	}
};