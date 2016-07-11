'use strict';

module.exports = function websocket(server) {
	var socketIo = require('socket.io');
	var io = socketIo(server);
	var Monitor = require('./websocket/Monitor') 
	var monitor = new Monitor(io)
	monitor.updateEvent()
	io.on('connection', socket=>{ 
		monitor.loginEvent(socket)
		monitor.logoutEvent(socket)
	});
}
