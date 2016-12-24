var express = require('express'); //this will import our express module
var app = express();
app.set('port',process.env.PORT || 3000); //defining that the port is defined on port 3000, may need to be changed
app.get('/',function(req,res){ //
    res.send('Express works'); //this defines the root, "/" this is the default which is access to the most basic urls like localhost
                              // whenver you go to your url in the browser it going to print out a message 'Express Works'
});
app.listen(app.get('port'),function(){ // this will tell it to listen on port 3000 for any instructions in regards to what information to push out
    console.log("express started press CTR-C to terminate")
});

//----then to actually run this application, save it first, then in the terminal type: node index.js
//----then if you go to your browser and type localhost:3000, the page should print