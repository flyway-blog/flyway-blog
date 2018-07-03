const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany' });

module.exports = function () {
  var router = express.Router();

  //如果直接是get请求数据的话直接ejs后台模板渲染
  router.get('/', (req, res) => {
    res.render('admin/login.ejs', {});
  });

  //如果是post请求的话
  router.post('/', (req, res) => {
    //console.log(req.body+'aaa');
    var username = req.body.username;
    var password = common.md5(req.body.password + common.MD5_SUFFIX);

    db.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('数据库操作错误').end();
      } else {
        if (data.length == 0) {
          res.status(400).send('管理员不存在').end();
        } else {
          if (data[0].password == password) {
            //成功给session赋值，值为数据库里username的id
            req.session['admin_id'] = data[0].ID;
            //登录成功之后返回admin的首页·
            res.redirect('/admin/');
          } else {
            //不成功返回错误400
            res.status(400).send('密码或用户名不正确').end();
          }
        }
      }
    });
  });

  return router;
};
