var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'www')));

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
});