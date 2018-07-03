(function () {
  //修改navname
  getHeadInfor();

  //修改logo
  getLogo();

  //修改背景大图片
  getBackgroudImage();

  //获取post过去的search
  $('#btnsearch').click(function(e){
    e.preventDefault();
    $.ajax({
      url: "/postsearchdata",
      type: 'POST',
      dataType: 'JSON',
      data:{
        searchdata: $('#search').find('[name="search"]').val()
      },
      success: function (data) {
  
        //如果请求成功
        console.log(data);
        window.location.href = "search.html?search=" + $('#search').find('[name="search"]').val();
      },
      error: function () {
        alert('服务器出错了！');
      }
    });
  })

})()


function getBackgroudImage() {
  $.ajax({
    url: "/getBackgroudImage",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      doBackgroudImage(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function doBackgroudImage(data) {
  $("body").eq(0).css('background-image', "url(./upload/" + data[0].image_url + ")");
  $("body").eq(0).css('background-size', "cover");
}

function getHeadInfor() {
  $.ajax({
    url: "/getnavname",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      changeNavname(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function changeNavname(data) {
  for (var i = 0; i < data.length; i++) {
    $('#changeNav > li > a').eq(i).html(data[i].newNavName);
  }
}

function getLogo() {
  $.ajax({
    url: "/getlogo",
    type: 'GET',
    dataType: 'JSON',
    success: function (data) {

      //如果请求成功
      console.log(data);
      changeLogo(data);
    },
    error: function () {
      alert('服务器出错了！');
    }
  });
}

function changeLogo(data) {
  $('#logo').attr('src', '/upload/' + data[0].image_url);
}