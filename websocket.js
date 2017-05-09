'use strict';
import action from "./websocket/action"
import ChartTypeDataNotify from "./websocket/ChartTypeDataNotify"
import ChartData from "./websocket/chartData"
import DictDataNotify from "./websocket/dictDataNotify"

var MongoClient = require('mongodb').MongoClient;
var cmdb_url = 'mongodb://localhost/cmdb';

module.exports = function websocket(server) {
	var socketIo = require('socket.io');
	var io = socketIo(server);
  MongoClient.connect(cmdb_url,(err,db)=>{
    var actionModel = new action(io,db)
    var chartTypeDataNotifyModel = new ChartTypeDataNotify(io,db)
    var chartDataModel = new ChartData(io,db);
    var dictDataNotifyModel = new DictDataNotify(io,db);
    io.on('connection', socket=>{ 
      try{
        actionModel.run(socket);
        chartTypeDataNotifyModel .run(socket);
        chartDataModel.run(socket);
        dictDataNotifyModel.run(socket);
      }catch(e){
        console.log(e);
      }
    });
  });	
}
