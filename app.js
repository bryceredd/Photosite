var express = require('express')
var fs = require('fs')
var ejs = require('ejs')
var path = require('path')
var imagemagick = require('imagemagick')

var thumbnails = require('./util/thumbnail')

var photoPath = path.join('/home/bryce/Desktop/organized')

var app = express.createServer()
//app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
	fs.readdir(photoPath, function(err, files) {

		var pictures = {}

		files.forEach(function(file) {
			pictures[file] = (fs.readdirSync(path.join(photoPath,file)))
		})

		res.render("home", {albums:pictures})
	})
})

app.get('/test', function(req, res) {
	res.render("home.ejs")
})

app.configure(function() {
	app.use(express.static(path.join(__dirname,'/public')))
})

app.listen(3000);
