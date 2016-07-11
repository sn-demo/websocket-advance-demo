'use strict';

class User{
	constructor(io){
		this.io = io;
		this.users = {};	
	}
	//获取用户信息
	loginEvent(socket){
		socket.on('login', data=>{
			socket.user_id = data.user_id;
			this.initUsersState(data.user_id);
			console.log(socket.user_id)
			this.io.emit("login",{
				users: this.users,
				uid: data.user_id,
			})
		});
	}
	//初始用户状态
	initUsersState(user){
		this.users[user] = {
			name: user,
		};	
	}
	
	sendUserMessage(socket){
		socket.on('message',data=>{
			this.io.emit('message',{
				message: data.message,
				users: this.users,
				uid: socket.user_id,
				mid: data.mid,
			})
			console.log(socket.user_id+":说"+data.message)
		})
	}

	//退出
	logoutEvent(socket){
		socket.on('disconnect',()=>{
			if(this.users[socket.user_id]){
				delete this.users[socket.user_id];
			}
			console.log(this.users)
			this.io.emit("logout",{
				users: this.users,
				uid: socket.user_id,
			})
		})
	}
}

module.exports = User;
