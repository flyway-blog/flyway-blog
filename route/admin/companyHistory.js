/**
 * Created by ltx on 2017/12/27.
 */
const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');

var db=mysql.createPool({host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany'});

const pathLib=require('path');
const fs=require('fs');

module.exports=function (){
    var router=express.Router();

    router.get('/', function (req, res){
        switch(req.query.act){
            case 'del':
                db.query(`SELECT * FROM companyhistory_table WHERE ID='${req.query.id}'`, (err, data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('数据库出错了。line => 22').end();
                    }else{
                        if(data.length==0){
                            res.status(404).send('木有这条信息').end();
                        }else{
                            fs.unlink('static/upload/'+data[0].src, (err)=>{
                                if(err){
                                    console.error(err);
                                    res.status(500).send('文件操作错误').end();
                                }else{
                                    db.query(`DELETE FROM companyhistory_table WHERE ID='${req.query.id}'`, (err, data)=>{
                                        if(err){
                                            console.error(err);
                                            res.status(500).send('数据库出错了。 line => 35').end();
                                        }else{
                                            res.redirect('/admin/companyHistory');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            case 'mod':
                db.query(`SELECT * FROM companyhistory_table WHERE ID = '${req.query.id}'`, (err, data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('数据库出错了。 line => 50').end();
                    }else if(data.length==0){
                        res.status(404).send('没有这个东东').end();
                    }else{
                        db.query(`SELECT * FROM companyhistory_table`, (err, historyData)=>{
                            if(err){
                                console.error(err);
                                req.status(500).send('数据库出错了。 line => 57').end();
                            }else{
                                res.render('admin/companyHistory.ejs', {historyData, mod_data: data[0]});
                            }
                        });
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM companyhistory_table`, (err, historyData)=>{
                    if(err){
                        console.error(err);
                        req.status(500).send('数据库出错了。 line => 69').end();
                    }else{
                        res.render('admin/companyHistory.ejs', {historyData});
                    }
                });
        }
    });

    //post意味着添加和修改
    router.post('/', function (req, res){
        var title=req.body.title;
        var description=req.body.description;
        var content=req.body.content;
       // var post_time=req.body.post_time;
        var year=req.body.year;
        // console.log(req.body);

        if(req.files[0]){
            var ext=pathLib.parse(req.files[0].originalname).ext;

            var oldPath=req.files[0].path;
            var newPath=req.files[0].path+ext;
            //将前面的字符串与文件名的后缀拼接起来
            var newFileName=req.files[0].filename+ext;
        }
        else{
            var newFileName=null;
        }
        //如果有上传的图片不为空
        if(newFileName){
            fs.rename(oldPath, newPath, (err)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('文件操作失败了').end();
                }
                else{
                    if(req.body.mod_id){  //修改
                        //先删除老的
                        db.query(`SELECT * FROM companyhistory_table WHERE ID='${req.body.mod_id}'`, (err, data)=>{
                            if(err){
                                console.error(err);
                                res.status(500).send('数据库出错了。 line => 110').end();
                            }
                            else if(data.length==0){
                                res.status(404).send('要删除的文件没有找到。').end();
                            }
                            else{
                                fs.unlink('static/upload/'+data[0].src, (err)=>{
                                    if(err){
                                        console.error(err);
                                        res.status(500).send('文件操作失败。').end();
                                    }
                                    else{
                                        db.query(`UPDATE companyhistory_table SET title='${title}', description='${description}', src='${newFileName}', content='${content}', year='${year}' 
                      WHERE ID='${req.body.mod_id}'`, (err)=>{
                                            if(err){
                                                console.error(err);
                                                res.status(500).send('数据库更新出错了。 line => 126').end();
                                            }
                                            else{
                                                res.redirect('/admin/companyHistory');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else{                //添加
                        db.query(`INSERT INTO companyhistory_table (title, description, src, content, year)
            VALUES('${title}', '${description}', '${newFileName}', '${content}', '${year}')`, (err, data)=>{
                            if(err){
                                console.error(err);
                                res.status(500).send('数据增加错误. line => 142').end();
                            }
                            else{
                                res.redirect('/admin/companyHistory');
                            }
                        });
                    }
                }
            });
        }
        else{
            console.log(req.body);
            if(req.body.mod_id){  //修改
                //直接改，除了没有图片外的东西
                db.query(`UPDATE companyhistory_table SET title='${title}',description='${description}',content='${content}',year='${year}' WHERE ID=${req.body.mod_id}`, (err)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database zhijiegai').end();
                    }
                    else{
                        res.redirect('/admin/companyHistory');
                    }
                });
            }
            else{                //添加
                db.query(`INSERT INTO companyhistory_table \
        (title, description, src, content, year)
        VALUES('${title}', '${description}', '${newFileName}', '${content}', '${year}')`, (err, data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }
                    else{
                        res.redirect('/admin/bcompanyHistorylog');
                    }
                });
            }
        }
    });

    return router;
};
