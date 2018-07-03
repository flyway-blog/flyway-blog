/**
 * Created by ltx on 2017/10/23.
 */
const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany'});

module.exports=function () {
    var router=express.Router();

    router.get('/',(req,res)=>{
        //console.log(req.body);

        db.query(`SELECT * FROM noticeword_table`, (err, noticedata)=>{
            if(err){
                console.error(err);
                res.status(500).send('database errordefault').end();
            }else{
                res.render('admin/notice.ejs', {noticedata});
            }
        });
    });


    router.post('/',(req,res)=>{
        //console.log(req.body);
        var noticeword=req.body.noticeword;
        var noticetitle = req.body.noticetitle;
        var noticetime = req.body.noticetime;
        db.query(`UPDATE noticeword_table SET notice_word='${noticeword}', title='${noticetitle}', date='${noticetime}'`,(err)=>{
            if (err){
                res.status(500).send('数据库出错了').end();
            }
            else {
                res.redirect('/admin/headDescription');
            }
        })
    });

    return router;
}