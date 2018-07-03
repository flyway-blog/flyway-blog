/**
 * Created by ltx on 2017/9/11.
 */
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
                db.query(`SELECT * FROM industryconsulting_table WHERE ID='${req.query.id}'`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database error').end();
                    } else {
                        if (data.length == 0) {
                            res.status(404).send('no this industryconsulting evaluation').end();
                        } else {
                            fs.unlink('static/upload/' + data[0].url, (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('file opration error').end();
                                } else {
                                    db.query(`DELETE FROM industryconsulting_table WHERE ID='${req.query.id}'`, (err, data) => {
                                        if (err) {
                                            console.error(err);
                                            res.status(500).send('database error').end();
                                        } else {
                                            res.redirect('/admin/industryconsulting');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            case 'mod':
                db.query(`SELECT * FROM industryconsulting_table WHERE ID = '${req.query.id}'`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database erro mod1').end();
                    } else if (data.length == 0) {
                        res.status(404).send('no this industryconsulting').end();
                    } else {
                        db.query(`SELECT * FROM industryconsulting_table`, (err, industryconsultingdata) => {
                            if (err) {
                                console.error(err);
                                req.status(500).send('database erro mod2').end();
                            } else {
                                res.render('admin/industryconsulting.ejs', { industryconsultingdata, mod_data: data[0] });
                            }
                        });
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM industryconsulting_table`, (err, industryconsultingdata) => {
                    if (err) {
                        console.error(err);
                        req.status(500).send('database errordefault').end();
                    } else {
                        res.render('admin/industryconsulting.ejs', { industryconsultingdata });
                    }
                });
        }
    });

    //post意味着添加和修改
    router.post('/', function (req, res) {
        var title = req.body.title;
        var second_title = req.body.second_title;
        var content = req.body.content;
        var post_time = req.body.post_time;
        var author = req.body.author;
        var type = req.body.leixing;
        //console.log(req.body);

        if (req.files[0]) {
            var ext = pathLib.parse(req.files[0].originalname).ext;

            var oldPath = req.files[0].path;
            var newPath = req.files[0].path + ext;
            //将前面的字符串与文件名的后缀拼接起来
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
                    res.status(500).send('file opration error1').end();
                }
                else {
                    if (req.body.mod_id) {  //修改
                        //先删除老的
                        db.query(`SELECT * FROM industryconsulting_table WHERE ID='${req.body.mod_id}'`, (err, data) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('database error post1').end();
                            }
                            else if (data.length == 0) {
                                res.status(404).send('old file not found').end();
                            }
                            else {
                                fs.unlink('static/upload/' + data[0].url, (err) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).send('file opration error2').end();
                                    }
                                    else {
                                        db.query(`UPDATE industryconsulting_table SET title='${title}', second_title='${second_title}', url='${newFileName}', content='${content}', author='${author}',post_time='${post_time}' 
                      WHERE ID='${req.body.mod_id}'`, (err) => {
                                                if (err) {
                                                    console.error(err);
                                                    res.status(500).send('database error updata').end();
                                                }
                                                else {
                                                    res.redirect('/admin/industryconsulting');
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    }
                    else {                //添加
                        db.query(`INSERT INTO industryconsulting_table (title, second_title, url, content, author, post_time,type)
            VALUES('${title}', '${second_title}', '${newFileName}', '${content}', '${author}', '${post_time}','${type}')`, (err, data) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('database error add').end();
                                }
                                else {
                                    res.redirect('/admin/industryconsulting');
                                }
                            });
                    }
                }
            });
        }
        else {
            console.log(req.body);
            if (req.body.mod_id) {  //修改
                //直接改，除了没有图片外的东西
                db.query(`UPDATE industryconsulting_table SET title='${title}',second_title='${second_title}',content='${content}',author='${author}',post_time='${post_time}',type='${type}' WHERE ID=${req.body.mod_id}`, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database zhijiegai').end();
                    }
                    else {
                        res.redirect('/admin/industryconsulting');
                    }
                });
            }
            else {                //添加
                db.query(`INSERT INTO industryconsulting_table \
        (title, second_title, url, content, author, post_time, type)
        VALUES('${title}', '${second_title}', '${newFileName}', '${content}', '${author}', '${post_time}','${type}')`, (err, data) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('database error').end();
                        }
                        else {
                            res.redirect('/admin/industryconsulting');
                        }
                    });
            }
        }
    });

    return router;
};
