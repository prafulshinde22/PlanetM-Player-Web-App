var songlist = "";
var singerdata = "";
var allsongs = "";
var albumslist = "";
var searchlist = "";
$(document).ready(function () {
  $("#user-name").val(localStorage.user_name);
  // below ajax get call is used to load songs list on load
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/music",
    dataType: "json",
    async: true,
    success: function (data) {
      if (data !== undefined) {
        allsongs = data;
        songlist = `
                <div class="flex items-center boxheader inline">
                    <h3>List</h3>
                    <div class="list-btns">
                        <button class="button" id="play-all">Play All</button>
                    </div>
                </div>
                <div class="lists">
                `;
        // Appending language list to html dom
        $.each(data, function (i, songdata) {
          const image = songdata.image;
          songlist += `
          <div class="list-item" data-song-data='${JSON.stringify(songdata)}'>
          <div class="list-imgbox" onclick="addToPlaySong(true)">
              <div class="list-img-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                      <path
                          d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                          transform="translate(-16 0)" />
                  </svg>
              </div>
              <img class="list-img" src="../../../${image}" alt="Example song name">
          </div>

          <div class="list-info">
              <div class="list-primary">
                  <h1 class="list-title text-1-25 text">${songdata.name}</h1>
                  <div class="list-album flex">
                      <h4 class="artist text-1 text">${songdata.singer}</h4>
                      <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                      <h4 class="album text-1 text">${songdata.album}</h4>
                  </div>
              </div>
              <div class="list-action">
                  <h2 class="list-duration text-1 text">${
                    songdata.duration
                  }</h2>
                  <button class="add-favourite" id="${
                    songdata.id
                  }" >
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                          <path fill-rule="evenodd"
                              d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                          </path>
                          <path class="heart-filled"
                              d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                          </path>
                      </svg>
                  </button>
                  
                  <button class="menu-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                          <path fill-rule="evenodd"
                              d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm6 2a2 2 0 100-4 2 2 0 000 4z">
                          </path>
                      </svg>
                  </button>
              </div>
          </div>
      </div>
       `;
        });
        songlist += `</div>`;
        searchlist = songlist;
        $(".listbox").append(songlist);
      }
    },
    error: function () {
      alert("❌ Failed to load songs list");
    },
  });
});

// function for adding song to favorite list
$('.add-favourite').click(function () {
  console.log("in add fav");
  //onclick="addFavourite(this.id)"
  // $(".add-favourite").click(function () {
  //   let filled = $(this).find(".heart-filled");
  //   if (filled.hasClass("pulsing")) {
  //     filled.css("fill", "");
  //   } else {
  //     filled.css("fill", "red");
  //   }
  //   filled.toggleClass("pulsing");
  // });
  const u_id = localStorage.user_id;
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/favourite?uid=" + u_id+"&songid="+$(this.id),
    dataType: "json",
    async: true,
    success: function (songdata) {
      if (songdata == undefined) {
        $.ajax({
          type: "POST",
          url: "http://localhost:3000/favourite",
          data: {
            uid: u_id,
            songid: songid,
          },
          dataType: "json",
          async: true,
          success: function () {
            alert("✅ Added to favourite");
          },
          error: function () {
            alert("❌ Failed to add to favourite");
          },
        });
      } else {
        alert(
          "✅ Song allready in your favourite list!!"
        );
      }
    }
  });
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/favourite",
    data: {
      uid: u_id,
      songid: songid,
    },
    dataType: "json",
    async: true,
    success: function () {
      alert("✅ Added to favourite");
    },
    error: function () {
      alert("❌ Failed to add");
    },
  });
});

