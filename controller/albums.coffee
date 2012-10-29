fs = require 'fs'
path = require 'path'
moment = require 'moment'
async = require 'async'

module.exports = (PHOTO_PATH) ->

    getPhoto = (req, res) ->
        album = req.params.album
        photo = req.params.photo
        file = path.join PHOTO_PATH, path.join album, photo

        res.contentType file
        res.sendfile file

    getAlbums = (req, res) ->
    	fs.readdir PHOTO_PATH, (err, dirs=[]) ->
            return res.send err, 500 if err?

            async.map dirs, readAlbum, (err, albums) ->
                return res.send err, 500 if err?

                albums = albums.filter (album) -> album?.pictures?.length > 1

                res.send albums.sort (a, b) -> (if a.date > b.date then -1 else 1)

    getAlbum = (req, res) ->
        name = req.params.albumid
        readAlbum name, (err, data) ->
            res.send err, 500 if err?
            res.send data


    readAlbum = (album, cb) ->

        titlePattern = /[a-z\s]+$/gi
        titleRes = (titlePattern.exec album)
        return cb null, null if not titleRes?.length > 0
        
        albumPath = path.join PHOTO_PATH, album
        albumTitle = titleRes[0]
        albumDate = dateForAlbum album
        
        fs.readdir albumPath, (err, files=[]) ->
            return cb null if err?.errno is 27
            return cb err if err

            obj = {
                albumId: album
                subtitle: albumTitle.trim()
                title: moment(albumDate).format("MMMM YYYY"), 
                date: albumDate, 
                pictures: files
            }

            return cb null, obj


    dateForAlbum = (name) ->
        yearPattern = /([0-9]+)/gi
        monthPattern = /[0-9]+-([0-9]+)/gi

        year = yearPattern.exec(name)
        month = monthPattern.exec(name)

        return "" if not year?.length > 0
        return "" if not month?.length > 0

        year = year[1]
        month = month[1]

        date = new Date()
        date.setFullYear year
        date.setMonth month

        return date

    return {
        getAlbum,
        getAlbums,
        getPhoto
    }

