express = require 'express'
ejs = require 'ejs'
cluster = require 'cluster'
config = require './config'
connect = require 'connect'
path = require 'path'

exports.createServer = ->

    config.resolve (albums) ->

        app = express.createServer()

        app.get '/', (req, res) -> res.render "layout"
        app.get '/album/:albumid', (req, res) -> res.render "layout"

        app.get '/albums', albums.getAlbums
        app.get '/albums/:albumid', albums.getAlbum 
        app.get '/photo/:album/:photo', albums.getPhoto


        ###app.get(/\/colors\/(.+)/, function(req, res) {
            var url = req.url.replace("/colors/", "")

            console.log(url)
            thumbnails.colorsForUrl(url, function(err, colors) {
                res.send(colors)
            })
        })###

        app.configure ->
            app.use express.static(__dirname + '/public')
            app.use connect.compress()
            app.set 'views', (__dirname + '/views')
            app.set 'view engine', 'ejs'

        return app

###if(module == require.main) {
    cluster(exports.createServer()).listen(80)
}###

console.log """
LISTENING ON PORT #{config.get 'PHOTOSITE_PORT'}
"""

exports.createServer().listen config.get 'PHOTOSITE_PORT'
