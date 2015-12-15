function Update() {
    if (window.innerWidth > 1080) {
        $('#hero').css('height', window.innerHeight);
        $('#hero_floating_content').css('top', '50%');
        $('#down-arrow').css('display', 'block');
    }
    else {
        $('#hero').css('height', $('#hero_floating_content').outerHeight() + 160);
        $('#hero_floating_content').css('top', 80);
        $('#down-arrow').css('display', 'none');
    }
    $('.locked').css('max-height', $('#w').outerWidth());
}
setInterval(function () {
    Update();
}, 1000);

var question_number = 0;

function NextQuestion() {
    var new_section;
    $('.questions .question').each(function (i, obj) {
        if (i == question_number)
            new_section = $(this);
    });
    var center_v = (window.innerHeight * .5 - new_section.outerHeight() * .5);
    $("html, body").animate({ scrollTop: new_section.offset().top - (center_v > 0 ? center_v : 0) }, 270, 'swing');
    ++question_number;
}

//function addQuestion(prompt, difficulty, img, )
var datamem = "";
var level_index = new Array('w', 'x', 'y', 'z');

function takeToFocusCenter(id) {
    var center_v = (window.innerHeight * .5 - $(id).outerHeight() * .5);
    $("html, body").animate({ scrollTop: $(id).offset().top - (center_v > 0 ? center_v : 0) }, 270, 'swing');
}

function fbShare(url, title, descr, image, winWidth, winHeight) {
    var winTop = (screen.height / 2) - (winHeight / 2);
    var winLeft = (screen.width / 2) - (winWidth / 2);
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}

var correct_count = 0;
var current_level = 1;

$(document).ready(function () {
    $('.gray-section').css('display', 'block');
    $('#vertical-fix').css('display', 'none');
    $('.loading-div').css('display', 'none');
    $('#results').css("display", "none");

    setInterval(function () {
        $('#down-arrow').toggleClass('down');
    }, 1000);

    $('#contact').click(function (e) {
        e.preventDefault();
        takeToFocusCenter('#start-section');
    });

    $('#btn_continue').click(function (e) {
        e.preventDefault();
        if (current_level != 4) {
            takeToFocusCenter('#' + level_index[current_level]);
            setTimeout(function () {
                $('#' + level_index[current_level]).addClass('unlocked');
            }, 600);
        }
    });

    $('#btn_fb_share').click(function (e) {
        e.preventDefault();
        fbShare('http://tswt.github.io/thestarwarstest/lv' + current_level + '.html', 'I got ' + correct_count + '/6 on Level ' + current_level + '. Can you beat my score?', 'Built by the fans, for the fans. Take this unofficial Star Wars test to find out how well you know the story!', 'http://tswt.github.io/thestarwarstest/img/swt80.png', 720, 450);
    });

    $('.level-block').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('unlocked')) {
            //Display the loading thingy
            $('#loading-div-pre').css('display', 'block');
            $('#qspacephp').css('display', 'none');
            takeToFocusCenter('#loading-div-pre');
            var obj = $(this);
            setTimeout(function () {
                //Load the questions from this level
                $.post("http://www.drillinator.com/php/questions.php", {
                    d: level_index.indexOf(obj.attr('id')) + 1
                }).done(function (data) {
                    //Add them in :-)
                    correct_count = 0;
                    current_level = level_index.indexOf(obj.attr('id')) + 1;
                    $('#qspacephp').html(cleanGarbage(data));
                    $('#qspacephp').css('display', 'block');
                    $('.gray-section').css('display', 'block');
                    $('#loading-div-pre').css('display', 'none');
                    $('#results').css('display', 'none');
                    question_number = 0;
                    NextQuestion();
                    $('.answers a').click(function (e) {
                        e.preventDefault();
                        //has it already been solved?
                        if (!$(this).parent().parent().hasClass("solved")) {
                            if ($(this).hasClass("correct")) {
                                $(this).css('background-color', 'rgb(0, 100, 0)');
                                ++correct_count;
                            } else {
                                $(this).css('background-color', 'rgb(100, 0, 0)');
                                //Mark the correct answer!
                                var id = $(this).parent().parent().attr('id');
                                $("#" + id + " a.correct").addClass("selected");
                            }
                            $(this).parent().parent().addClass("solved");

                            var solved_count = 0;
                            $('.solved').each(function (i, obj) {
                                ++solved_count;
                            });
                            if (solved_count != 6) {
                                setTimeout(function () {
                                    NextQuestion();
                                }, 400);
                            } else {
                                if (correct_count < 4) {
                                    //No pass
                                    $('#sp_congrats').html("<br/>You need at least 4/6 to pass.");
                                    $('#sp_cont').css("display", "none");
                                    $('#h3_impress').css("display", "none");
                                    $('#btn_continue').css('display', 'none');
                                    $('#btn_fb_share').css('margin-top', '24px');
                                } else {
                                    //We passed
                                    $('#sp_congrats').html("Well Done!");
                                    if (current_level != 4) {
                                        $('#sp_level_btn').html(current_level + 1);
                                        $('#btn_continue').css('display', 'inline-block');
                                    } else {
                                        $('#btn_continue').css('display', 'none');
                                    }
                                    $('#sp_cont').css("display", "block");
                                    $('#h3_impress').css("display", "block");
                                    $('#btn_fb_share').css('margin-top', '0');
                                }
                                $('#sp_score').html(correct_count);
                                $('#results').css("display", "block");
                                takeToFocusCenter('#results');
                            }
                        }
                    });
                });
            }, 500);
        }
    });
});

function validEmailAddress(input) {
    var atpos = input.indexOf("@");
    var dotpos = input.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= input.length) {
        return false;
    }
    return true;
}

function cleanGarbage(input) {
    var output = "";
    var acceptable = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM 1234567890`~!@#$%^&*()_+-={}|:\"<>?[]\;',./\r\n";
    for (var i = 0; i < input.length; ++i) {
        if (acceptable.indexOf(input[i]) != -1)
            output += input[i];
    }
    return output;
}

function loadImg(options, callback) {
    var seconds = 0,
    maxSeconds = 10,
    complete = false,
    done = false;

    if (options.maxSeconds) {
        maxSeconds = options.maxSeconds;
    }

    function tryImage() {
        if (done) { return; }
        if (seconds >= maxSeconds) {
            callback({ err: 'timeout' });
            done = true;
            return;
        }
        if (complete && img.complete) {
            if (img.width && img.height) {
                callback({ img: img });
                done = true;
                return;
            }
            callback({ err: '404' });
            done = true;
            return;
        } else if (img.complete) {
            complete = true;
        }
        seconds++;
        callback.tryImage = setTimeout(tryImage, 1000);
    }
    var img = new Image();
    img.onload = tryImage();
    img.src = options.src;
    tryImage();
}