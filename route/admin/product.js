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
                db.query(`SELECT * FROM product_table WHERE ID='${req.query.id}'`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database error').end();
                    } else {
                        if (data.length == 0) {
                            res.status(404).send('no this product evaluation').end();
                        } else {
                            fs.unlink('static/upload/' + data[0].image_url, (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('file opration error').end();
                                } else {
                                    db.query(`DELETE FROM product_table WHERE ID='${req.query.id}'`, (err, data) => {
                                        if (err) {
                                            console.error(err);
                                            res.status(500).send('database error').end();
                                        } else {
                                            res.redirect('/admin/product');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            case 'mod':
                db.query(`SELECT * FROM product_table WHERE ID = '${req.query.id}'`, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database erro mod1').end();
                    } else if (data.length == 0) {
                        res.status(404).send('no this product').end();
                    } else {
                        db.query(`SELECT * FROM product_table`, (err, productdata) => {
                            if (err) {
                                console.error(err);
                                req.status(500).send('database erro mod2').end();
                            } else {
                                res.render('admin/product.ejs', { productdata, mod_data: data[0] });
                            }
                        });
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM product_table`, (err, productdata) => {
                    if (err) {
                        console.error(err);
                        req.status(500).send('database errordefault').end();
                    } else {
                        res.render('admin/product.ejs', { productdata });
                    }
                });
        }
    });

    //post意味着添加和修改
    router.post('/', function (req, res) {
        var product_name = req.body.product_name;
        var product_description = req.body.product_description;
        var content = req.body.content;
        var post_time = req.body.post_time;
        var product_type = req.body.product_type;
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
                        db.query(`SELECT * FROM product_table WHERE ID='${req.body.mod_id}'`, (err, data) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('database error post1').end();
                            }
                            else if (data.length == 0) {
                                res.status(404).send('old file not found').end();
                            }
                            else {
                                fs.unlink('static/upload/' + data[0].image_url, (err) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).send('file opration error2').end();
                                    }
                                    else {
                                        db.query(`UPDATE product_table SET product_name='${product_name}', product_description='${product_description}', image_url='${newFileName}', content='${content}', product_type='${product_type}',post_time='${post_time}' 
                      WHERE ID='${req.body.mod_id}'`, (err) => {
                                                if (err) {
                                                    console.error(err);
                                                    res.status(500).send('database error updata').end();
                                                }
                                                else {
                                                    res.redirect('/admin/product');
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    }
                    else {                //添加
                        db.query(`INSERT INTO product_table (product_name, product_description, image_url, content, product_type, post_time)
            VALUES('${product_name}', '${product_description}', '${newFileName}', '${content}', '${product_type}', '${post_time}')`, (err, data) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('database error add').end();
                                }
                                else {
                                    res.redirect('/admin/product');
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
                db.query(`UPDATE product_table SET product_name='${product_name}',product_description='${product_description}',content='${content}',product_type='${product_type}',post_time='${post_time}' WHERE ID=${req.body.mod_id}`, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('database zhijiegai').end();
                    }
                    else {
                        res.redirect('/admin/product');
                    }
                });
            }
            else {                //添加
                db.query(`INSERT INTO product_table \
        (product_name, product_description, image_url, content, product_type, post_time)
        VALUES('${product_name}', '${product_description}', '${newFileName}', '${content}', '${product_type}', '${post_time}')`, (err, data) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('database error').end();
                        }
                        else {
                            res.redirect('/admin/product');
                        }
                    });
            }
        }
    });

    return router;
};
