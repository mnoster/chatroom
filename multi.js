/**
 * Created by njporter10 on 9/27/16.
 */
function webSocketClose() {
    ws.close();
}
function webSocketInit() {
    console.log('testing');
    if ("WebSocket" in window) {

        console.log('connecting');
        // Let us open a web socket
        ws = new WebSocket("wss://https://www.mnoster.github.io/chatroom/");

        ws.onopen = function () {
            // Web Socket is connected, send data using send()
            socket_connected = true;
            display_connection();
            console.log('connected');
            send_name();

            //$("#connect").text('connected').prop('disabled',true);
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log('message is received', evt);
            var packet = JSON.parse(evt.data);
            var html = null;
            var refresh = false;
            if (packet.type == 'history') {
                html = create_all_messages(packet.data);
                refresh = true;
            }
            else if (packet.type == 'message') {
                html = create_message(packet.data);
            }
            else {
                console.log('unknown type');
                return
            }
            update_message_display(html, refresh);

        };

        ws.onclose = function () {
            // websocket is closed.
            socket_connected = false;
            display_connection();
            alert("Connection is closed...");
        };
    }

    else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}
//-----------------------------------------------

var socket_connected = false;
var ws = null;
function display_connection() {
    if (!socket_connected) {
        $("#connect").text('connect');
    } else {
        $("#connect").text('disconnect');
    }
}
function socket_toggle() {
    if (socket_connected === false) {
        webSocketInit();
    } else {
        webSocketClose();
    }
}
function send_name() {
    console.log('sent name config');

    var packet = {
        action: 'config',
        name: $("#username").val()
    };
    message_transmit(packet);
}
function message_transmit(obj) {
    if (ws) {
        ws.send(JSON.stringify(obj));
    }
    else {
        console.log('no connection to send');
    }
}
function send_message() {

    var packet = {
        action: 'message',
        message: $("#outbound_message").val()
    };
    message_transmit(packet);

}
function create_message(message) {
    var separator = $('<hr>');
    var message_row = $("<div>", {
        class: 'message_row',
        append: separator
    });
    var message_text = $("<div>", {
        class: 'message_text',
        text: message.text
    });
    var message_sender = $("<div>", {
        class: 'message_sender',
        text: message.author + ':'
    });
    message_row.append(message_sender, message_text);
    return message_row;
}
function create_all_messages(history) {
    console.log(history);
    var message_container = $("<div>");
    for (var i = 0; i < history.length; i++) {
        message_container.append(create_message(history[i]));
    }
    return message_container;
}
var user_color = function() {
    var min = Math.ceil(1);
    var max = Math.floor(7);
    var color_index =  Math.floor(Math.random() * (max - min)) + min;
    // console.log("index:" ,color_index);
    var colors = ["red","yellow","green","00FFFF","orange","#ff24bf","white"];
    var color = colors[color_index];

    return color;
    // $(".message_sender").css("color", color);
};
function update_message_display(html, refresh) {
    if (refresh) {
        $("#message_area").html('');

    }
    $("#message_area").append(html);

        var sender_name = $(".message_sender").text();
        var sender_array = sender_name.split(":");
        console.log("sender array: ", sender_array);
        var temp = null;
        for (var i = 0; i < sender_array.length -1; i++) {
            temp = sender_array[i];
            $(".message_sender:contains(" + temp + ':' + ")").css("color", user_color());
            console.log(user_color());
        }
}

$(document).ready(function () {
    $("#connect").click(function () {
        socket_toggle();
    });
    $("#send").click(function () {
        var message = $('#outbound_message').val();
        if(message == '' || message == ' '){
           return;
        }
        console.log('send button clicked');
        send_message();
        $('#outbound_message').val('');
    });
    $("#outbound_message").on('keypress', function (e) {
        if (e.which == 13) {
            console.log('enter key pressed');
            send_message();
        }
    });

});
