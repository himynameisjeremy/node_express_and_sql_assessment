var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var app = express();
var index = require("./routes/index.js");
var randomNum = require("./routes/randomNum.js");
var port = process.env.PORT || 3000;
var connectionString;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", index);
app.use("/animals", index);

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
