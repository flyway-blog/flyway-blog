const express=require('express');
const common=require('../../libs/common');

module.exports=function (){
  var router=express.Router();

  //检查登录状态
  router.use((req, res, next)=>{
    //console.log(req.session['admin_id']);
   // console.log(req.session);
    if(!req.session['admin_id'] && req.url!='/login'){ //没有登录且没有访问登录界面

      //返回登录界面
      res.redirect('/admin/login');
    }else{
      next();
    }
  });

  router.get('/', (req, res)=>{
    res.render('admin/index.ejs', {});
  });

  router.use('/login', require('./login.js')());
  router.use('/banners', require('./banners.js')());
  router.use('/images',require('./images.js')());
  router.use('/news',require('./news.js')());
  router.use('/headDescription',require('./notice')());
  router.use('/companyHistory',require('./companyHistory')());
  router.use('/industryconsulting',require('./industryconsulting')());
  router.use('/product',require('./product')());
  router.use('/navname',require('./navname')());

  return router;
};
