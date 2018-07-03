(function () {

  var postData = GetRequest();
  console.log(postData);

  //得到学习记录
  getAllNews(postData);

})()

//这部很关键呐，解决了好久，url中中文字符会被编成乱码
function GetRequest() {
  var url = decodeURI(decodeURI(location.search)); //获取url中"?"符后的字串，使用了两次decodeRUI解码
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    return theRequest;
  }
}

function getAllNews(lastdata) {
  $.ajax({
    url: "/postsearchdata",
    type: 'POST',
    dataType: 'JSON',
    data: {
      searchdata: lastdata
    },
    success: function (data) {

      //如果请求成功
      console.log(data);
      if (data == null || data == '') {
        $('#rightplace').eq(0).html('请输入搜索的内容！！');
      } else {
        doCompanyNews(data);
      }
    },
    error: function () {
      // alert('服务器出错了！');
      $('#rightplace').eq(0).html('请输入搜索的内容！！');
    }
  });
}

function doCompanyNews(data) {
  var rightplace = '';
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == 'company') {
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
    } else {
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
          <span class="on_sale title_shop">行业新闻</span>
        </div>
      </div>
      `.trim();
    }
  }
  $('#newsNumbur').html(data.length);
  $('#rightplace').eq(0).html(rightplace);
}