'use strict';
import Koa from 'koa' 
import http from 'http' 
import routes_config from './routes'
import websocket from './websocket'

var port = 3000;
var app = new Koa();
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());
//前端跨域处理
app.use(async (ctx,next)=>{
	ctx.response.set("Access-Control-Allow-Origin",ctx.get('origin') || '*')
	ctx.response.set("Access-Control-Allow-Credentials",true)
	ctx.response.set("Access-Control-Allow-Methods","GET,HEAD,PUT,PATCH,POST,DELETE")
	ctx.response.set("Content-Type","application/json; charset=utf-8")
	ctx.response.set("Access-Control-Allow-Headers","Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type")
	await next();
})
var server = http.createServer(app.callback());
var router = routes_config(app)
app.use(router.routes()).use(router.allowedMethods());
websocket(server);
server.listen(port);
console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
