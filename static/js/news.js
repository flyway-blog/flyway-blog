(function () {

  //得到news轮播图
  getBannerImg();

  //得到学习记录
  getCompanyNews();

  //得到其他（行业）新闻
  getOtherNews();

  $('#newscenter').click(function(){
    getCompanyNews();
    getOtherNews();
  })

  $('#companynews').click(function(){
    getCompanyNews();
  })

  $('#othernews').click(function(){
    getOnceOtherNews();
  })

})()

function getBannerImg(){
  $.ajax({
    url: "/getNewsBanner",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doBannerImg(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function doBannerImg(data){
  $('#banner1').css('background', "url(" + '/upload/' + data[0].image_url + ") no-repeat 0px 0px");
  $('#banner2').css('background', "url(" + '/upload/' + data[1].image_url + ") no-repeat 0px 0px");
  $('#banner3').css('background', "url(" + '/upload/' + data[2].image_url + ") no-repeat 0px 0px");
}

function getOtherNews() {
  $.ajax({
    url: "/getOtherNews",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doOtherNews(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function getOnceOtherNews(){
  $.ajax({
    url: "/getOtherNews",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doOnceOtherNews(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function doOnceOtherNews(data){
  var rightplace = '';
  for (var i = 0; i < data.length; i++) {
    rightplace += `
    <div class="post2">
      <div class="post2-info">
        <div class="post2_text">
          <h3>
            <a href="otherNewsDetail.html?id=${data[i].ID}">${data[i].title}</a>
          </h3>
          <p>${data[i].second_title}</p>
        </div>
        <div class="comments2">
          <ul>
            <li>
              <span class="glyphicon glyphicon-eye-open2" aria-hidden="true">${data[i].see_numbur}</span>
            </li>
            <li>
              <span class="glyphicon glyphicon-time2" aria-hidden="true">${data[i].post_time}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="sale-box">
        <span class="on_sale title_shop">${data[i].type}</span>
      </div>
    </div>
    `.trim();
  }
  $('#rightplace').eq(0).html(rightplace);
}

function doOtherNews(data){
  var rightplace = '';
  for (var i = 0; i < data.length; i++) {
    rightplace += `
    <div class="post2">
      <div class="post2-info">
        <div class="post2_text">
          <h3>
            <a href="otherNewsDetail.html?id=${data[i].ID}">${data[i].title}</a>
          </h3>
          <p>${data[i].second_title}</p>
        </div>
        <div class="comments2">
          <ul>
            <li>
              <span class="glyphicon glyphicon-eye-open2" aria-hidden="true">${data[i].see_numbur}</span>
            </li>
            <li>
              <span class="glyphicon glyphicon-time2" aria-hidden="true">${data[i].post_time}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="sale-box">
        <span class="on_sale title_shop">${data[i].type}</span>
      </div>
    </div>
    `.trim();
  }
  $('#otherNumbur').html(data.length);
  $('#rightplace').append(rightplace);
}

function getCompanyNews() {
  $.ajax({
    url: "/getCompanyNews",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doCompanyNews(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function doCompanyNews(data) {
  var rightplace = '';
  for (var i = 0; i < data.length; i++) {
    rightplace += `
    <div class="post2">
      <div class="post2-info">
        <div class="post2_text">
          <h3>
            <a href="companyNewsDetail.html?id=${data[i].ID}">${data[i].title}</a>
          </h3>
          <p>${data[i].second_title}</p>
        </div>
        <div class="comments2">
          <ul>
            <li>
              <span class="glyphicon glyphicon-eye-open2" aria-hidden="true">${data[i].see_numbur}</span>
            </li>
            <li>
              <span class="glyphicon glyphicon-time2" aria-hidden="true">${data[i].post_time}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="sale-box">
        <span class="on_sale title_shop">学习记录</span>
      </div>
    </div>
    `.trim();
  }
  $('#newsNumbur').html(data.length);
  $('#rightplace').eq(0).html(rightplace);
}