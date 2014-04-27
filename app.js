var express = require('express');
var path = require('path');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'server')));

app.listen(8080);