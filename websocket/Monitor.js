'use strict';
import rethinkdbdash from 'rethinkdbdash'
import db_config from '../config/thinkdb.config'
let r = rethinkdbdash(db_config); 

class Monitor{
	constructor(io){
		this.io = io;
	}
	//获取用户信息
	loginEvent(socket){
		socket.on('loginEvent', async data=>{
			socket.uid = data.uid;
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

			this.io.emit("loginEvent",{
				uid: data.uid,
				allData : {
					users: {
						ids: users_ids,
						data: users,
					},
					foods: {
						ids: foods_ids,
						data: foods,
					},
				},
			})
			//this.updateEvent()
		});
	}

	updateEvent(){
		this.cursorCommon("foods");
		this.cursorCommon("users");
	}

	cursorCommon(table){
		r.table(table).changes({
			//includeStates: true,
			//includeInitial: true, // this line is now required
			//squash: 3,//推送间隔
		}).then(cursor=>{
			cursor.each((err,v)=>{
				console.log(v)
				var type = "update";
				if(v.new_val && v.old_val){
					type = "update";
				}else if(v.new_val && !v.old_val){
					type = "insert";
				}else if(!v.new_val && v.old_val){
					type = "delete";
				}
				this.io.emit("updateEvent",{
					updateList: [
						{
							table: table,	
							data: v.new_val || v.old_val,	
							type,
						},
					]
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

