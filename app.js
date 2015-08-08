var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app);
var fs = require('fs');

app.get('/upload', function(req, res) {
  res.send('upload test');
});

app.get('/', function (req, res) {
 fs.readFile('./static/upload.html', function(error, data) {
	res.writeHead(200, { 'Content-type' : 'text/html' });
	res.end(data, function(error) {
		console.log(error);
	});
 });
});

app.get('/world.html', function (req, res) {
  res.send('Hello World');
});

server.listen(8000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
