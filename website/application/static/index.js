$(function()
{
    $('#messages') .css({'height': (($(window).height()) * 0.8) + 'px'});

    $(window).bind('resize', function(){
        $('messages') .css({'height': (($(window).height()) - 200) + 'px'});
    });
});

function scrollSmoothToBottom (id) {
    var div = document.getElementById(id);
    $('#' + id).animate({
        scrollTop: div.scrollHeight - div.clientHeight
    }, 500);
}

async function load_name(){
    return await fetch('/get_name')
        .then(async function (response){
            return await response.json();
        }).then(function (text) {
            return text['name']
        });
};

async function load_messages() {
    return await fetch('/get_messages')
    .then(async function(response){
        return await response.json();
    }).then(function(text){
        console.log(text)
        return text
    });
};

function dateNow() {
    var date = new Date();
    var year = date.getFullYear();
    var dt = date.getDate();
    var mm = (date.getMonth() + 1);

    if (dt < 10)
        dt = '0' + dt;

    if (mm < 10)
        mm = '0' + mm;

    var cur_day = year + '-' + mm + '-' + dt;

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = data.getSeconds()

    if (hours < 10)
        hours = '0' + hours

    if (minutes < 10)
        minutes = '0' + minutes

    if (seconds < 10)
        seconds = '0' + seconds

    return cur_day + '-' + hours + '-' + minutes;
}

var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', async function(){
        var usr_name = await load_name()
        if (usr_name != ""){
            socket.emit('event',{
                message: usr_name + 'just connected to the server',
                connect: true
            });
        }
        var form = $('form#msgForm').en('submit', async function(e){
            e.preventDefault()

            // get input from message box
            let msg_input = document.getElementById('msg')
            let usr_input = msg_input.value
            let user_name = await load_name()

            // clear msg box value
            msg_input.value = ""

            // send message to another users
            socket.emit('event', {
                message: usr_input,
                name: user_name
            });
        });
    });
    socket.on('disconnect', async function(msg){
        var usr_name = await load_name()
        socket.emit('event',{
            message: usr_name + 'just left the server',
            name: usr_name
        });
    });
    socket.on('message response', function(msg){
        add_message(msg, true)
    });

window.onload = async function(){
    var msgs = await load_messages()
    for(i = 0; i < msgs.length; i++){
        scroll = false
        if( i == msgs.length - 1 ){
            scroll = true
        }
        add_messages(msgs[i], scroll)
    }
}

async function add_messages(msg, scroll){
    if(typeof msg.name != 'undefined'){
        var date = date.dateNow()

        if( typeof msg.time != 'undefined'){
            var n = msg.time
        }
        else{
            var n = date
        }
        var global_name = await load_name()

        var content = '<div class="container">' + '<b style="color:#000" class="right">' + msg.name + '</b><p>'
         + msg.message + '</p>'
        if (global_name == msg.name){
            content = '<div class="container darker">' + '<b style="color:#000" class="left">' + msg.name
            + '</b><p>' + msg.message + '</p>'
        }
        //update div
        var messageDiv = document.getElementById("messages")
        messageDiv.innerHTML += content
    }
    if(scroll){
        scrollSmoothToBottom('messages')
    }
}

