const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany' });

var router = express.Router();

module.exports = function () {

    //请求首页公司历程
    router.get('/companyHistory', (req, res) => {
        db.query(`SELECT * FROM companyhistory_table ORDER BY year DESC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //向前台返回navname
    router.get('/getnavname', (req, res) => {
        db.query(`SELECT * FROM navname_table ORDER BY ID ASC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //请求logo
    router.get('/getlogo', (req, res) => {
        db.query(`SELECT * FROM image_table WHERE image_name='${'logo'}'`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //请求banner
    router.get('/getBanner', (req, res) => {
        db.query(`SELECT * FROM banner_table ORDER BY ID ASC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //请求新闻的置顶那个
    router.get('/getNews', (req, res) => {
        db.query(`SELECT * FROM news_table ORDER BY see_numbur DESC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //请求行业新闻置顶的那个
    router.get('/getHangye', (req, res) => {
        db.query(`SELECT * FROM industryconsulting_table ORDER BY see_numbur DESC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //获取产品分类的个数
    router.get('/tags', (req, res) => {
        db.query(`SELECT DISTINCT product_type FROM product_table`, (err, data) => {
            if (err) {
                res.status(500).send('数据库错误').end();
            }
            else {
                res.send(data).end();
            }
        })
    });

    //获取产品所有数据
    router.get('/getProduct', (req, res) => {
        db.query(`SELECT * FROM product_table`, (err, data) => {
            if (err) {
                res.status(500).send('数据库没有找到这条数据！').end();
            }
            else {
                res.send(data).end();
            }
        })
    })

    //处理分类post
    router.post('/getOnceTags', (req, res) => {
        console.log(req.body);
        db.query(`SELECT * FROM product_table WHERE product_type='${req.body.tagname}'`, (err, data) => {
            if (err) {
                res.status(500).send('数据库没有找到这条数据！').end();
            }
            else {
                res.send(data).end();
            }
        })
    })

    //测试limit用法
    //第一个数是起始位置，第二个是条数
    router.get('/getCompanyNews', (req, res) => {
        // console.log(req.query.location);
        // console.log(req.query.number);
        if(req.query.location!=undefined && req.query.number!=undefined){
            db.query(`SELECT * FROM news_table limit ${req.query.location},${req.query.number}`, (err, data) => {
                if (err) {
                    res.status(500).send('数据库没有找到这条数据！1').end();
                }
                else {
                    res.send(data).end();
                }
            })
        }
        else{
            db.query(`SELECT * FROM news_table ORDER BY ID DESC`, (err, data) => {
                if (err) {
                    res.status(500).send('数据库没有找到这条数据！2').end();
                }
                else {
                    res.send(data).end();
                }
            })
        }
    })


    //获取学习记录所有数据
    // router.get('/getCompanyNews', (req, res) => {
    //     db.query(`SELECT * FROM news_table ORDER BY ID DESC`, (err, data) => {
    //         if (err) {
    //             res.status(500).send('数据库没有找到这条数据！').end();
    //         }
    //         else {
    //             res.send(data).end();
    //         }
    //     })
    // })

    //获取行业新闻所有数据
    router.get('/getOtherNews', (req, res) => {
        db.query(`SELECT * FROM industryconsulting_table ORDER BY ID DESC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库没有找到这条数据！').end();
            }
            else {
                res.send(data).end();
            }
        })
    })

    //获取新闻banner
    router.get('/getNewsBanner', (req, res) => {
        db.query(`SELECT * FROM image_table WHERE image_name='${'newsBanner'}' ORDER BY ID DESC`, (err, data) => {
            if (err) {
                res.status(500).send('数据库没有找到这条数据！').end();
            }
            else {
                res.send(data).end();
            }
        })
    })

    //背景大图的获取
    router.get('/getBackgroudImage', (req, res) => {
        db.query(`SELECT * FROM image_table WHERE image_name='${'背景大图'}'`, (err, data) => {
            if (err) {
                res.status(500).send('数据库没有找到这条数据！').end();
            }
            else {
                res.send(data).end();
            }
        })
    })

    //搜索的数据
    router.post('/postsearchdata', (req, res) => {
        var data = req.body.searchdata;
        console.log(data);
        if (data != null) {
            db.query(`SELECT * FROM news_table WHERE title OR content like '%${data.search}%'
            UNION
            SELECT * FROM industryconsulting_table WHERE title OR content like '%${data.search}%'`, (err, data) => {
                    if (err) {
                        res.status(500).send('数据库没有找到这条数据！').end();
                    }
                    else {
                        res.send(data).end();
                    }
                })
        } else {
            res.send('没有这条数据').end();
        }   
    })

    return router;
};