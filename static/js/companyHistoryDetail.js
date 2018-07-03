/**
 * Created by ltx on 2017/9/28.
 */
(function () {
  //找url里面的id咯
  var article_id=getQueryString("id");
  console.log(article_id);

  articeShows(article_id);

})()


//文章在页面展示
function articeShows(article_id) {
  var aID=article_id;
  $.ajax({
      url:"/companyHistory",
      type:'GET',
      dataType:'JSON',
      data:{
          article_id:article_id
      },
      success:function (text) {
          //文章放置在页面上
          //console.log(text);
          //通过传的id值循环匹配到数据里面的那一项，
          //然后放到页面

          for (var i=0;i<text.length;i++){
              if (text[i].ID==aID){
                  console.log(text[i].content);
                  var text1 = text[i].content;
                  var converter = new showdown.Converter();
                  var html = converter.makeHtml(text1);
                  document.getElementsByClassName('blog')[0].innerHTML = html;

                  var btime=text[i].year;
                  $('.time').html(btime);
                  console.log(text[i]);
              }
          }
      },
      error:function () {
          console.log('木有找到这篇文章的id');
      }
  });
}

//获取url信息，找id值咯
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }else{
      return null;
  }
}
