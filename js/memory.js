/** 
 * Main handler class for Memory Game.
 * Copyright (c) 2017, Mateja Kardasic <mateja.kardasic@gmail.com>
 * MIT Licensed
 */
"use strict";

// create namespace
var MemApp = MemApp || {};

MemApp.Constructor = {
    Image: function(src, id) {
        this.src = src;
        this.id = id;
    },
    SourceImage: function(src, count) {
        this.src = src;
        this.count = count;
    }
};

MemApp.Setup = {
    imgUrl: {
        PLACEHOLDER_URL: "img/000-placeholder.png",
        CONGRATS_URL: "img/congrats.jpg"
    },
    idList: [
        "#tile1",
        "#tile2",
        "#tile3",
        "#tile4",
        "#tile5",
        "#tile6",
        "#tile7",
        "#tile8",
        "#tile9",
        "#tile10",
        "#tile11",
        "#tile12",
        "#tile13",
        "#tile14",
        "#tile15",
        "#tile16",
        "#tile17",
        "#tile18",
        "#tile19",
        "#tile20"
    ],
    sourceList: [
        new MemApp.Constructor.SourceImage("img/007-rooster.jpg", 0),
        new MemApp.Constructor.SourceImage("img/026-sheep.jpg", 0),
        new MemApp.Constructor.SourceImage("img/043-seed.jpg", 0),
        new MemApp.Constructor.SourceImage("img/047-pig.jpg", 0),
        new MemApp.Constructor.SourceImage("img/048-tractor.jpg", 0),
        new MemApp.Constructor.SourceImage("img/045-wheat.jpg", 0),
        new MemApp.Constructor.SourceImage("img/017-flower.jpg", 0),
        new MemApp.Constructor.SourceImage("img/044-wheelbarrow.jpg", 0),
        new MemApp.Constructor.SourceImage("img/023-radish.jpg", 0),
        new MemApp.Constructor.SourceImage("img/029-pear.jpg", 0)
    ],
    audioFile: {
        MUSIC: new Audio("music/Countryboy-BenSound.mp3"),
        SOUND_BLEAT: new Audio("music/Bleat-SoundBible.mp3"),
        SOUND_SNORT: new Audio("music/Snorting-SoundBible.mp3"),
        SOUND_ROOSTER: new Audio("music/Rooster-SoundBible.mp3")
    },
    setAudioVolume: function(){
    	MemApp.Setup.audioFile.MUSIC.volume = 0.03,
    	MemApp.Setup.audioFile.SOUND_BLEAT.volume = 0.4,
    	MemApp.Setup.audioFile.SOUND_SNORT.volume = 0.4,
    	MemApp.Setup.audioFile.SOUND_ROOSTER.volume = 0.4
    }
};

MemApp.TileCreation = {
    createAndSetupTile: function() {
        // variable to store number of tiles based on ID list
        var tileSize = MemApp.Util.sizeObj(MemApp.Setup.idList);

        // for the number of tiles (from tileSize) create placeholder images
        for (var i = 0; i < tileSize; i++) {
            // get tile ID from ID List
            var tileId = MemApp.Setup.idList[i];

            // get random image from array 'idList'
            var randomImgIndex = MemApp.TileCreation.getRandomImageIndex();
            // increase count of that image object (used to create exactly two image tiles)
            MemApp.Setup.sourceList[randomImgIndex].count++;
            var imgCount = MemApp.Setup.sourceList[randomImgIndex].count;

            while (imgCount > 2) {
                // find image that hasn't already been used
                randomImgIndex = MemApp.TileCreation.getRandomImageIndex();
                MemApp.Setup.sourceList[randomImgIndex].count++;
                imgCount = MemApp.Setup.sourceList[randomImgIndex].count;
            }
            MemApp.TileCreation.createImage(tileId, MemApp.Setup.sourceList[randomImgIndex].src);
        }
        MemApp.Setup.setAudioVolume();
		if (MemApp.MemoryData.isSoundOn) {
			MemApp.MusicHandler.getThisPartyStarted();
		}
    },
    getRandomImageIndex: function() {
        return Math.floor(Math.random() * MemApp.Setup.sourceList.length);
    },
    createImage: function(tileId, randomImage) {
        var domImg = document.createElement("img");

        domImg.setAttribute("src", MemApp.Setup.imgUrl.PLACEHOLDER_URL);
        domImg.setAttribute("class", "placeholder");
        domImg.setAttribute("id", tileId);
        domImg.setAttribute("imgpath", randomImage);

        // append element and add placeholder css class to each element
        document.getElementById("tileRow").appendChild(domImg);
    }
};

