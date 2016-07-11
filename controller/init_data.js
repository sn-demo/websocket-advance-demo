'use strict';
import rethinkdbdash from 'rethinkdbdash'
import db_config from '../config/thinkdb.config'

module.exports = async function(ctx, next){
	var data = { };
	let r = rethinkdbdash(db_config) 
	data = await r.table("foods");
	r.getPoolMaster().drain();
	ctx.body = data;
}

