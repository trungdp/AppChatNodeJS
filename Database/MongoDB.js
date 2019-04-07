var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

module.exports = {
    connectDB : function() {
        mongoose.connect(process.env.MONGODB_ADDON_URI, { useNewUrlParser: true });
    }
};
