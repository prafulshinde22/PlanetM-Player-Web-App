$(document).ready(function () {
  // function to check active session
  $(window).bind("load", function () {
    console.log(window.location.href)
    setInterval(function () {
      if (localStorage.user_id !== undefined) {
        window.location.href = "/html/player/player.html";
      } else {
        window.location.href = "/html/home/home.html";
      }
    }, 0);
  });
});

