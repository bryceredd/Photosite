var fs = require('fs')
var path = require('path')
var thumbnails = require('../util/thumbnail')

var photoPath = path.join(__dirname,'../public/organized')

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
        var count = files.length
        files.forEach(function(file) {
            var imagePath = path.join(albumPath, file)

            thumbnails.thumbnailForImage(imagePath, function(err, thumbPath) {
                if(err) return cb(err)

                pictures.push({file:file, thumb:thumbPath})

                if(--count === 0) {
                    return cb(null, pictures)
                }
            })
        })
    })

}
