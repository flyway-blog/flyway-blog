(function () {
  //得到tags的数量及名称
  getTags();

  //得到产品所有数据
  getAllProduct();

})()

function clickTags() {
  var $tagsNumbur = $('.fenlei');
  console.log($tagsNumbur);
  for (var i = 0; i < $tagsNumbur.length; i++) {
    console.log($tagsNumbur[i].innerHTML);

    (function () {
      var a = i;
      $tagsNumbur.eq(a).click(function () {
        console.log(a);

        /*在获取内容之前我们先将里面的内容清空*/
        var $pro = $('#pro');
        $pro.html('');
        $.ajax({
          url: "/getOnceTags",
          type: 'POST',
          data: {
            tagname: $tagsNumbur[a].innerHTML
          },
          dataType: 'JSON',
          success: function (data) {

            //如果请求成功
            doProduct(data);
            console.log(data);
          },
          error: function () {
            alert('服务器出错了！！停电了？');
          }
        });
      })
    })()
  }
}

function getAllProduct() {
  $.ajax({
    url: "/getProduct",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doProduct(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function doProduct(data) {
  var pro = '';
  for (var i = 0; i < data.length; i++) {
    pro += `
    <div class="post2">
      <div class="post2-pic">
        <img src="/upload/${data[i].image_url}" class="img-responsive" alt="1" />
      </div>
      <div class="post2-info">
        <div class="post2_text">
          <h3>
            <a href="productDetail.html?id=${data[i].ID}">${data[i].product_name}</a>
          </h3>
          <p>${data[i].product_description}</p>
        </div>
        <div class="comments2">
          <ul>
            <li>
              <span class="glyphicon glyphicon-eye-open2" aria-hidden="true">编号：${data[i].ID}</span>
            </li>
            <li>
              <span class="glyphicon glyphicon-time2" aria-hidden="true">${data[i].post_time}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="sale-box">
        <span class="on_sale title_shop">${data[i].product_type}</span>
      </div>
    </div>
    `.trim();
  }
  $('#pro').eq(0).html(pro);
}

function getTags() {
  $.ajax({
    url: "/tags",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      doTags(data);
      console.log(data);
    },
    error: function () {
      alert('服务器出错了！！停电了？');
    }
  });
}

function doTags(data) {
  var coop = '';
  for (var i = 0; i < data.length; i++) {
    coop += `<span class="fenlei">${data[i].product_type}</span>`.trim();
  }
  $('#getTages').eq(0).html(coop);

  //处理点击分类
  clickTags();
}