(function () {

  //修改banner
  getBanner();

  //修改最热的学习记录和行业动态
  getNews();

  //修改最热的行业动态
  getHangye();

  //获取公司历程数据
  getCompanyHistory();
})()

function getCompanyHistory() {
  $.ajax({
      url: "/companyHistory",
      type: 'GET',
      dataType: 'JSON',
      success: function (text) {

          //如果请求成功
          headCompanyHistory(text);
          console.log(text);
      },
      error: function () {
          alert('服务器出错了！！停电了？');
      }
  });
}

function getHangye(){
  $.ajax({
    url: "/getHangye",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      changeHangye(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function changeHangye(data){
  $('#hangyeImage').attr('src','/upload/'+data[0].url);
  $('#hangyeTitle').eq(0).html(data[0].title);
  $('#seeNumburhangye').eq(0).html(data[0].see_numbur);
  $('#postTimehangye').eq(0).html(data[0].post_time);
  $('#hangyesecondtitle').eq(0).html(data[0].second_title);
}


function getNews() {
  $.ajax({
    url: "/getNews",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      changeNews(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function changeNews(data){
  $('#newsImage').attr('src','/upload/'+data[0].url);
  $('#author').eq(0).html(data[0].author);
  $('#seeNumbur').eq(0).html(data[0].see_numbur);
  $('#postTime').eq(0).html(data[0].post_time);
  $('#contentNews').eq(0).html(data[0].second_title);
}


function getBanner() {
  $.ajax({
    url: "/getBanner",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      changeBanner(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function changeBanner(data) {
  $('#banner1').css('background', "url(" + '/upload/' + data[0].url + ") no-repeat 0px 0px");
  $('#banner2').css('background', "url(" + '/upload/' + data[1].url + ") no-repeat 0px 0px");
  $('#banner3').css('background', "url(" + '/upload/' + data[2].url + ") no-repeat 0px 0px");
  for (var i = 0; i < data.length; i++) {
    $('.changeTitle').eq(i).html(data[i].title);
    $('.changeTitleh3').eq(i).html(data[i].second_title);
    $('.introduce').eq(i).html(data[i].description);
  }
}

/*
 *首页的公司历程列表
 **/

function headCompanyHistory(text) {
  // console.log(text.length);
  var oTimeLine = document.getElementsByClassName('timeline')[0];
  for (var i = 0; i < text.length; i++) {
      var oLi = document.createElement("li");
      oTimeLine.appendChild(oLi);

      var oTimeSide = document.createElement('div');
      oTimeSide.setAttribute('class', 'timeside');
      oLi.appendChild(oTimeSide);


      var oTimeSideYear = document.createElement('span');

      oTimeSideYear.setAttribute('class', 'timeyear');

      oTimeSide.appendChild(oTimeSideYear);
      var yearAndMonth = text[i].year;
      $('.timeyear').eq(i).html(yearAndMonth);
  

      var oTianShuXian = document.createElement('div');
      oTianShuXian.setAttribute('class', 'timeShuxian');
      oLi.appendChild(oTianShuXian);

      var oBoWen = document.createElement('div');
      oBoWen.setAttribute('class', 'bowen');
      oLi.appendChild(oBoWen);

      var oBoWenImg = document.createElement('div');
      oBoWenImg.setAttribute('class', 'bowenImg');
      oBoWen.appendChild(oBoWenImg);

      var oImg = document.createElement('img');
      oBoWenImg.appendChild(oImg);

      var bpic = text[i].src;
      //console.log(bpic);
      $(".bowenImg > img").eq(i).attr("src", '/upload/' + bpic);

      var oSpan = document.createElement('span');
      oSpan.setAttribute('class', 'title');
      oBoWen.appendChild(oSpan);
      var bt = text[i].title;
      // console.log(bt);
      $('.title').eq(i).html(bt);

      (function () {
          var z = i;
          document.getElementsByClassName("title")[z].onclick = function () {

              // $.ajax({
              //     type: 'POST',
              //     url: "/user/seenum",
              //     data: {
              //         article_id: text[z].ID
              //     },
              //     success: function () {
              //         console.log('成功');
              //     }
              // });
              window.location.href = "companyHistoryDetail.html?id=" + text[z].ID;
          }
      })()

      var oP = document.createElement('p');
      oP.setAttribute('class', 'shortword');
      oBoWen.appendChild(oP);
      var bs = text[i].description;
      //console.log(bs);
      $('.shortword').eq(i).html(bs);

      var obowenTools = document.createElement('div');
      obowenTools.setAttribute('class', 'tools');
      oBoWen.appendChild(obowenTools);

      // var toolspan1 = document.createElement('span');
      // var toolspan1i = document.createElement('i');
      // toolspan1.setAttribute('class', 'see icon-users');
      // toolspan1.appendChild(toolspan1i);
      // obowenTools.appendChild(toolspan1);
      // $('.see').eq(i).html(text[i].custompeople);

      // var toolspan2 = document.createElement('span');
      // var toolspan2i = document.createElement('i');
      // toolspan2.setAttribute('class', 'like icon-happy2');
      // toolspan2.appendChild(toolspan2i);
      // obowenTools.appendChild(toolspan2);
      // //console.log(text[i].nlike);
      // $('.like').eq(i).html(text[i].nlike);

      var toolspan3 = document.createElement('span');
      var toolspan3i = document.createElement('i');
      toolspan3.setAttribute('class', 'time icon-table');
      toolspan3.appendChild(toolspan3i);
      obowenTools.appendChild(toolspan3);
      var btime = text[i].year;
      $('.time').eq(i).html(btime);
  }
}