var express = require('express')

var app = express.createServer();

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.configure(function() {
	app.use(express.static(__dirname+'/public'))
})

app.listen(3000);