// function to get favourite list of user
$("#get-favourite").click(function () {
  $(".listbox").empty();
  const u_id = localStorage.user_id;
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/favourite?uid=" + u_id,
    dataType: "json",
    async: true,
    success: function (data) {
      // Checking if user favourite list is present
      if (data !== undefined) {
        let favouriteSongs = `
        <div class="flex items-center boxheader inline">
                    <h3>Favourite</h3>
                    <div class="list-btns">
                        <button class="button" id="play-all">Play All</button>
                    </div>
                </div>
    <div class="lists">
          `;
        // Fetching songs from music list by favourite songs id
        $.each(data, function (i, song) {
          $.ajax({
            type: "GET",
            url: "http://localhost:3000/music/" + song.songid,
            dataType: "json",
            async: true,
            success: function (songdata) {
              if (songdata !== undefined) {
                const image = songdata.image;
                favouriteSongs = `
                <div class="list-item" data-song-data='${JSON.stringify(
                  songdata
                )}'>
                <div class="list-imgbox" onclick="addToPlaySong(true)">
                    <div class="list-img-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                            <path
                                d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                                transform="translate(-16 0)" />
                        </svg>
                    </div>
                    <img class="list-img" src="../../${image}" alt="Example song name">
                </div>
      
                <div class="list-info">
                    <div class="list-primary">
                        <h1 class="list-title text-1-25 text">${
                          songdata.name
                        }</h1>
                        <div class="list-album flex">
                            <h4 class="artist text-1 text">${
                              songdata.singer
                            }</h4>
                            <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                            <h4 class="album text-1 text">${songdata.album}</h4>
                        </div>
                    </div>
                    <div class="list-action">
                        <h2 class="list-duration text-1 text">${
                          songdata.duration
                        }</h2>
                        <button class="add-favourite" id="${
                          songdata.id
                        }" onclick="addFavourite(this.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                <path fill-rule="evenodd"
                                    d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                                </path>
                                <path class="heart-filled"
                                    d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                                </path>
                            </svg>
                        </button>
                        
                        <button class="menu-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                <path fill-rule="evenodd"
                                    d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm6 2a2 2 0 100-4 2 2 0 000 4z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
                      `;
                favouriteSongs += `</div>`;
                $(".lists").append(favouriteSongs);
              } else {
                alert(
                  "😑 Hey sorry can't get the favourite list now. Try again!!"
                );
              }
            },
            error: function () {
              alert("😑 Hey you don't have any favourite song!!");
            },
          });
        });
        $(".listbox").append(favouriteSongs);
      } else {
        alert("😑 Hey you don't have any favourite song!!");
      }
    },
    error: function () {
      alert("❌ Failed to fetch favourite list");
    },
  });
});

// function to fetch Song list language wise
function fetchByLanguage(language) {
  $(".listbox").empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/music?language=" + language,
    dataType: "json",
    async: true,
    success: function (data) {
      // Checking if language list is present
      if (data !== undefined) {
        songlist = `
                <div class="flex items-center boxheader inline">
                    <h3>${language}</h3>
                    <div class="list-btns">
                        <button class="button" id="play-all">Play All</button>
                    </div>
                </div>
                <div class="lists">
                `;
        // Appending language list to html dom
        $.each(data, function (i, songdata) {
          const image = songdata.image;
          songlist += `
          <div class="list-item" data-song-data='${JSON.stringify(songdata)}'>
          <div class="list-imgbox" onclick="addToPlaySong(true)">
              <div class="list-img-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                      <path
                          d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                          transform="translate(-16 0)" />
                  </svg>
              </div>
              <img class="list-img" src="../../${image}" alt="Example song name">
          </div>

          <div class="list-info">
              <div class="list-primary">
                  <h1 class="list-title text-1-25 text">${songdata.name}</h1>
                  <div class="list-album flex">
                      <h4 class="artist text-1 text">${songdata.singer}</h4>
                      <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                      <h4 class="album text-1 text">${songdata.album}</h4>
                  </div>
              </div>
              <div class="list-action">
                  <h2 class="list-duration text-1 text">${
                    songdata.duration
                  }</h2>
                  <button class="add-favourite" id="${
                    songdata.id
                  }" >
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                          <path fill-rule="evenodd"
                              d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                          </path>
                          <path class="heart-filled"
                              d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                          </path>
                      </svg>
                  </button>
                  
                  <button class="menu-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                          <path fill-rule="evenodd"
                              d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm6 2a2 2 0 100-4 2 2 0 000 4z">
                          </path>
                      </svg>
                  </button>
              </div>
          </div>
      </div>
       `;
        });
        songlist += `</div>`;
        $(".listbox").append(songlist);
      } else {
        alert("😑 Hey sorry can't get the language wise list now. Try again!!");
      }
    },
    error: function () {
      alert("😑 Hey you don't have any song with this language!!");
    },
  });
}

