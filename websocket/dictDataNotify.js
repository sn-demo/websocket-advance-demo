'use strict';
var ObjectID = require('mongodb').ObjectID;

class DictDataNotify {
  constructor(io,db){
    this.io = io;
    this.db = db;
  }

  run(socket){
    var data = [
      {
        name: "idc",
        title: "测试",
        type: "initial",
        datas: [
          {
            key: "value1",
            value: "列表1",
          },
          {
            key: "value2",
            value: "列表2",
          },
          {
            key: "value3",
            value: "列表3",
          },
          {
            key: "value4",
            value: "列表4",
          },
        ]
      },
      {
        name: "idc2",
        title: "测试2",
        type: "initial",
        datas: [
          {
            key: "value5",
            value: "列表5",
          },
          {
            key: "value6",
            value: "列表6",
          },
          {
            key: "value7",
            value: "列表7",
          },
          {
            key: "value8",
            value: "列表8",
          },
        ]
      }
    ]
    this.initData(data,socket);
  }

  //初始数据
  initData(data,socket){
    socket.emit("DictNotify",data);
  }
}

module.exports = DictDataNotify;


