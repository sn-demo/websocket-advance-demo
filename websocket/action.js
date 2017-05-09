'use strict';
var ObjectID = require('mongodb').ObjectID;

var presetCollectionName = "presets";

class Action {
  constructor(io,db){
    this.io = io;
    this.db = db;
  }

  run(socket){
    try{
      //if(!this.memoryData){
        var memoryData = this.initMemoryData();
        this.memoryData = memoryData; 
      //}
      this.memoryData.then(data=>{
        var adapterdata = {};
        try{
          for(var k in data){
            var adapterData = this.initTableAdapter(k,data[k]);
            this.initData(adapterData,socket);
          }
        }catch(e){
          console.log(e);
        }
      }).then(()=>{
        this.io.emit("DataSendOver","send data over");
      })
      this.action(socket);
    }catch(e){
      console.log(e)
    }
  }
  //初始化数据适配（发送给前端的数据适配）
  initTableAdapter(collection,data){
    var obj = {};
    obj.collection = collection; 
    obj.datas = [];
    data.forEach(v=>{
      obj.datas.push({
        type: "initial",
        value: v,
      })
    })
    return obj;
  }

  //获取初始化数据
  async initMemoryData(){
    var cmdb_data = {};
    //collection_metas（cmdb配置表说明）
    var collection_metas = this.db.collection("collection_metas");
    cmdb_data.collection_metas = await collection_metas.find().toArray();
    try{
      for(var i=0;i<cmdb_data.collection_metas.length;i++){
        var collection_name = cmdb_data.collection_metas[i].collection;
        var collection_obj = this.db.collection(collection_name);
        cmdb_data[collection_name] = await collection_obj.find().toArray();
      }
      cmdb_data[presetCollectionName] = await this.db.collection(presetCollectionName).find().toArray();
    }catch(e){
      console.log(e);
    }
    return cmdb_data;
  }
  //初始数据
  initData(data,socket){
//console.log(data)
    data.firstTime = true;
    socket.emit("DataNotify",data);
  }

  //通知所有浏览器更新数据
  noticeAllClientToUpdateData(data){
    this.io.emit("DataNotify",data);
  }

  action(socket){
    var result = { };
    socket.on("action",(data,callback)=>{
      switch(data.actionName){
        case "NewTable":
          this.createCollection(data.args,callback);
        break;
        case "UpdateData":
          this.updateData(data.args,callback);
        break;
        case "InsertData":
          this.insertData(data.args,callback);
        break;
        case "DeleteData":
          this.deleteData(data.args,callback);
        break;
        case "DeleteTable":
          this.deleteTable(data.args,callback);
        break;
        case "AddPreset":
          this.addPreset(data.args,callback);
        break;
        case "UpdatePreset":
          this.updatePreset(data.args,callback);
        break;
        case "DeletePreset":
          this.deletePreset(data.args,callback);
        break;
        case "GetUserHistory":
          this.getUserHistory(data.args,callback);
        break;
        case "GetUserList":
          this.getUserList(data.args,callback);
        break;
        case "UpdatePassword":
          this.updatePassword(data.args,callback);
        break;
        case "NewUser":
          this.createUser(data.args,callback);
        break;
        case "DeleteUser":
          this.deleteUser(data.args,callback);
        break;
        case "BanUser":
          this.banUser(data.args,callback);
        break;
        case "UpdateUserInfo":
          this.updateUserInfo(data.args,callback);
        break;
        case "Logout":
          result = {
            code: 200,
            message: "注销成功！",
          }
          //result = {
            //code: 401,
            //message: "登录超时，请重新登录！",
          //}
          callback(result);
        break;
      }
    });
  }

  updateUserInfo(data,callback){
    var result = {
      code: 200,
      message: "操作成功！",
    }
    callback(result);
  }


  banUser(data,callback){
    var result = {
      code: 200,
      message: "操作成功！",
    }
    callback(result);
  }

  deleteUser(data,callback){
    var result = {
      code: 200,
      message: "操作成功！",
    }
    callback(result);
  }


  createUser(data,callback){
    var result = {
      code: 200,
      message: "新增成功！",
    }
    callback(result);
  }

  updatePassword(data,callback){
    var result = {
      code: 200,
      message: "修改成功！",
    }
    callback(result);
  }

  deleteOneModel(data,callback,collectionName){
    var collection = this.db.collection(collectionName || data.collection);
    var _id = data.filter.id;
    if(data.filter){
      data.filter._id = new ObjectID(data.filter._id);
    }
    collection.deleteOne(data.filter,async (err,r)=>{
      //console.log(r.ops,r.Collection);
      var result = { };
      if(!err){
        result = {
          code: 200,
          message: "删除成功！",
        };
        //通知更新
        var notice_data = {
          collection: collectionName || data.collection,
          datas: [
            {
              type: "remove",
              _id: _id,
            }
          ],
        }
        this.noticeAllClientToUpdateData(notice_data);
      }else {
        result = {
          result: false,
          message: "删除失败！",
        }
      }
      callback(result);
    });
  }

