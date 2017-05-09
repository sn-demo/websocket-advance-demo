'use strict';
var fs = require('fs-extra');
var ObjectID = require('mongodb').ObjectID;
var sankeyData = fs.readJsonSync("websocket/sankeyData.json");
var mapData = fs.readJsonSync("websocket/map.json");
var traffic_data = {
  data: [
    {
      field: "上传流量",
      type: "traffic",
      value: [
        [1488769081, 123123],
        [1488769082, 123123],
        [1488769083, 123123],
        [1488769084, 123123],
        [1488769085, 123123],
        [1488769086, 123123],
        [1488769087, 123123],
        [1488769088, 123123],
        [1488769089, 123123],
        [1488769090, 123123],
      ]
    },
    {
      field: "下载流量",
      type: "traffic",
      value: [
        [1488769081, 1231],
        [1488769082, 1231],
        [1488769083, 12312],
        [1488769084, 1231],
        [1488769085, 12312],
        [1488769086, 123123],
        [1488769087, 1231],
        [1488769088, 123123],
        [1488769089, 1231],
        [1488769090, 1123],
      ]
    }
  ]
};
var operator_data = {
  data: [
    {
      type: "bandwidth",
      value: [
        ["电信", 1231],
        ["联通", 1231],
        ["移动", 1231],
        ["未知", 1231],
      ]
    }, 
    {
      type: "bandwidth",
      value: [
        ["电信", 5],
        ["联通", 2],
        ["移动", 8],
        ["未知", 10],
      ]
    }, 
    {
      type: "bandwidth",
      value: [
        ["电信", 5],
        ["联通", 9],
        ["移动", 3],
        ["未知", 10],
      ]
    }, 
    {
      type: "bandwidth",
      value: [
        ["电信", 3],
        ["联通", 7],
        ["移动", 3],
        ["未知", 10],
      ]
    },
  ],
};

var table_data = {
  data: [
    {
      fields: ["上传流量","下载流量","上传带宽","下载带宽"],
      total: 23,
      current: 1,
      size: 10,
      value: [
        [33333993, 1231,3333,3333],
        [33333993, 1231,3333,3333],
        [33333993, 1231,3333,3333],
        [33333993, 1231,3333,3333],
        [33333993, 1231,3333,3333],
        [33333993, 1231,3333,3333],
      ]
    }
  ],
};
var customized_pie = {
  "data": [
    {
      "field": "佛山",
      "type": "num",
      "value": 1231,
      "next": [
        {
          "field": "健康",
          "type": "num",
          state: 1,
          "value": 1000
        },
        {
          "field": "亚健康",
          "type": "num",
          state: 2,
          "value": 200
        },
        {
          "field": "不健康",
          "type": "num",
          state: 3,
          "value": 30
        },
        {
          "field": "未知",
          "type": "num",
          state: 0,
          "value": 1
        }
      ]
    },
    {
      "field": "台州",
      "type": "num",
      "value": 1000,
      "next": [
        {
          "field": "健康",
          "type": "num",
          state: 1,
          "value": 500
        },
        {
          "field": "亚健康",
          "type": "num",
          state: 2,
          "value": 250
        },
        {
          "field": "不健康",
          "type": "num",
          state: 3,
          "value": 150
        },
        {
          "field": "未知",
          state: 0,
          "type": "num",
          "value": 100
        }
      ]
    }
  ],
  "data_type": "tree"
};

class ChartData {
  constructor(io,db){
    this.io = io;
    this.db = db;
  }

  run(socket){
    this.action(socket);
  }

  action(socket){
    sankeyData.data_type = "sankey";
    mapData.data_type = "map";
    socket.on("action",(data,callback)=>{
      switch(data.actionName){
        case "traffic":
          callback({
            code: 200,
            datas: [traffic_data],  
          });
        break;
        case "operator":
          callback({
            code: 200,
            datas: [operator_data],  
          });
        break;
        case "table":
          callback({
            code: 200,
            datas: [table_data],  
          });
        break;
        case "customized_pie":
          callback({
            code: 200,
            datas: [customized_pie],  
          });
        break;
        case "sankey":
          callback({
            code: 200,
            datas: [sankeyData],  
          });
        break;
        case "map":
          callback({
            code: 200,
            datas: [mapData],  
          });
        break;
      }
    });
  }

}

module.exports = ChartData;


