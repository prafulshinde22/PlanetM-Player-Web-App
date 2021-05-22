$(document).ready(function () {
  // home page js
  var song = $("#song");
  var icon = $("#play");
  var span = $("#span");
  icon.click(function () {
    if (song[0].paused) {
      song[0].play();
      icon.attr("src", "../assets/pause.png");
      span.text("listen to unlimited music by logging in");
    } else {
      song[0].pause();
      icon.attr("src", "../assets/play.png");
    }
  });

  // menu toggle for small screen devices
  var menuicon = $(".menu");
  var menulist = $("#menulist");
  menuicon.click(function () {
    if (!$(menulist).is(":visible")) {
      menuicon.attr("src", "../assets/delete-sign.png");
      menulist.css({ display: "block" });
    } else {
      menuicon.attr("src", "../assets/menuopen.png");
      menulist.css({ display: "none" });
    }
  });

  // signing page js
  // for toggle animation between sign-in and sign-up
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".containerl");

  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  // form validations
  $("#regs").click(function () {
    var uname = $("#username").val();
    if (uname === "" || uname.length < 5 || uname.length > 40) {
      $(".uerr").html("*Username:Invalid(Req_min.5char)");
      return false;
    } else {
      $(".uerr").html("");
    }

    var pwd = $("#password").val();
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    var op = pattern.test(pwd);
    console.log(op);
    if (!pattern.test(pwd)) {
      $(".perr").html("*Password:Invalid");
      return false;
    } else {
      $(".eerr").html("");
    }
  });

  // function to login user
  $("#form1").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/user?email=" + $("#login-email").val(),
      dataType: "json",
      async: true,
      success: function (data) {
        if (data[0] !== undefined) {
          const decryptedPasswordFromDb = CryptoJS.AES.decrypt(
            data[0].password.toString(),
            "/"
          );
          const plaintext = decryptedPasswordFromDb.toString(CryptoJS.enc.Utf8);
          if (plaintext === $("#login-password").val()) {
            alert("✅ Login Successful");
            localStorage.user_id = data[0].id;
            localStorage.user_name = data[0].username;
            window.location.href = "/html/player/player.html";
          } else {
            alert("😑 You entered wrong password. Please try again!!");
            window.location.href = "/html/home/login.html";
          }
        } else {
          alert("😑 Not an user. Please register and then login!!");
          container.classList.add("sign-up-mode");
        }
      },
      error: function () {
        alert("❌ Internel server error");
      },
    });
  });

  // function to register new user
  $("#form2").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/user?email=" + $("#register-email").val(),
      dataType: "json",
      async: true,
      success: function (data) {
        if (data[0] == undefined) {
          const encryptedPassword = CryptoJS.AES.encrypt(
            $("#register-password").val(),
            "/"
          );
          $.ajax({
            type: "POST",
            url: "http://localhost:3000/user",
            data: {
              username: $("#register-username").val(),
              email: $("#register-email").val(),
              password: encryptedPassword.toString(),
              phone: "",
              dob: "",
              gender: "",
            },
            dataType: "json",
            async: true,
            success: function () {
              alert("✅ Successfully registered");
              container.classList.remove("sign-up-mode");
              container.classList.add("sign-in-mode");
            },
            error: function () {
              alert("❌ Registration Failed");
            },
          });
        } else {
          alert(
            "😑 Email id allready taken. Please login or register with other email id!!"
          );
          container.classList.remove("sign-up-mode");
          container.classList.add("sign-in-mode");
        }
      },
      error: function () {
        alert("❌ Internel server error");
      },
    });
  });
});
