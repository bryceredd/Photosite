express = require 'express'
ejs = require 'ejs'
config = require './config'
path = require 'path'

exports.createServer = ->

    config.resolve (albums, thumbnail) ->

        app = express.createServer()

        app.get '/', (req, res) -> res.render "layout"
        app.get '/album/:albumid', (req, res) -> res.render "layout"

        app.get '/albums', albums.getAlbums
        app.get '/albums/:albumid', albums.getAlbum 
        app.get '/photo/:album/:photo', albums.getPhoto

        app.get '/crop/:width/:height/:url', thumbnail.crop
        app.get '/fit/:width/:height/:url', thumbnail.fit


        ###app.get(/\/colors\/(.+)/, function(req, res) {
            var url = req.url.replace("/colors/", "")

            console.log(url)
            thumbnails.colorsForUrl(url, function(err, colors) {
                res.send(colors)
            })
        })###

        app.configure ->
            app.use express.static(__dirname + '/public')
            #app.use connect.compress()
            app.set 'views', (__dirname + '/views')
            app.set 'view engine', 'ejs'

        return app

###if(module == require.main) {
    cluster(exports.createServer()).listen(80)
}###

console.log """
LISTENING ON PORT #{config.get 'PHOTOSITE_PORT'}
PHOTO_PATH #{config.get 'PHOTO_PATH'}
RESIZED_PHOTO_PATH #{config.get 'RESIZED_PHOTO_PATH'}
"""

exports.createServer().listen config.get 'PHOTOSITE_PORT'
