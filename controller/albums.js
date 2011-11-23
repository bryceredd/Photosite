var fs = require('fs')
var path = require('path')
var thumbnails = require('../util/thumbnail')
var config = require('../config')

var photoPath = config.photoPath

exports.getAlbums = function(cb) {
	fs.readdir(photoPath, function(err, dirs) {
                if(err) return cb(err)
                if(!dirs) dirs = {}
 
                var albums = []

                var count = dirs.length
                dirs.forEach(function(dir) {
                    exports.getAlbum(dir, function(err, album) {
                        if(err) return cb(err)

                         albums.push(album)

                         if(--count === 0) {
                             return cb(null, albums)
                         }
                    })
                })
	})
}

exports.getAlbum = function(name, cb) {
    var titlePattern = /[a-z\s]+$/gi
    
    var albumPath = path.join(photoPath, name)
    var albumTitle = titlePattern.exec(name)
    var albumDate = parseAlbumDate(name)

    if(albumTitle != null && albumTitle != undefined)
        albumTitle = albumTitle[0]
    
    fs.readdir(albumPath, function(err, files) {
        if(!files) return cb()

        var pictures = []
        files.forEach(function(file) {
            var imagePath = path.join(albumPath, file)
            var thumbPath = thumbnails.thumbUrlForImage(imagePath)
            var largePath = thumbnails.largeUrlForImage(imagePath)
            var fullPath = path.join(path.join(config.photoUrl, name), file)

            pictures.push({file:file, thumb:thumbPath, large:largePath, full:fullPath, subtitle:albumTitle, title:albumDate, name:name})

        })

        return cb(null, pictures)
    })

}

function parseAlbumDate(name) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var yearPattern = /([0-9]+)/gi
    var monthPattern = /[0-9]+-([0-9]+)/gi

    var year = yearPattern.exec(name)[1]
    var month = monthPattern.exec(name)[1]

    if(month == null || month == undefined) return year? year : ""

    return months[month-1] + " " + year
}
