'use strict';

class New{
	constructor(db){
		this.db = db;
	}

	getCollection(){
		try{
			var collection = this.db.collection(this.collectionName());	
		}catch(e){
			console.log('获取collection集合出错！');
			console.log(e);
		}
		return collection;
	}

	collectionName(){
		return 'new';
	}

	close(){
		this.db.close();
	}
	
}

module.exports = New;