// function to fetch all artist in database
$("#get-artists").click(function () {
  $(".listbox").empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/singer",
    dataType: "json",
    async: true,
    success: function (data) {
      // Checking if artists list is present
      if (data !== undefined) {
        singerdata = data;
        songlist = `
          <div class="flex items-center boxheader inline">
          <h3>Artists</h3>
      </div>
      <div class="lists is-half">
          `;
        // Appending artists list to html dom
        $.each(data, function (i, singer) {
          const image = singer.image;
          songlist += `
          <div  class="list-item half" >
          <div id="${singer.id}" onclick="fetchArtistList(this.id)" class="list-imgbox is-artist">
              <div class="list-img-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                      <path
                          d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                          transform="translate(-16 0)" />
                  </svg>
              </div>
              <img class="list-img" src="../../${image}" alt="Example song name">
          </div>

          <div class="list-info">
              <div class="list-primary">
                  <h1 class="list-title text-1-25 text">${singer.name}</h1>
              </div>
              <div class="list-action">
                  <button id="${singer.id}" onclick="addFavourite(this.id) class="add-favourite">
                      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                          <path fill-rule="evenodd"
                              d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                          </path>
                          <path class="heart-filled"
                              d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                          </path>
                      </svg>
                  </button>
              </div>
          </div>
      </div>
          `;
        });
        songlist += `</div>`;
        $(".listbox").append(songlist);
      } else {
        alert("😑 Hey sorry can't get the artist list now. Try again!!");
      }
    },
    error: function () {
      alert("😑 Hey sorry can't get the artist list now. Try again!!");
    },
  });
});

// function to fetch specific artist list
function fetchArtistList(singerid) {
  $(".listbox").empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/music?singer-id=" + singerid,
    dataType: "json",
    async: true,
    success: function (data) {
      // Checking if artist songs are present list is present
      if (data !== undefined) {
        songlist = `
        <div class="flex items-center boxheader">
        <div class="artistbox">
            <div class="artist-cover is-artist">
                <img class="artist-img" src="../../${
                  singerdata[singerid - 1].image
                }" alt="Artist">
            </div>
            <div class="artist-info">
                <div class="artist-name">
                    <h3>${singerdata[singerid - 1].name}</h3>
                    <p>${data.length} songs</p>
                </div>
                <div class="list-btns">
                    <div class="list-action">
                        <button class="add-favourite">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24"
                                height="24">
                                <path fill-rule="evenodd"
                                    d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                                </path>
                                <path class="heart-filled"
                                    d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <button class="button" id="play-all">Play All</button>
                </div>
            </div>
        </div>
    </div>
    <div class="lists">
          `;
        // Appending spesific artist song list to html dom
        $.each(data, function (i, song) {
          const image = song.image;
          songlist += `
          <div class="list-item" data-song-data='${JSON.stringify(song)}'>
                        <div class="list-imgbox" onclick="addToPlaySong(true)">
                            <div class="list-img-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                                    <path
                                        d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                                        transform="translate(-16 0)" />
                                </svg>
                            </div>
                            <img class="list-img" src="../../${image}" alt="Example song name">
                        </div>

                        <div class="list-info">
                            <div class="list-primary">
                                <h1 class="list-title text-1-25 text">${
                                  song.name
                                }</h1>
                                <div class="list-album flex">
                                    <h4 class="artist text-1 text">${
                                      song.singer
                                    }</h4>
                                    <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                                    <h4 class="album text-1 text">${
                                      song.album
                                    }</h4>
                                </div>
                            </div>
                            <div class="list-action">
                                <h2 class="list-duration text-1 text">${
                                  song.duration
                                }</h2>
                                <button id="${
                                  song.id
                                }" onclick="addFavourite(this.id) class="add-favourite">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                                        </path>
                                        <path class="heart-filled"
                                            d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                                        </path>
                                    </svg>
                                </button>
                                <button class="add-queue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z">
                                        </path>
                                    </svg>
                                </button>
                                <button class="add-playlist" data-toggle="modal" data-target="#addToPlaylist">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M5 3.75C5 2.784 5.784 2 6.75 2h10.5c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 01-1.218.586L12 17.21l-5.781 4.625A.75.75 0 015 21.25V3.75zm1.75-.25a.25.25 0 00-.25.25v15.94l5.031-4.026a.75.75 0 01.938 0L17.5 19.69V3.75a.25.25 0 00-.25-.25H6.75z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
          `;
        });
        songlist += `</div>`;
        $(".listbox").append(songlist);
      } else {
        alert("😑 Hey sorry can't get the artist song list now. Try again!!");
      }
    },
    error: function () {
      alert("😑 Hey sorry can't get the artist song list now. Try again!!");
    },
  });
}

