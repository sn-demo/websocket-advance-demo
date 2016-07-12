## 实时监控系统Demo后端
先看下screenshot
![](https://raw.githubusercontent.com/sn-demo/websocket-advance-demo/master/uploads/r.gif)
## 原理图
![](https://raw.githubusercontent.com/sn-demo/websocket-advance-demo/master/uploads/schematic.jpg)
## 安装rethinkdb
这里不多说，请参考[官网](http://www.rethinkdb.com/docs/install/)
## 导入数据
下载这[数据文件](https://www.dropbox.com/s/dy48el02j9p4b2g/simplyrethink_dump_2015-08-11T22%3A15%3A51.tar.gz?dl=0.)(需要翻墙)，然后import
```
rethinkdb restore -c 127.0.0.1:28015 yourPath/simplyrethink_dump_2015-08-11T22:15:51.tar.2 gz
```
## 运行
```
git clone https://github.com/sn-demo/websocket-advance-demo.git
npm install
node index.js //node 需要v6.00以上版本
```
这样后台就运行了
## 前端页面
请参考此[Demo](https://github.com/sn-demo/r2-real-time-frontend)

