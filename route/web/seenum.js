/**
 * Created by ltx on 2017/9/29.
 */
const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany' });

module.exports = function () {
    var router = express.Router();

    router.post('/seenum', (req, res, next) => {
        console.log(req.body);
        var articleId = req.body.article_id;
        var fenlei = req.body.fenlei;

        if (fenlei === 'companynews') {
            db.query(`SELECT * FROM news_table WHERE ID=${articleId}`, (err, data) => {
                if (err) {
                    res.status(500).send('数据库里没有这条数据呐').end();
                }
                else {
                    console.log(data[0].see_numbur + 1);
                    if (data[0].see_numbur == null) {
                        db.query(`UPDATE news_table SET see_numbur='${0}' WHERE ID=${articleId}`, (err, data) => {
                            if (err) {
                                res.status(500).send('数据库里没有这条数据呐0.0').end();
                            }
                            else {
                                console.log('companyNews seenum初始0成功');
                            }
                        })
                    }
                    else {
                        db.query(`UPDATE news_table SET see_numbur='${data[0].see_numbur + 1}' WHERE ID=${articleId}`, (err, data) => {
                            if (err) {
                                res.status(500).send('数据库里没有这条数据呐0.0').end();
                            }
                            else {
                                console.log('companyNews seenum增加成功');
                            }
                        })
                    }
                }
            })
        }
        if (fenlei === 'othernews') {
            db.query(`SELECT * FROM industryconsulting_table WHERE ID=${articleId}`, (err, data) => {
                if (err) {
                    res.status(500).send('数据库里没有这条数据呐').end();
                }
                else {
                    console.log(data[0].see_numbur + 1);
                    if (data[0].see_numbur == null) {
                        db.query(`UPDATE industryconsulting_table SET see_numbur='${0}' WHERE ID=${articleId}`, (err, data) => {
                            if (err) {
                                res.status(500).send('数据库里没有这条数据呐0.0').end();
                            }
                            else {
                                console.log('othernews seenum初始0成功');
                            }
                        })
                    }
                    else {
                        db.query(`UPDATE industryconsulting_table SET see_numbur='${data[0].see_numbur + 1}' WHERE ID=${articleId}`, (err, data) => {
                            if (err) {
                                res.status(500).send('数据库里没有这条数据呐0.0').end();
                            }
                            else {
                                console.log('othernews seenum增加成功');
                            }
                        })
                    }
                }
            })
        }


    });

    return router;
};