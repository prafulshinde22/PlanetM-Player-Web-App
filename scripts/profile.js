$(document).ready(function () {
    var song = $("#song");
    var icon = $("#play");
    var span = $("#span");
    icon.click(function() {
        if(song[0].paused) {
            song[0].play();
            icon.attr("src","../assets/pause.png");
            span.text("listen to unlimited music by logging in");
        }
        else {
            song[0].pause();
            icon.attr("src","../assets/play.png");
        }
    })

    var menuicon = $(".menu");
    var menulist = $("#menulist");
    menuicon.click(function(){
        if(!$(menulist).is(':visible')) {
            menuicon.attr("src","../assets/delete-sign.png");
            menulist.css({"display":"block"});
        }
        else {
            menuicon.attr("src","../assets/menuopen.png");
            menulist.css({"display":"none"});
        }
    })

const u_id = localStorage.user_id;
  // below ajax call is used to fetch profile data on load of profile and edit profile page
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/user/" + u_id,
    dataType: "json",
    async: true,
    success: function (data) {
      if (data !== undefined) {
        const decryptedPasswordFromDb = CryptoJS.AES.decrypt(
          data.password.toString(),
          "/"
        );
        const plaintext = decryptedPasswordFromDb.toString(CryptoJS.enc.Utf8);
        profile = data;
        $("#username").val(data.username);
        $("#email").val(data.email);
        $("#pass").val(plaintext);
        $("#phone").val(data.phone);
        $("#dob").val(data.dob);
        $("#gender").val(data.gender);
      } else {
        alert("😑 Sorry cant find data at the moment. Please try again !!");
      }
    },
  });

  // function to update profile data on click of submit button
  $("#profile-form").submit(function (event) {
    event.preventDefault();
    const encryptedPassword = CryptoJS.AES.encrypt(
      $("#pass").val(),
      "/"
    );
    $.ajax({
      type: "PUT",
      url: "http://localhost:3000/user/" + u_id,
      dataType: "json",
      async: true,
      data: {
        username: $("#username").val(),
        email: $("#email").val(),
        password: encryptedPassword.toString(),
        phone: $("#phone").val(),
        dob: $("#dob").val(),
        gender: $("input[name='gender']:checked").val(),
      },
      success: function (data) {
        if (data !== undefined) {
          window.location.href = "/html/profile/profile.html";
          alert("✅ Profile Updated!!");
        } else {
          alert(
            "😑 Sorry can't update data at the moment. Please try again !!"
          );
        }
      },
      error: function () {
        alert("❌ Failed to update profile");
      },
    });
  });
});

  // function for logout
$("#logout").click(function () {
    swal(
      {
        title: "Logout",
        text: "Are you sure you want to logout?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false,
      },
      function (isConfirm) {
        if (isConfirm) {
          window.location = "/html/home/home.html";
          localStorage.clear("user_id");
          localStorage.clear("user_name");
        } else {
          swal("Back to player!!");
        }
      }
    );
  });
  