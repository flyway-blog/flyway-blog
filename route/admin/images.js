const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

var db = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany' });

const pathLib = require('path');
const fs = require('fs');

module.exports = function () {

  var router = express.Router();

  router.get('/', function (req, res) {
    switch (req.query.act) {
      case 'del':
        db.query(`SELECT * FROM image_table WHERE ID=${req.query.id}`, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('数据库错误').end();
          }
          else {
            if (data.length == 0) {
              res.status(404).send('没有这个图片').end();
            }
            else {
              fs.unlink('static/upload/' + data[0].image_url, (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('文件操作失败').end();
                }
                else {
                  db.query(`DELETE FROM image_table WHERE ID=${req.query.id}`, (err, data) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('数据库错误').end();
                    }
                    else {
                      res.redirect('/admin/images');
                    }
                  });
                }
              });
            }
          }
        });
        break;
      case 'mod':
        db.query(`SELECT * FROM image_table WHERE ID=${req.query.id}`, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('database error').end();
          } else if (data.length == 0) {
            res.status(404).send('no this evaluation').end();
          } else {
            db.query(`SELECT * FROM image_table`, (err, imadata) => {
              if (err) {
                console.error(err);
                req.status(500).send('database error').end();
              }
              else {
                res.render('admin/images.ejs', { imadata, mod_data: data[0] });
              }
            });
          }
        });
        break;
      default:
        db.query(`SELECT * FROM image_table`, (err, imadata) => {
          if (err) {
            console.error(err);
            req.status(500).send('database error').end();
          }
          else {
            res.render('admin/images.ejs', { imadata });
          }
        });
    }
  });
  router.post('/', function (req, res) {
    // console.log(req.body);
    var image_name = req.body.image_name;
    var type = req.body.type;

    if (req.files[0]) {
      var ext = pathLib.parse(req.files[0].originalname).ext;

      var oldPath = req.files[0].path;
      var newPath = req.files[0].path + ext;

      var newFileName = req.files[0].filename + ext;
    }
    else {
      var newFileName = null;
    }
    //如果有上传的图片不为空
    if (newFileName) {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('文件没有选择。').end();
        }
        else {
          if (req.body.mod_id) {  //修改
            //先删除老的
            db.query(`SELECT * FROM image_table WHERE ID=${req.body.mod_id}`, (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).send('数据库出错。').end();
              }
              else if (data.length == 0) {
                res.status(404).send('旧文件没有找到。').end();
              }
              else {
                fs.unlink('static/upload/' + data[0].image_url, (err) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send('文件打开失败。').end();
                  }
                  else {
                    db.query(`UPDATE image_table SET \
                      image_name='${image_name}', type='${type}', \
                      image_url='${newFileName}' \
                      WHERE ID=${req.body.mod_id}`, (err) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send('database error').end();
                        }
                        else {
                          res.redirect('/admin/images');
                        }
                      });
                  }
                });
              }
            });
          }
          else {                //添加
            db.query(`INSERT INTO image_table \
            (image_name, type, image_url)
            VALUES('${image_name}', '${type}', '${newFileName}')`, (err, data) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('database error').end();
                }
                else {
                  res.redirect('/admin/images');
                }
              });
          }
        }
      });
    }
    else {
      if (req.body.mod_id) {  //修改
        //直接改
        db.query(`UPDATE image_table SET \
          image_name='${image_name}', type='${type}' \
          WHERE ID=${req.body.mod_id}`, (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('database error').end();
            }
            else {
              res.redirect('/admin/images');
            }
          });
      }
      else {                //添加
        db.query(`INSERT INTO image_table \
        (image_name, type, image_url)
        VALUES('${image_name}', '${type}', '${newFileName}')`, (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send('database error').end();
            }
            else {
              res.redirect('/admin/images');
            }
          });
      }
    }
  });

  return router;
};