MemApp.MemoryData = {
    // Object that holds data considering opened tiles and holds a track of score. 
    img1: "",
    img2: "",
    score: 0,
    matchCounter: 0,
    isSoundOn: true,

    areTilesMatched: function(imageObj) {
        if (this.img1 === "") {
            // set new value to img1
            this.img1 = imageObj;

        } else if (this.img2 === "") {
            // set new value to img2
            this.img2 = imageObj;

            if (this.img1.src === this.img2.src) {
                if (MemApp.MemoryData.isSoundOn) {
                    MemApp.Setup.audioFile.SOUND_BLEAT.play();
                }

                // add to score
                this.score += 10;

                // increase counter
                this.matchCounter++;

                // empty memory 
                this.img1 = "";
                this.img2 = "";

                return true;
            }
            if (MemApp.MemoryData.isSoundOn) {
                MemApp.Setup.audioFile.SOUND_SNORT.play();
            }

            // subtract from score
            this.score -= 4;

            MemApp.Timer.isTimerStarted = true;
            this.closeTiles(this.img1, this.img2);

            // empty memory
            this.img1 = "";
            this.img2 = "";
        }
        return false;
    },

    closeTiles: function(img1, img2) {
        setTimeout(function() {
            // hide tiles
            $(document.getElementById(img1.id)).attr("src", MemApp.Setup.imgUrl.PLACEHOLDER_URL);
            $(document.getElementById(img2.id)).attr("src", MemApp.Setup.imgUrl.PLACEHOLDER_URL);
            MemApp.Timer.isTimerStarted = false;
        }, 1100);
    }
};


MemApp.Timer = {
    isTimerStarted: false,
    isFirstClick: true,
    seconds: 0,
    minutes: 0,
    hours: 0,
    t: "",
    timer: function() {
        MemApp.Timer.t = setTimeout(MemApp.Timer.startCountingGameElapsedTime, 1000);
    },
    startCountingGameElapsedTime: function() {
        MemApp.Timer.seconds++;
        if (MemApp.Timer.seconds === 30) {
            // every 30 seconds, subtract 4 points
            MemApp.MemoryData.score -= 4;
            // show score
            $("#playerScore").text(MemApp.MemoryData.score);
        }

        if (MemApp.Timer.seconds >= 60) {
            MemApp.Timer.seconds = 0;
            MemApp.Timer.minutes++;

            // show score
            $("#playerScore").text(MemApp.MemoryData.score);

            if (MemApp.Timer.minutes >= 60) {
                MemApp.Timer.minutes = 0;
                MemApp.Timer.hours++;
            }
        }
        var playerTime = document.getElementById("playerTime");
        playerTime = (MemApp.Timer.hours ? (MemApp.Timer.hours > 9 ? MemApp.Timer.hours : "0" + MemApp.Timer.hours) : "00") + ":" + (MemApp.Timer.minutes ? (MemApp.Timer.minutes > 9 ? MemApp.Timer.minutes : "0" + MemApp.Timer.minutes) : "00") + ":" + (MemApp.Timer.seconds > 9 ? MemApp.Timer.seconds : "0" + MemApp.Timer.seconds);
        document.getElementById("playerTime").innerHTML = playerTime;
        MemApp.Timer.timer();
    }
};

MemApp.UserInteraction = {
    talkToUser: function() {
        bootbox.prompt({
            title: "Welcome to Memory Game! <br><br> What's your name?",
            inputType: 'text',
            size: 'small',
            maxlength: "10",
            callback: function(playerName) {
                if (playerName === null || playerName === "") {
                    // :)
                    playerName = "Loser";
                }
                $("#playerName").text(playerName);
                MemApp.UserInteraction.explainRules();
            }
        });
    },
    explainRules: function() {
        bootbox.alert({
            message: "<h3>Game Rules</h3><br>" +
                "<table class='tbl'>" +
                "<tr>" +
                "<th class='tblHeader'>Tiles match</th>" +
                "<th class='tblHeader'>Tiles mismatch</th>" +
                "<th class='tblHeader'>30 seconds elapse</th>" +
                "</tr>" +
                "<tr>" +
                "<td class='tblData'>+ 10 points</td>" +
                "<td class='tblData'>- 4 points</td>" +
                "<td class='tblData'>- 4 points</td>" +
                "</tr>" +
                "</table>" +
                "<br>Timer will start once you click your first tile. <br><br> <i>Good luck and have fun!</i>",
            size: 'medium'
        });
    },
    showCongratsMsg: function() {
        bootbox.alert({
            message: "<img src='" + MemApp.Setup.imgUrl.CONGRATS_URL + "' class='img-responsive'>",
        });
    }
};

MemApp.MusicHandler = {
    getThisPartyStarted: function() {
        MemApp.Setup.audioFile.MUSIC.play();
    },
    partyBreaker: function() {
        MemApp.Setup.audioFile.MUSIC.pause();
    }
};

MemApp.ResetData = {
    resetTime: function() {
        clearTimeout(MemApp.Timer.t);
        MemApp.Timer.seconds = 0;
        MemApp.Timer.minutes = 0;
        MemApp.Timer.hours = 0;
        document.getElementById("playerTime").innerHTML = "00:00:00";
    },
    removeRowContent: function() {
        $("#tileRow").empty();
    },
    resetSrcListCount: function() {
        var srcListSize = MemApp.Util.sizeObj(MemApp.Setup.sourceList) - 1;
        for (var i = 0; i <= srcListSize; i++) {
            MemApp.Setup.sourceList[i].count = 0;
        }
    }
};

