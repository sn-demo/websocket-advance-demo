'use strict';
import { MongoClient } from 'mongodb'

class Mongo{
	constructor(config={}){
		this.config = {}
		Object.assign(this.config,config)
	}
	
	async connect(){
		var db;
		try{
			db = await MongoClient.connect(this.config.url);
		}catch(e){
			console.log('连接mongodb失败！')
			console.log(e)
		}
		return db;
	}

}

module.exports = Mongo;  
