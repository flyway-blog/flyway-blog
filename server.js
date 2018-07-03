const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');

//用来处理post文件上传，bodyparser不能处理文件，声音那些数据
const multer=require('multer');
//告诉它把文件存到哪个文件夹
const multerObj=multer({dest: './static/upload'});

const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');

var server=express();

//监听8888端口
server.listen(8888);

//1.获取请求数据
//get自带
//bodyParser能给req对象增加一个body属性，用来查看post过来的数据
//req.query存的GET数据
//req.body存的POST数据
server.use(bodyParser.urlencoded());

//接收任何文件类型
server.use(multerObj.any());

//2.cookie、session循环加密
server.use(cookieParser());
(function (){

  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }

  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000*72  //20min乘72 一天
  }));

})();

//3.使用哪种模板引擎
server.engine('html', consolidate.ejs);

//我的模板文件放哪里
server.set('views', 'template');

//用模板引擎呈现一个什么东西：html
server.set('view engine', 'html');

//4.前台route
server.use('/', require('./route/web/index.js')());

//后台管理页路由
server.use('/admin/', require('./route/admin/index.js')());

//5.default：static静态资源的文件夹
server.use(static('./static/'));