// function to fetch all albums in database
$("#get-albums").click(function () {
  $(".listbox").empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/album",
    dataType: "json",
    async: true,
    success: function (data) {
      // Checking if artists list is present
      if (data !== undefined) {
        albumslist = data;
        songlist = `
        <div class="flex items-center boxheader inline">
        <h3>Albums</h3>
    </div>
    <div class="lists is-half">
          `;
        // Appending artists list to html dom
        $.each(data, function (i, albums) {
          const image = albums.image;
          songlist += `
          <div class="list-item half">
                        <div id="${albums.id}" onclick="fetchAlbumList(this.id)" class="list-imgbox">
                            <div class="list-img-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                                    <path
                                        d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                                        transform="translate(-16 0)" />
                                </svg>
                            </div>
                            <img class="list-img" src="../../${image}" alt="Example song name">
                        </div>

                        <div class="list-info">
                            <div class="list-primary">
                                <h1 class="list-title text-1-25 text">${albums.name}</h1>
                            </div>
                            <div class="list-action">
                                <button class="add-favourite">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                                        </path>
                                        <path class="heart-filled"
                                            d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
          `;
        });
        songlist += `</div>`;
        $(".listbox").append(songlist);
      } else {
        alert("😑 Hey sorry can't get the albums list now. Try again!!");
      }
    },
    error: function () {
      alert("😑 Hey sorry can't get the albums list now. Try again!!");
    },
  });
});

// function to fetch specific album list
function fetchAlbumList(albumid) {
  $(".listbox").empty();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/music?album-id=" + albumid,
    dataType: "json",
    async: true,
    success: function (data) {
      console.log(data);
      // Checking if artist songs are present list is present
      if (data !== undefined) {
        songlist = `
        <div class="flex items-center boxheader">
        <div class="artistbox">
            <div class="artist-cover is-artist">
                <img class="artist-img" src="../../${
                  albumslist[albumid - 1].image
                }" alt="Artist">
            </div>
            <div class="artist-info">
                <div class="artist-name">
                    <h3>${data[0].album}</h3>
                    <p>${data.length} songs</p>
                </div>
                <div class="list-btns">
                    <button class="button" id="play-all">Play All</button>
                </div>
            </div>
        </div>
    </div>
    <div class="lists">
          `;
        // Appending spesific artist song list to html dom
        $.each(data, function (i, song) {
          const image = song.image;
          songlist += `
          <div class="list-item" data-song-data='${JSON.stringify(song)}'>
                        <div class="list-imgbox" onclick="addToPlaySong(true)">
                            <div class="list-img-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                                    <path
                                        d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                                        transform="translate(-16 0)" />
                                </svg>
                            </div>
                            <img class="list-img" src="../../${image}" alt="Example song name">
                        </div>

                        <div class="list-info">
                            <div class="list-primary">
                                <h1 class="list-title text-1-25 text">${
                                  song.name
                                }</h1>
                                <div class="list-album flex">
                                    <h4 class="artist text-1 text">${
                                      song.singer
                                    }</h4>
                                    <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                                    <h4 class="album text-1 text">${
                                      song.album
                                    }</h4>
                                </div>
                            </div>
                            <div class="list-action">
                                <h2 class="list-duration text-1 text">${
                                  song.duration
                                }</h2>
                                <button id="${
                                  song.id
                                }" onclick="addFavourite(this.id) class="add-favourite">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                                        </path>
                                        <path class="heart-filled"
                                            d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                                        </path>
                                    </svg>
                                </button>
                                <button class="add-queue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z">
                                        </path>
                                    </svg>
                                </button>
                                <button class="add-playlist" data-toggle="modal" data-target="#addToPlaylist">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd"
                                            d="M5 3.75C5 2.784 5.784 2 6.75 2h10.5c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 01-1.218.586L12 17.21l-5.781 4.625A.75.75 0 015 21.25V3.75zm1.75-.25a.25.25 0 00-.25.25v15.94l5.031-4.026a.75.75 0 01.938 0L17.5 19.69V3.75a.25.25 0 00-.25-.25H6.75z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
          `;
        });
        songlist += `</div>`;
        $(".listbox").append(songlist);
      } else {
        alert("😑 Hey sorry can't get the artist song list now. Try again!!");
      }
    },
    error: function () {
      alert("😑 Hey sorry can't get the artist song list now. Try again!!");
    },
  });
}

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
        window.location = "../home/home.html";
        localStorage.clear("user_id");
        localStorage.clear("user_name");
      } else {
        swal("Back to player!!");
      }
    }
  );
});

// function to search song
$("#searchbox").on("keyup", function () {
  let key = $(this).val().toLowerCase();
  $(".list-item").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1);
  });
});
