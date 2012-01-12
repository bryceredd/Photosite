var express = require('express')
var fs = require('fs')
var ejs = require('ejs')
var path = require('path')
var cluster = require('cluster')
var thumbnails = require('./util/thumbnail')
var albums = require('./controller/albums')

var config = require('./config.js')


var app = express.createServer()
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    albums.getAlbums(function(err, albums) {
        res.render("layout")
    })
})

app.get('/photos', function(req, res) {
    albums.getAlbums(function(err, albums) {
        res.send(albums)
    })
})

app.get('/album/:albumid', function(req, res) {
    albums.getAlbum(req.params.albumid, function(err, album) {
        res.render("layout")
    })
})

app.get('/photos/:albumid', function(req, res) {
    albums.getAlbum(req.params.albumid, function(err, album) {
        res.send(album)
    })
})

app.get('/large/:thumbName', function(req, res) {
    thumbnails.largeWithName(req.params.thumbName, function(err, thumbPath) {
        res.contentType(thumbPath)
        res.sendfile(thumbPath)
    })
})

app.get('/thumb/:thumbName', function(req, res) {
    thumbnails.thumbnailWithName(req.params.thumbName, function(err, thumbPath) {
        res.contentType(thumbPath)
        res.sendfile(thumbPath)
    })
})

app.configure(function() {
    app.use(express.static(path.join(config.root,'/public')))
    app.set('views', path.join(config.root, '/views'));
})

cluster(app).listen(80);
