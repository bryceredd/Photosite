var fs = require('fs')
var path = require('path')
var thumbnails = require('../util/thumbnail')
var config = require('../config')

var photoPath = config.photoPath

exports.getAlbums = function(cb) {
	fs.readdir(photoPath, function(err, dirs) {
                if(err) return cb(err)
                if(!dirs) dirs = {}

                var albums = {}

                var count = dirs.length
                dirs.forEach(function(dir) {
                    exports.getAlbum(dir, function(err, album) {
                        if(err) return cb(err)

                         albums[dir] = album

                         if(--count === 0) {
                             return cb(null, albums)
                         }
                    })
                })
	})
}

exports.getAlbum = function(name, cb) {
    var albumPath = path.join(photoPath, name)
    
    fs.readdir(albumPath, function(err, files) {
        if(!files) return cb()

        var pictures = []
        files.forEach(function(file) {
            var imagePath = path.join(albumPath, file)
            var thumbPath = thumbnails.thumbUrlForImage(imagePath)
            var largePath = thumbnails.largeUrlForImage(imagePath)
            pictures.push({file:file, thumb:thumbPath, large:largePath})

        })

        return cb(null, pictures)
    })

}
