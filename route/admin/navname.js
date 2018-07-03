const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany'});

module.exports=function (){
  var router=express.Router();

  router.get('/', (req, res)=>{
    switch(req.query.act){
      case 'mod':
        db.query(`SELECT * FROM navname_table WHERE id=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else if(data.length==0){
            res.status(404).send('data not found').end();
          }else{
            db.query('SELECT * FROM navname_table', (err, navname)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.render('admin/navname.ejs', {navname, mod_data: data[0]});
              }
            });
          }
        });
        break;
      case 'del':
        db.query(`DELETE FROM navname_table WHERE ID=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/navname');
          }
        });
        break;
      default:
        db.query('SELECT * FROM navname_table', (err, navname)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.render('admin/navname.ejs', {navname});
          }
        });
        break;
    }
  });
  router.post('/', (req, res)=>{
    // var navName=req.body.navName;
    var newNavName=req.body.newNavName;

    console.log(req.body);
    if( !newNavName){
      res.status(400).send('arg error').end();
    }else{
      if(req.body.mod_id){    //修改
        db.query(`UPDATE navname_table SET \
          newNavName='${req.body.newNavName}'
          WHERE ID=${req.body.mod_id}`,
          (err, data)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/admin/navname');
            }
          }
        );
      }else{                  //添加
        db.query(`INSERT INTO navname_table (newNavName) VALUE( '${newNavName}')`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/navname');
          }
        });
      }
    }
  });

  return router;
};
