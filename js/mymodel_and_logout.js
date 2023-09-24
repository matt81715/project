var flag_username = false;
var flag_password = false;
var flag_name = false;
var flag_tel = false;
var flag_email = false;
var uid_username;
$(function () {
  // 確認uid是否存在,若存在傳遞至後端 check_uid_api.php確認是否合法
  if (getCookie("uid01") !== "") {
    // uid 存在,傳遞至後端 check_uid_api.php確認是否合法
    $.ajax({
      type: "POST",
      url: api_link + "api/check_uid_api.php",
      dataType: "json",
      data: { uid: getCookie("uid01") },
      success: showdata_check_uid,
      error: function () {
        alert("check_uid-api/check_uid_api.php");
      },
    });
  }
  // 即時監聽username
  $("#username").bind("input propertychange", function () {
    console.log($(this).val.length);
    if ($(this).val().length > 4 && $(this).val().length < 9) {
      // 符合規定

      // // 傳遞帳號至後端api確認是否可以使用
      $.ajax({
        type: "POST",
        url: api_link + "api/member/reg_check_uni_api.php",
        data: { username: $("#username").val() },
        dataType: "json",
        success: showdata_check_uni,
        error: function () {
          alert("確認帳號-reg_check_uni_api.php");
        },
      });
    } else {
      // 不符合規定
      $("#invalid_message").text("此帳號字數不符合規定");
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_username = false;
    }
  });

  // 即時監聽password
  $("#password").bind("input propertychange", function () {
    // console.log($(this).val.length);
    if ($(this).val().length > 7 && $(this).val().length < 11) {
      // 符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_password = true;
    } else {
      // 不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_password = false;
    }
  });

  // 即時監聽name
  $("#name").bind("input propertychange", function () {
    // console.log($(this).val.length);
    if ($(this).val().length > 1) {
      // 符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_name = true;
    } else {
      // 不符合規定
      $("#invalid_message").text("此帳號字數不符合規定");
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_name = false;
    }
  });

  // 即時監聽tel
  $("#tel").bind("input propertychange", function () {
    // console.log($(this).val.length);
    if ($(this).val().length > 8) {
      // 符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_tel = true;
    } else {
      // 不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_tel = false;
    }
  });

  // 即時監聽email
  $("#email").bind("input propertychange", function () {
    // console.log($(this).val.length);
    if ($(this).val().length > 4) {
      // 符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_email = true;
    } else {
      // 不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_email = false;
    }
  });

  // 按鈕監聽reg_btn
  $("#registerModal_btn").click(function () {
    if (flag_username && flag_password) {
      $.ajax({
        type: "POST",
        url: api_link + "api/member/reg_api.php",
        data: {
          username: $("#username").val(),
          password: $("#password").val(),
          gender: $("input[name='gender']:checked").val(),
          email: $("#email").val(),
          name: $("#name").val(),
          tel: $("#tel").val(),
        },
        dataType: "json",
        success: showdata_reg,
        error: function () {
          alert("註冊錯誤-reg_api.php");
        },
      });
    } else {
      //欄位輸入錯誤
      alert("欄位輸入錯誤, 請修正!");
    }
  });
  // 按鈕監聽login_btn
  $("#loginModal_btn").click(function () {
    // 傳遞至 login_api.php 執行登入行為
    $.ajax({
      type: "POST",
      url: api_link + "api/member/login_api.php",
      data: {
        username: $("#login_username").val(),
        password: $("#login_password").val(),
      },
      dataType: "json",
      success: showdata_login,
      error: function () {
        alert("登入相關錯誤-login_api.php");
      },
    });
  });
  // 按鈕監聽logout_btn
  $("#logout_btn").click(function () {
    logout();
  });
});

function showdata_reg(data) {
  console.log(data);
  if (data.state) {
    alert(data.message);
    $("#registerModal").modal("hide");
    $("#loginModal").modal("show");
  } else {
    alert(data.message);
  }
}

function showdata_check_uni(data) {
  console.log(data);
  if (data.state) {
    // 此帳號不存在，可以使用
    $("#valid_message").text("此帳號不存在，可以使用");
    $("#username").removeClass("is-invalid");
    $("#username").addClass("is-valid");
    flag_username = true;
  } else {
    // 此帳號存在，不可以使用
    $("#invalid_message").text("此帳號存在，不可以使用");
    $("#username").removeClass("is-valid");
    $("#username").addClass("is-invalid");
    flag_username = false;
  }
}

function showdata_login(data) {
  if (data.state) {
    uid_username = data.data[0].Username;
    if (data.data[0].UserState == "true") {
      // 帳號被啟用
      alert(data.message);
      // 將uid存入cookie
      setCookie("uid01", data.data[0].Uid01, 7);
      // 關閉加入會員圖示
      $("#addmember").addClass("d-none");
      // loginModal 隱藏
      $("#loginModal").modal("hide");
      // 登入 login_btn 按鈕隱藏
      $("#login_btn").addClass("d-none");
      // 註冊 register_btn 按鈕隱藏
      $("#register_btn").addClass("d-none");
      // 修改會員管理按鈕
      $("#revise_btn").removeClass("d-none");
      // 訂單查詢按鈕
      $("#order_btn").removeClass("d-none");
      //nvbar連結顯示
      $("#shopcar").removeClass("d-none");
      $("#orderlist").removeClass("d-none");
      //判斷管理員
      if (data.data[0].Username == "admin") {
        $("#admin").removeClass("d-none");
        $("#admin").text("後台產品管理");
        $("#admin").attr("href", "Backstage_list.html");
      }

      // 顯示歡迎詞
      $("#login_message").removeClass("d-none");
      $("#login_message").text("歡迎 :" + data.data[0].Name);
      // 登出按鈕
      $("#logout_btn").removeClass("d-none");
    } else {
      // 帳號被停權
      alert("此帳號被停權,請聯絡管理員");
    }
  } else {
    alert(data.message);
  }
}

function showdata_check_uid(data) {
  console.log(data);
  uid_username = data.data[0].Username;
  if (data.state) {
    // 驗證成功
    // 登入 login_btn 按鈕隱藏
    $("#login_btn").addClass("d-none");
    // 註冊 register_btn 按鈕隱藏
    $("#register_btn").addClass("d-none");
    // 關閉加入會員圖示
    $("#addmember").addClass("d-none");
    // 顯示後台管理按鈕(可連結至control panel)
    $("#revise_btn").removeClass("d-none");
    // 訂單查詢按鈕
    $("#order_btn").removeClass("d-none");
    //nvbar連結顯示
    $("#shopcar").removeClass("d-none");
    $("#orderlist").removeClass("d-none");
    //判斷管理員
    if (data.data[0].Username == "admin") {
      $("#admin").removeClass("d-none");
      $("#admin").text("後台產品管理");
      $("#admin").attr("href", "Backstage_list.html");
    }
    // 顯示歡迎詞
    $("#login_message").removeClass("d-none");
    $("#login_message").text("歡迎" + data.data[0].Name);
    //給購物車帶入使用者

    // 登出按鈕
    $("#logout_btn").removeClass("d-none");
  } else {
    // 驗證失敗,需重新登入
    $("#loginModal").modal("show");
  }
}

// 登出帳號
// 刪除uid並重整畫面
function logout() {
  setCookie("uid01", "", 7);
  location.href = "project.html";
}

// w3shool
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//列表選擇網址fun
function doClick(data) {
  switch (data) {
    case "all":
      console.log("all");
      setCookie("list", "all", 7);
      break;
    default:
      console.log(data);
      setCookie("list", data, 7);
      break;
  }
}
