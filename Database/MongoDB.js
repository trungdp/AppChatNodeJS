var MongoClient = require('mongodb').MongoClient;
const Define = require('../src/define');
var dbName = 'DLChat'
var url = Define.url;


module.exports = {
	connect:function () {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			console.log("Connected to " + dbName);
			db.close();
		});
	},

	useTable:function(tableName){
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
			} else {
				console.log("Use collection " + tableName);
			}
		});
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

	query:function(query,tableName,callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			db.db(dbName).collection(tableName).find(query).toArray(function(err, queryResult) {
				if (err) throw err;
				db.close();
				return callback(queryResult)
			});
		});
	},

	isValidateUser:function(query,callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			db.db(dbName).collection("User").find(query).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				return callback(result[0]) ;
			});
		});	
	},
	updateStatus:function(name,status,callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			db.db(dbName).collection("User").updateOne({name:name}, { $set: { status: status } }, function(err, res) {
				if (err) throw err;
				console.log("update stauts:"+ res.name+": "+res.status);
				db.close();
				return callback(res) ;
			  });
		});	
	},
	getAllOnlineUser:function(callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("User");
			table.find({status:"onl"}).toArray(function(err,res){
				if(err) throw err;
				console.log(res);
				var result = [];
				res.forEach((item)=>{
					result.push({id: item._id, name: item.name});
				})
				return callback(result);
			});
		});	
	},
	hadName:function(name,callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			db.db(dbName).collection("User").find({name:name}).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				return callback(result.length > 0) ;
			});
		});	
	},
	addUser:function(obj,callback){
		return MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("User");
			table.insertOne(obj, function(err, res) {
				if (err) throw err;
				db.close();
				return callback(res.ops[0]);
			})
		});	
	},

	createRoom:function(obj, callback){
		return MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("Conversation");

			table.insertOne(obj, function(err, res) {
				if (err) throw err;
				db.close();
				return callback(res.ops[0]);
			})
		})
	},

	getRoomWithName:function(obj, callback){
		return MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("Conversation");
			table.find().toArray(function(err,res){
				if(err) throw err;
				var result = [];
				for (var i = 0; i < res.length; i++) { 
					if (res[i].usersID.includes(obj)){
						result.push(res[i])
					}				
				}
				return callback(result);
			});
		});
	},

	allRoom:function(callback){
		return MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("Conversation");
			table.find().toArray(function(err,res){
				if(err) throw err;
				return callback(res);
			});
		})
	},

	findRoom:function(obj, callback){
		return MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var table = db.db(dbName).collection("Conversation");
			table.find().toArray(function(err,res){
				if(err) throw err;
				var result = [];
				for (var i = 0; i < res.length; i++) { 
					const ids = res[i].usersID;
					if ((ids.length === obj.length) && ids.sort().every(function(value, index) { 
						return value === obj.sort()[index]
					})) {
						return callback(res[i]);
					}			
				}
				return callback();
			});
		})
	}
};