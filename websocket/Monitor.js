'use strict';
import rethinkdbdash from 'rethinkdbdash'
import db_config from '../config/thinkdb.config'

let r = rethinkdbdash(db_config); 

class Monitor{
	constructor(io){
		this.io = io;
	}
	//初始数据
	async initData(){
		if(!this.allData){
			console.log("init data");
			var users;
			var users_data = { };
			var users_ids = { };
			var foods;
			var foods_data = { };
			var foods_ids = { };
			//console.log(socket.uid)
			try{
				foods = await r.table("foods");
				var i = 0;
				foods.forEach(v=>{
					foods_ids[v.id] = i;
					i++;
				})
				users = await r.table("users");
				i = 0;
				users.forEach(v=>{
					users_ids[v.id] = i;
					i++;
				})
			}catch(e){
				console.log(e)
			}
			this.allData = {
				users: {
					ids: users_ids,
					data: users,
				},
				foods: {
					ids: foods_ids,
					data: foods,
				},
			};
		}
	}
	//获取用户信息
	loginEvent(socket){
		socket.on('loginEvent', data=>{
			socket.uid = data.uid;
			
			//console.log(this.allData)	
			this.io.emit("loginEvent",{
				uid: data.uid,
				allData : this.allData, 
			})
			//this.updateEvent()
		});
	}

	updateEvent(){
		this.cursorCommon("foods");
		this.cursorCommon("users");
	}
	/***
	* 更新到node内存中
	* @param {Object} 更新的数据
	*/
	updateAllDataForNode(updateList){
		updateList.forEach(v=>{
			console.log(v)
			var table = this.allData[v.table];
			var ids = table.ids;
			var data = table.data;
			switch(v.type){
				case "update":
					data[ids[v.data.id]] = v.data;
					break;
				case "insert":
					data.push(v.data);
					break;
				case "delete":
					try{
						data.splice(ids[v.data.id],1)
						var i = 0;
						var table_ids = {}
						ids[v.data.id] = data.length;
						data.forEach(v=>{
							table_ids[v.id] = i;
							i++;
						})
						table.ids = table_ids;
					}catch(e){
						console.log(e)
					}
					break;
			}
		})
		
	}
	/**
	* rethinkdb changefeeds
	* @param { String } 表名
	*/
	cursorCommon(table){
		r.table(table).changes({
			//includeStates: true,
			//includeInitial: true, // this line is now required
			//squash: 3,//推送间隔
		}).then(cursor=>{
			cursor.each((err,v)=>{
				//console.log(v)
				var type = "update";
				if(v.new_val && v.old_val){
					type = "update";
				}else if(v.new_val && !v.old_val){
					type = "insert";
				}else if(!v.new_val && v.old_val){
					type = "delete";
				}
				var updateList = [
					{
						table: table,	
						data: v.new_val || v.old_val,	
						type,
					},
				]
				this.updateAllDataForNode(updateList);
				this.io.emit("updateEvent",{
					updateList
				})
			})
		})
	}
	//退出
	logoutEvent(socket){
		socket.on('disconnect',()=>{
			console.log("logout")
			this.io.emit("logout",{
				uid: socket.uid,
			})
		})
	}
}

module.exports = Monitor;