  updateOneModel(data,callback,collectionName){
    var collection = this.db.collection(collectionName || data.collection);
    data.update._id = new ObjectID(data.update._id);
    if(data.filter){
      data.filter._id = new ObjectID(data.filter._id);
    }
    //console.log(data)
    collection.updateOne(data.filter,data.update,async (err,r)=>{
    //console.log(r)
      var result = {};
      if(!err){
        result = {
          code: 200,
          message: "操作成功！",
        }
        if(collectionName){
          result.collection = collectionName;
        }
        callback(result);
        //通知更新
        var notice_data = {
          collection: collectionName || data.collection,
          datas: [
            {
              type: "update",
              value: data.update, 
            }
          ],
        }
        this.noticeAllClientToUpdateData(notice_data);
      }else {
        result = {
          result: false,
          message: "操作失败，请重新尝试！",
        }
        callback(result);
      }
    });
  }

  insertOneModel(data,callback,collectionName){
    var collection = this.db.collection(collectionName || data.collection);
    collection.insertOne(data.value || data,async (err,r)=>{
      //console.log(r.ops,r.Collection);
      var result = { };
      if(!err){
        var obj = {
          _id: r.ops[0]._id
        }
        if(collectionName){
          obj.collection = collectionName;
        }
        result = {
          code: 200,
          message: "新增成功！",
          datas: [obj]
        };
        //通知更新
        var notice_data = {
          collection: collectionName || data.collection,
          datas: [
            {
              type: "add",
              value: r.ops[0], 
            }
          ],
        }
        this.noticeAllClientToUpdateData(notice_data);
      }else {
        result = {
          result: false,
          message: "新增失败！",
        }
      }
      callback(result);
    });
  }

  getUserHistory(data,callback){
    var result = {
      code: 200,
      message: "",
      datas: [{
        total: 42,
        current: 1,
        entries: [
          {
            time: 1490062982,
            ip: "192.169.222.111",
            addr: "中国-广东-深圳",
          },
          {
            time: 1490062982,
            ip: "192.169.222.111",
            addr: "中国-广东-深圳",
          },
          {
            time: 1490062982,
            ip: "192.169.222.111",
            addr: "中国-广东-深圳",
          },
          {
            time: 1490062982,
            ip: "192.169.222.111",
            addr: "中国-广东-深圳",
          },
          {
            time: 1490062982,
            ip: "192.169.222.111",
            addr: "中国-广东-深圳",
          },
        ]
      }]
    }
    callback(result);
  }
  getUserList(data,callback){
    var result = {
      code: 200,
      message: "",
      datas: [
        {
          total: 42,
          current: 2,
          role_2: 2,
          role_3: 2,
          ban: 2,
          entries: [
            {
              userId: "xianshannan",
              role: 3, 
              password: "dsdfsd", 
              time: 1490256221, 
              ip: "192.168.7.88", 
              addr: "广东-深圳", 
              status: 0,
            },
            {
              userId: "xianshannan",
              role: 3, 
              password: "dsdfsd", 
              time: 1490256221, 
              ip: "192.168.7.88", 
              addr: "广东-深圳", 
              status: 1,
            }
          ] 
        }
      ]
    }
    callback(result);
  }

  deletePreset(data,callback){
    this.deleteOneModel(data,callback,presetCollectionName)
  }

  updatePreset(data,callback){
    this.updateOneModel(data,callback,presetCollectionName);
  }
  addPreset(data,callback){
    this.insertOneModel(data,callback,presetCollectionName);
  }

  deleteData(data,callback){
    this.deleteOneModel(data,callback)
  }

  insertData(data,callback){
    this.insertOneModel(data,callback);
  }

  updateData(data,callback){
    this.updateOneModel(data,callback);
  }

  createCollection(data,callback){
    var collection_metas = this.db.collection("collection_metas");
    collection_metas.insertOne({
      collection: data.collection,
      title: data.title,
      info: data.info,
    },async (err,r)=>{
      var result = {};
      if(!err){
        result = {
          code: 200,
          message: "新增成功！",
          datas: [
            {
              _id: r.ops[0]._id,
            }
          ], 
        }
        //通知更新
        var notice_data = {
          collection: "collection_metas",
          datas: [
            {
              type: "add",
              value: r.ops[0], 
            }
          ],
        }
        this.noticeAllClientToUpdateData(notice_data);
      }else {
        result = {
          result: false,
          message: "新增失败，请重新尝试！",
        }
      }
      callback(result);
    })
  }
  //删除集合
  deleteTable(data,callback){
    var t_data = {
      collection: "collection_metas",
      filter: {
        _id: data._id,
      }
    }
    this.deleteData(t_data,callback);
  }
}

module.exports = Action;

