'use strict';
var ObjectID = require('mongodb').ObjectID;

class ChartTypeDataNotify {
  constructor(io,db){
    this.io = io;
    this.db = db;
  }

  run(socket){
    var data = [
      {
        typeTitle: "类型一",
        typeValue: "one",
        details: [
          {
            actionName: "traffic",
            actionTitle: "上/下行流量",
          },
          {
            actionName: "operator",
            actionTitle: "运营商",
          },
          {
            actionName: "table",
            actionTitle: "表格",
          },
          {
            actionName: "customized_pie",
            actionTitle: "定制化圆饼图",
          },
          {
            actionName: "sankey",
            actionTitle: "桑基图",
          },
          {
            actionName: "map",
            actionTitle: "中国地图",
          },
        ]
      },
      {
        typeTitle: "类型二",
        typeValue: "two",
        details: [
          {
            actionName: "uptraffic1-1",
            actionTitle: "上行流量1-1",
          },
          {
            actionName: "uptraffic2-1",
            actionTitle: "上行流量2-1",
          },
          {
            actionName: "uptraffic3-1",
            actionTitle: "上行流量3-1",
          },


        ]
      },
      {
        typeTitle: "类型三",
        typeValue: "three",
        details: [
          
          {
            actionName: "uptraffic1-2",
            actionTitle: "上行流量1-2",
          },
          {
            actionName: "uptraffic2-2",
            actionTitle: "上行流量2-2",
          },
          {
            actionName: "uptraffic3-2",
            actionTitle: "上行流量3-2",
          },


        ]
      }
    ]
    this.initData(data,socket);
  }

  //初始数据
  initData(data,socket){
    socket.emit("ChartTypeDataNotify",data);
  }
}

module.exports = ChartTypeDataNotify;


