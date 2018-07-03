const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany' });
const pathLib = require('path');
const fs = require('fs');

module.exports = function () {

  var router = express.Router();

  router.get('/', (req, res) => {
    switch (req.query.act) {
      case 'mod':
        db.query(`SELECT * FROM banner_table WHERE id=${req.query.id}`, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('数据库错误').end();
          }
          else if (data.length == 0) {
            res.status(404).send('data not found').end();
          }
          else {
            db.query('SELECT * FROM banner_table', (err, banners) => {
              if (err) {
                console.error(err);
                res.status(500).send('database error').end();
              } else {
                res.render('admin/banners.ejs', { banners, mod_data: data[0] });
              }
            });
          }
        });
        break;
      case 'del':
      db.query(`SELECT * FROM banner_table WHERE ID=${req.query.id}`, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('数据库错误').end();
        }
        else {
          if (data.length == 0) {
            res.status(404).send('没有这个图片').end();
          }
          else {
            fs.unlink('static/upload/' + data[0].url, (err) => {
              if (err) {
                console.error(err);
                res.status(500).send('文件操作失败').end();
              }
              else {
                db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`, (err, data) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send('数据库错误').end();
                  }
                  else {
                    res.redirect('/admin/banners');
                  }
                });
              }
            });
          }
        }
      });
        break;
      default:
        db.query('SELECT * FROM banner_table', (err, banners) => {
          if (err) {
            console.error(err);
            res.status(500).send('数据库错误。').end();
          } else {
            res.render('admin/banners.ejs', { banners });
          }
        });
        break;
    }
  });
  router.post('/', (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    var secondTitle = req.body.second_title;
    console.log(req.body);

    if (req.files[0]) {
      var ext = pathLib.parse(req.files[0].originalname).ext;

      var oldPath = req.files[0].path;
      var newPath = req.files[0].path + ext;

      var newFileName = req.files[0].filename + ext;
    } else {
      var newFileName = null;
    }

    if (!title || !description || !secondTitle) {
      res.status(400).send('传的数据不全，请检测。').end();
    }
    if (newFileName) {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('文件路径有错。').end();
        }
        else {
          if (req.body.mod_id) {  //修改
            //先删除老的
            db.query(`SELECT * FROM banner_table WHERE ID=${req.body.mod_id}`, (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).send('数据库出错。').end();
              }
              else if (data.length == 0) {
                res.status(404).send('旧数据没有找到。').end();
              }
              else {
                fs.unlink('static/upload/' + data[0].url, (err) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send('文件操作异常。').end();
                  }
                  else {
                    db.query(`UPDATE banner_table SET \
                      title='${title}', description='${description}', \
                      url='${newFileName}',second_title='${secondTitle}' \
                      WHERE ID=${req.body.mod_id}`, (err) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send('更新数据库出错。').end();
                        }
                        else {
                          res.redirect('/admin/banners');
                        }
                      });
                  }
                });
              }
            });
          }
          else {                //添加
            db.query(`INSERT INTO banner_table \
            (title, description, url, second_title)
            VALUES('${title}', '${description}', '${newFileName}','${secondTitle}')`, (err, data) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('database error添加').end();
                }
                else {
                  res.redirect('/admin/banners');
                }
              });
          }
        }
      });
    }
    else {
      if (req.body.mod_id) {    //修改
        db.query(`UPDATE banner_table SET \
          title='${req.body.title}',\
          description='${req.body.description}',\
          second_title='${req.body.second_title}'
          WHERE ID=${req.body.mod_id}`,
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send('数据库出错了。').end();
            } else {
              res.redirect('/admin/banners');
            }
          }
        );
      } else {                  //添加
        db.query(`INSERT INTO banner_table (title, description, second_title) VALUE('${title}', '${description}','${secondTitle}')`, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('database error插入').end();
          } else {
            res.redirect('/admin/banners');
          }
        });
      }
    }
  });

  return router;
};
