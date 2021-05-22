const QUEUE = 'queue'
const PLAYER = new Audio()
let CURRENT_SONG = null

const DEFAULT_SONG = {
    album: "Album",
    albumId: 0,
    duration: "00:00",
    id: 0,
    image: "data/songs/example-song-name.png",
    language: "Marathi",
    name: "Song Name",
    path: "./data/songs/example-song-name.mp3",
    singer: "Artist",
    singerId: 0
}

if (localStorage.getItem('shuffle_state') === null) {
    localStorage.setItem('shuffle_state', 0)
}
if (localStorage.getItem(QUEUE) === null) {
    localStorage.setItem(QUEUE, JSON.stringify([]))
}

let SHUFFLE = parseInt(localStorage.getItem('shuffle_state'))
let menuPresent = false;
let progressHolder = $('#song-total')

console.log(SHUFFLE);
$(document).ready(function () {
    populateQueue()

    if (SHUFFLE === 1) {
        $('.shuffle-songs').addClass('shuffle')
    } else {
        $('.shuffle-songs').removeClass('shuffle')
    }

    $.getJSON("http://localhost:3000/music", function (data) {
        let row = "";

        $.each(data, function (idx, song) {
            let replacements = { album: encode(song.album), singer: encode(song.singer), name: encode(song.name) }

            song = { ...song, ...replacements }

            row += `
                <div class="list-item" data-song-data='${JSON.stringify(song)}'>
                    <div class="list-imgbox" onclick="addToPlaySong(true)">
                        <div class="list-img-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                                <path
                                    d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                                    transform="translate(-16 0)" />
                            </svg>
                        </div>
                        <img class="list-img" src="../../${song.image}" alt="${decode(song.name)}">
                    </div>

                    <div class="list-info">
                        <div class="list-primary">
                            <h1 class="list-title text-1-25 text">${decode(song.name)}</h1>
                            <div class="list-album flex">
                                <h4 class="artist text-1 text">${decode(song.singer)}</h4>
                                <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                                <h4 class="album text-1 text">${decode(song.album)}</h4>
                            </div>
                        </div>
                        <div class="list-action">
                            <h2 class="list-duration text-1 text">${song.duration}</h2>
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
        })

        $('.lists').append(row);

        triggerMenu(menuPresent)

        $('#play-all').click(function () {
            let lists = $(this).parents('.listbox').children('.lists').children()
            let rows = ''
            let queueEmpty = false
            let data = false

            if (JSON.parse(localStorage.getItem(QUEUE)).length === 0) {
                queueEmpty = true
            }

            $.each(lists, function (idx, song) {
                song = JSON.parse(song.getAttribute("data-song-data"))
                addToQueue(song)
                console.log(song);
                rows += createQueue(
                    song
                )
            })

            $('.queues').append(rows);

            triggerMenu(menuPresent)

            if (queueEmpty === true) {
                data = JSON.parse($(this).parents('.listbox').children('.lists').children().first().attr("data-song-data"))
            }

            addToPlaySong(false, data)
        })

        $('.list-action').on('click', '.add-queue', function () {
            const song = $(this).parents('.list-item').data("song-data");
            let row = createQueue(song)

            $('.queues').append(row);

            triggerMenu(menuPresent)

            addToQueue(song)
        })

        $('#clear-queue').click(function () {
            $(this).parents('.queuebox')
                .children('.queues')
                .first()
                .empty()

            clearQueue()
            stopSong()
            updatePlayer(DEFAULT_SONG)
        });

        $('.shuffle-songs').click(function () {
            if (SHUFFLE == 0) {
                SHUFFLE = 1
                $(this).addClass('shuffle')
            } else {
                SHUFFLE = 0
                $(this).removeClass('shuffle')
            }

            localStorage.setItem('shuffle_state', SHUFFLE)
        })

        $('#prev-song').click(function (e) {
            if ($(this).hasClass('grayed')) {
                return
            }

            if (SHUFFLE === 0) {
                playPrev()
            } else {
                playRandomSong()
            }
        })

        $('#play-pause').click(function () {
            let song
            if ($('.queues').children('.playing').length === 0) {
                let id = $('.queues').children().first().attr("data-song-id")
                song = getFromQueue(id)
                updatePlayer(song)
                setPlaying($('.queues').children().first())
            } else {
                playOrPause($(this))
            }
        })

        $('#next-song').click(function (e) {
            if ($(this).hasClass('grayed')) {
                return
            }

            if (SHUFFLE === 0) {
                playNext()
            } else {
                playRandomSong()
            }
        })

        $('#repeat-song').click(function () {

        })

    });
console.log($('#song-total'));
    // $('#song-total').mousedown(function () {
    //     document.onmousemove = function (e) {
    //         setPlayProgress(e.pageX);
    //     }

    //     $(this).onmouseup = function (e) {
    //         document.onmouseup = null;
    //         document.onmousemove = null;

    //         PLAYER.play();
    //         setPlayProgress(e.pageX);
    //     }
    // }, true);
});

function triggerMenu(menuPresent) {
    // $('.menu-btn').off(function (e) {})
    $('.menu-btn').click(function (e) {
        e.stopPropagation();

        if (menuPresent === false) {
            let right = $(this).outerWidth();
            let height = $(this).outerHeight();

            var menu = `
            <div class='menu' style='margin-right: ${right}px; height: ${height}px'>
            `

            if ($(this).parents('.lists').length === 1) {
                menu += `
            <button class="add-queue">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                    <path fill-rule="evenodd"
                        d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z">
                    </path>
                </svg>
            </button>
            `
            } else if ($(this).parents('.queues').length === 1) {
                menu += `
                <button class="add-favourite">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill-rule="evenodd" d="M6.736 4C4.657 4 2.5 5.88 2.5 8.514c0 3.107 2.324 5.96 4.861 8.12a29.66 29.66 0 004.566 3.175l.073.041.073-.04c.271-.153.661-.38 1.13-.674.94-.588 2.19-1.441 3.436-2.502 2.537-2.16 4.861-5.013 4.861-8.12C21.5 5.88 19.343 4 17.264 4c-2.106 0-3.801 1.389-4.553 3.643a.75.75 0 01-1.422 0C10.537 5.389 8.841 4 6.736 4zM12 20.703l.343.667a.75.75 0 01-.686 0l.343-.667zM1 8.513C1 5.053 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262a31.146 31.146 0 01-5.233 3.576l-.025.013-.007.003-.002.001-.344-.666-.343.667-.003-.002-.007-.003-.025-.013A29.308 29.308 0 0110 20.408a31.147 31.147 0 01-3.611-2.632C3.8 15.573 1 12.332 1 8.514z">
                        </path>
                        <path class="heart-filled" d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                        </path>
                    </svg>
                </button>
            `;
            }

            menu += `
            <button class="add-playlist" data-toggle="modal" data-target="#addToPlaylist">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                    <path fill-rule="evenodd"
                        d="M5 3.75C5 2.784 5.784 2 6.75 2h10.5c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 01-1.218.586L12 17.21l-5.781 4.625A.75.75 0 015 21.25V3.75zm1.75-.25a.25.25 0 00-.25.25v15.94l5.031-4.026a.75.75 0 01.938 0L17.5 19.69V3.75a.25.25 0 00-.25-.25H6.75z">
                    </path>
                </svg>
            </button>
        </div>
        `

            $(this).parent().append(menu)
            menuPresent = true
        } else {
            $('.menu').remove()
            menuPresent = false
        }

        // let parent = $(this).parent()
        // let totalMenus = parent.children('.menu').length

        $(this).parent().children('.menu').not(':first').remove();
        // if (totalMenus > 1) {
        //     $(this).parent().children("1").remove()
        // }

    });

    $(document).click(function () {
        $('.menu').remove()
        menuPresent = false
    })
}

function populateQueue() {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    let rows = ''

    $.each(queue, function (idx, song) {
        rows += createQueue(song)
    })

    $('.queues').empty();
    $('.queues').append(rows);

    triggerMenu(menuPresent)
}

function addToQueue(song) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        localStorage.setItem(QUEUE, JSON.stringify([song]))
    } else {
        queue.push(song)
        localStorage.setItem(QUEUE, JSON.stringify(queue))
    }
}

function clearQueue() {
    localStorage.setItem(QUEUE, JSON.stringify([]))
}

function encode(string) {
    return string.replace(/"/g, '\\x22').replace(/'/g, '\\x27')
}

function decode(string) {
    return string.replace("\\x22", '"').replace("\\x27", "'")
}

function createQueue(song, isPlaying = false) {
    console.log(song);
    return `
        <div class="list-item ${isPlaying ? 'playing' : ''}" data-song-id="${song.id}">
            <div class="list-imgbox" onclick="addToPlaySong()">
                <div class="list-img-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 24.444">
                        <path
                            d="M37.377,11.157,17.821.157A1.222,1.222,0,0,0,16,1.223v22a1.223,1.223,0,0,0,1.821,1.066l19.556-11a1.223,1.223,0,0,0,0-2.132Z"
                            transform="translate(-16 0)" />
                    </svg>
                    <div class="play-music">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <img class="list-img" src="../../../${song.image}" alt="${decode(song.name)}">
            </div>

            <div class="list-info">
                <div class="list-primary">
                    <h1 class="list-title text-1-25 text">${decode(song.name)}</h1>
                    <div class="list-album flex">
                        <h4 class="artist text-1 text">${decode(song.singer)}</h4>
                        <h4 class="text-1 text">&nbsp;•&nbsp;</h4>
                        <h4 class="album text-1 text">${decode(song.album)}</h4>
                    </div>
                </div>
                <div class="list-action">
                    <button class="remove-queue" onclick="deleteFromQueue(${song.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" width="24" height="24">
                            <path fill-rule="evenodd"
                                d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z">
                            </path>
                            <path
                                d="M4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z">
                            </path>
                            <path
                                d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z">
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
            <div class='play-progress'></div>
        </div>
    `
}

function getFromQueue(id) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    queue = queue.filter(function (song) {
        return song.id === parseInt(id);
    });

    return queue[0]
}

function getQueueIndex(id) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    for (let i = 0; i < queue.length; i++) {
        if (queue[i].id === parseInt(id)) {
            return i
        }
    }
}

function getNextQueueIndex(id) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    id = getQueueIndex(id)

    if (id >= queue.length) {
        return
    }

    if (queue[parseInt(id) + 1]) {
        return queue[parseInt(id) + 1]
    }

    return false
}

function getPrevQueueIndex(id) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    id = getQueueIndex(id)

    if (id < 0) {
        return
    }

    if (queue[parseInt(id) - 1]) {
        return queue[parseInt(id) - 1]
    }

    return false
}

function deleteFromQueue(id) {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    if (CURRENT_SONG && CURRENT_SONG.id === id) {
        let song
        if (getNextQueueIndex(id) !== false) {
            song = getNextQueueIndex(id)
        } else if (getPrevQueueIndex(id) !== false) {
            song = getPrevQueueIndex(id)
        }

        if (song !== undefined) {
            updatePlayer(song)
        } else {
            stopSong()
            updatePlayer(DEFAULT_SONG)
        }

    }

    queue = queue.filter(function (song) {
        return song.id !== parseInt(id);
    });

    localStorage.setItem(QUEUE, JSON.stringify(queue))

    populateQueue()

    let children = $('.queues').children()
    let item

    children.filter(function (idx) {
        if (parseInt(children[idx].getAttribute("data-song-id")) === CURRENT_SONG.id) {
            item = children[idx]
        }
    })

    setPlaying($(item).first())
}

function addToPlaySong(updateQueue = false, addAll = false) {
    let item = $(window.event.target).parents('.list-item')
    let song

    if (addAll) {
        setPlaying($('.queues').children().first())
        updatePlayer(addAll)
        disableButton($('#prev-song'))

        return
    }

    if (updateQueue === false) {
        song = getFromQueue($(item).attr("data-song-id"));

        setPlaying($(item))
        updatePlayer(song)
        console.log('CASE 1');

        return
    } else {
        song = JSON.parse($(item).attr("data-song-data"))

        if (JSON.parse(localStorage.getItem(QUEUE)).length === 0) {
            disableButton($('#prev-song'))
            disableButton($('#next-song'))
        } else {
            enableButton($('#prev-song'))
            enableButton($('#next-song'))
        }

        setPlaying($(item), true)

        if (updateQueue) {
            $('.queues').append(createQueue(song, true))
            addToQueue(song)
        }
        updatePlayer(song)

    }

}

function playSong(path) {
    // PLAYER.src = path

    // PLAYER.addEventListener("loadeddata", function() {
    //     const playPromise = PLAYER.play();

    //     if (playPromise !== null){
    //         playPromise.catch(() => { PLAYER.play(); })
    //     }
    // })

    // const playPromise = PLAYER.play();

    // if (playPromise !== null) {
    //     playPromise.catch(
    //         () => {
    //             PLAYER.src = path
    //             PLAYER.play()
    //         })
    // }


    PLAYER.src = '../../../' + path;
    PLAYER.play()
}

function pauseSong() {
    PLAYER.pause()
}

function playOrPause(button) {
    if (PLAYER.paused) {
        button.html(`
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause"
                class="svg-inline--fa fa-pause fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512">
                <path fill="currentColor"
                    d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z">
                </path>
            </svg>
        `)
        resumeSong()
    } else {
        button.html(`
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play"
                class="svg-inline--fa fa-play fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                viewbox="0 0 448 512">
                <path fill="currentColor"
                    d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z">
                </path>
            </svg>
        `)
        pauseSong()
    }
}

function seekSong(time) {
    PLAYER.currentTime = time
    PLAYER.play()
}

function resumeSong() {
    PLAYER.play()
}

function stopSong() {
    PLAYER.src = ""
}

function setVolume(vol) {
    PLAYER.volume = vol
}

function updatePlayer(song) {
    let prevId = getPrevQueueIndex(song.id);
    let nextId = getNextQueueIndex(song.id);

    CURRENT_SONG = song

    if (prevId === false) {
        disableButton($('#prev-song'))
    } else {
        enableButton($('#prev-song'))
    }

    if (nextId === false) {
        disableButton($('#next-song'))
    } else {
        enableButton($('#next-song'))
    }

    playSong(song.path)

    $('.song-graphic img').attr('src', '../../../' + song.image)
    $('.player .list-title').text(decode(song.name))
    $('.player .artist').text(decode(song.singer))
    $('.player .album').text(decode(song.album))
    $('.player .totalTime').text(song.duration)
    $('.player .currentTime').text(convertSeconds(PLAYER.currentTime))

    // PLAYER.addEventListener('loadstart', function () {
    //     console.log('loadstart');
    // });
    // PLAYER.addEventListener('progress', function () {
    //     console.log('progress');
    // });
    // PLAYER.addEventListener('canplay', function () {
    //     console.log('canplay');
    // });
    // PLAYER.addEventListener('canplaythrough', function () {
    //     console.log('canplaythrough');
    // });
    // PLAYER.addEventListener('waiting', function () {
    //     console.log('waiting');
    // });
    // PLAYER.addEventListener('loadeddata', function () {
    //     if (PLAYER.readyState >= 2) {
    //         PLAYER.play();
    //     }
    //     console.log('loadeddata');
    // });
    // PLAYER.addEventListener('loadedmetadata', function () {
    //     console.log('loadedmetadata');
    // });
}


PLAYER.addEventListener("timeupdate", function () {
    let pct = (PLAYER.currentTime / PLAYER.duration) * 100;

    if (CURRENT_SONG.id === 0) {
        pct = 0
    }

    $('.player .currentTime').text(convertSeconds(PLAYER.currentTime))
    $('#song-completed').css('width', pct + '%')
    $('.playing .play-progress').css('width', pct + '%')
})

PLAYER.addEventListener('ended', function () {
    if (SHUFFLE === false) {
        playNext()
    } else {
        playRandomSong()
        // setPlaying(item)
        console.log();
    }
})

function setPlaying(item, fromLists = false) {
    let playing

    if (fromLists) {
        playing = item.parents('.main-body').children('.queuebox').children('.queues').children('.playing').first()
    } else {
        playing = item.parent().children('.playing').first()
    }

    $('#play-pause').html(
        `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause"
            class="svg-inline--fa fa-pause fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512">
            <path fill="currentColor"
                d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z">
            </path>
        </svg>
        `
    )

    playing.find('.play-progress').css('width', 0)
    playing.removeClass('playing')
    item.addClass('playing')
}

// https://stackoverflow.com/a/25279399
function convertSeconds(seconds) {
    let date = new Date(0);

    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
}

function isDisabled(button) {
    return button.hasClass('grayed')
}

function disableButton(button) {
    button.addClass('grayed')
}

function enableButton(button) {
    button.removeClass('grayed')
}

function playNext() {
    let id = $('.queues').children('.playing').first().attr("data-song-id")
    let song = getNextQueueIndex(id)
    updatePlayer(song)
    setPlaying($('.queues').children('.playing').first().next())
}

function playPrev() {
    let id = $('.queues').children('.playing').first().attr("data-song-id")
    let song = getPrevQueueIndex(id)
    updatePlayer(song)
    setPlaying($('.queues').children('.playing').first().prev())
}

function playRandomSong() {
    let queue = JSON.parse(localStorage.getItem(QUEUE))

    if (queue === null) {
        return
    }

    let random = Math.floor(Math.random() * queue.length)
    let song = queue[random]

    updatePlayer(song)

    let children = $('.queues').children()
    let item

    children.filter(function (idx) {
        if (parseInt(children[idx].getAttribute("data-song-id")) === CURRENT_SONG.id) {
            item = children[idx]
        }
    })

    setPlaying($(item).first())
}

function _finishSong() {
    seekSong(PLAYER.duration - 5)
}

function setPlayProgress(clickX) {
    var perC = Math.max(0, Math.min(1, (clickX - this.findPosX(progressHolder)) / progressHolder.offsetWidth));
    PLAYER.currentTime = perC * video.duration;
    playProgressBar.style.width = perC * (progressHolder.offsetWidth) + "px";
}

function findPosX(progressHolder) {
    var curL = progressHolder.offsetLeft;
    while (progressHolder = progressHolder.offsetParent) {
        curL += progressHolder.offsetLeft;
    }
    return curL;
}