MemApp.OnClick = {
    placeholderClicked: function() {
        if ($("#checkPauseBtn").hasClass('glyphicon-play')) {
			bootbox.alert({
				message: "To continue the game, start the timer again (click on play button).",
			});
            return;
        }

        // when image is clicked, check the source of the image
        // if the source is <> from placeholder, image is already opened --> return
        var imageSrc = $(this).attr('src');
        if (imageSrc !== MemApp.Setup.imgUrl.PLACEHOLDER_URL) {
            return;
        }

        // don't allow action while the timeout function is running
        // --> prevents User from opening multiple tiles at once	
        if (MemApp.Timer.isTimerStarted) {
            return;
        }

        var src = $(this).attr('imgpath');
        var id = $(this).attr('id');

        $(this).attr("src", src);

        MemApp.MemoryData.areTilesMatched(new MemApp.Constructor.Image(src, id));

        // show score
        $("#playerScore").text(MemApp.MemoryData.score);

        if (MemApp.Timer.isFirstClick) {
            MemApp.Timer.isFirstClick = false;
            MemApp.Timer.startCountingGameElapsedTime();
        }
        if (MemApp.MemoryData.matchCounter === 10) {
            // all tiles are matched
            clearTimeout(MemApp.Timer.t);

            if (MemApp.MemoryData.isSoundOn) {
                MemApp.Setup.audioFile.SOUND_ROOSTER.play();
            }
            MemApp.UserInteraction.showCongratsMsg();

            var postData = {
                "player_name": $("#playerName").text(),
                "player_score": $("#playerScore").text(),
                "player_time": $("#playerTime").text()
            };

            $.ajax({
                url: './php/insertScore.php',
                type: 'POST',
                data: postData,
                dataType: 'html',
                contentType: ('application/x-www-form-urlencoded;charset=UTF-8')
            });

            setTimeout(function() {
                $("#tblScore").load("./php/getHighscores.php");
            }, 1000);
        }
    },
    replayClicked: function() {
        bootbox.confirm({
            message: "Your current progress <i>will be lost</i>. <br><br> Are you sure you want to restart? ",
            size: 'small',
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function(result) {
                if (result) {
                    // set player score to zero
                    $("#playerScore").text("0");
                    MemApp.MemoryData.img1 = "";
                    MemApp.MemoryData.img2 = "";
                    MemApp.MemoryData.score = 0;
                    MemApp.MemoryData.matchCounter = 0;
                    MemApp.Timer.isFirstClick = true;
                    if ($("#checkPauseBtn").hasClass('glyphicon-play')) {
                        $("#checkPauseBtn").removeClass('glyphicon-play');
                        $("#checkPauseBtn").addClass('glyphicon-pause');
                    }

                    MemApp.ResetData.resetTime();
                    MemApp.ResetData.removeRowContent();
                    MemApp.ResetData.resetSrcListCount();
                    MemApp.TileCreation.createAndSetupTile();
                }
            }
        });
    },
    pausePlayClicked: function() {
		if(MemApp.Timer.isFirstClick){
			return;
		}
        if ($("#checkPauseBtn").hasClass('glyphicon-pause')) {
            clearTimeout(MemApp.Timer.t);
            $("#checkPauseBtn").removeClass('glyphicon-pause');
            $("#checkPauseBtn").addClass('glyphicon-play');
        } else if ($("#checkPauseBtn").hasClass('glyphicon-play')) {
            MemApp.Timer.timer();
            $("#checkPauseBtn").removeClass('glyphicon-play');
            $("#checkPauseBtn").addClass('glyphicon-pause');
        }
    },
    musicClicked: function() {
        if ($("#checkMusicBtn").hasClass('glyphicon-volume-up')) {

            $("#checkMusicBtn").removeClass('glyphicon-volume-up');
            $("#checkMusicBtn").addClass('glyphicon-volume-off');
            MemApp.MusicHandler.partyBreaker();
            MemApp.MemoryData.isSoundOn = false;
        } else if ($("#checkMusicBtn").hasClass('glyphicon-volume-off')) {
            $("#checkMusicBtn").removeClass('glyphicon-volume-off');
            $("#checkMusicBtn").addClass('glyphicon-volume-up');
            MemApp.MusicHandler.getThisPartyStarted();
            MemApp.MemoryData.isSoundOn = true;
        }
    }
};

MemApp.Util = {
    sizeObj: function(obj) {
        return Object.keys(obj).length;
    }
};

// WORKFLOW:
// 1) Dynamically create highscore table
$(window).on("load", w3.includeHTML());
// 2) Create memory tiles
$(window).on("load", MemApp.TileCreation.createAndSetupTile);
// 3) Ask user for name and explain rules
$(document).ready(MemApp.UserInteraction.talkToUser);

// ON CLICK EVENTS
$(document).on('click', '.placeholder', MemApp.OnClick.placeholderClicked);
$("#btnReplay").click(MemApp.OnClick.replayClicked);
$("#btnPause").click(MemApp.OnClick.pausePlayClicked);
$("#btnMusic").click(MemApp.OnClick.musicClicked);