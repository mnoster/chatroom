var ws = require("nodejs-websocket");

// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
	var message = [];
	var currentTime = new Date();
	console.log("New connection",conn);

	conn.on("text", function (str) {
		console.log("Received "+str)
		var packet = JSON.parse(str);
		message.push(packet);
		console.log(packet);
		var out_packet = {
			history: message.length,
			message: "resend: "+packet.message, 
			sender: packet.sender
		};
		conn.sendText(JSON.stringify(out_packet));
	})

	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
}).listen(8001)