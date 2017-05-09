'use strict';
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/cmdb';

module.exports = async function(ctx, next){
	var data = { };
  var db = await MongoClient.connect(url);
  var servers = db.collection("servers");
  data = await servers.find().toArray();
	ctx.body = data;
  db.close();
}

