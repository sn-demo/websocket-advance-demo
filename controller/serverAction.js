'use strict';
var parse = require('co-body');

module.exports = async function(ctx, next){
  var actionName = ctx.request.body.actionName;
	var data = { };
  switch(actionName){
    case "Login":
      data = {
        code: 200,
        message: "登录成功",
        datas: [
          {
            userId: "xianshannan",
            role: 3,
            status: 0,
          }
        ],
      }
    break;
  }
	ctx.body = data;
}

