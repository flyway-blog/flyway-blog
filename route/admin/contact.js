const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: '127.0.0.1', user: 'root', password: '123456', database: 'nodecompany'});

module.exports=function (){
  var router=express.Router();

  router.get('/', (req, res)=>{
    switch(req.query.act){
      case 'mod':
        db.query(`SELECT * FROM companycontact_table WHERE id=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else if(data.length==0){
            res.status(404).send('data not found').end();
          }else{
            db.query('SELECT * FROM companycontact_table', (err, contact)=>{
              if(err){
                console.error(err);
                res.status(500).send('database error').end();
              }else{
                res.render('admin/contact.ejs', {contact, mod_data: data[0]});
              }
            });
          }
        });
        break;
      case 'del':
        db.query(`DELETE FROM companycontact_table WHERE ID=${req.query.id}`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/contact');
          }
        });
        break;
      default:
        db.query('SELECT * FROM companycontact_table', (err, contact)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.render('admin/contact.ejs', {contact});
          }
        });
        break;
    }
  });
  router.post('/', (req, res)=>{
    var companyphone=req.body.companyphone;
    var companyEmail=req.body.companyEmail;
    var adress=req.body.adress;
    var mailcode = req.body.mailCode;
    console.log(req.body);
    if(!companyphone || !companyEmail || !adress){
      res.status(400).send('arg error').end();
    }else{
      if(req.body.mod_id){    //修改
        db.query(`UPDATE companycontact_table SET \
          company_phone='${req.body.companyphone}',\
          company_email='${req.body.companyEmail}',\
          company_adress='${req.body.adress}', \
          company_mailcode = '${req.body.mailCode}'
          WHERE ID=${req.body.mod_id}`,
          (err, data)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/admin/contact');
            }
          }
        );
      }else{                  //添加
        db.query(`INSERT INTO companycontact_table (company_phone, company_email, company_adress, company_mailcode) VALUE('${companyphone}', '${companyEmail}', '${adress}','${mailcode}')`, (err, data)=>{
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            res.redirect('/admin/contact');
          }
        });
      }
    }
  });

  return router;
};
