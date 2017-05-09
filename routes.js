'use strict';
import koaRouter from 'koa-router'
import index from './controller/index'
import init_data from './controller/init_data'
import serverAction from './controller/serverAction'

module.exports = function routes(app) {
	var router = koaRouter();
	router.get('/',index);
	router.get('/init_data',init_data);
	router.post('/server/action',serverAction);
	return router;
}
