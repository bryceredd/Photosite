var fs = require('fs')
var config = require('../config')
var imagemagick = require('imagemagick')
var pathLib = require('path')


exports.largeWithName = function(path, cb) {
    var largePath = exports.largePathForImage(path)

    fs.stat(path, function(err, stats) {
        if(err || !stats.isFile()) 
            return cb(err)

        largeExistsForImage(path, function(exists) {
            if(exists)
                cb(null, largePath) 
            else 
                generateThumbnailForImage(path, largePath, config.largeSize, cb)
        })
    })
}

exports.thumbnailForImage = function(path, cb) {
    var thumbPath = exports.thumbPathForImage(path)

    fs.stat(path, function(err, stats) {
        if(err || !stats.isFile()) 
            return cb(err)

        thumbnailExistsForImage(path, function(exists) {
            if(exists)
                cb(null, thumbPath) 
            else 
                generateThumbnailForImage(path, thumbPath, config.thumbSize, cb)
        })
    })
}

exports.thumbnailWithName = function(thumbName, cb) {
    var thumbPath = pathLib.join(config.thumbPath, encodeURIComponent(thumbName))
    var fullPath = decodeURIComponent(thumbName)

    fileExists(thumbPath, function(exists) {
        if(exists)
            cb(null, thumbPath) 
        else 
            generateThumbnailForImage(fullPath, thumbPath, config.thumbSize, cb)
    })
}

function generateThumbnailForImage(srcPath, destPath, size, cb) {
    var imgData = fs.readFileSync(srcPath, 'binary')

    console.log('shrinking ', srcPath)
    imagemagick.resize({
            srcData: imgData, 
            strip: false, 
            width:config.thumbWidth, 
            height:"^"+config.thumbHeight,
            customArgs: ["-gravity", "north", "-extent", config.thumbSize]
        }, function(err, stdout, stderr) {
            console.log('shrunk to ', destPath)
            fs.writeFileSync(destPath, stdout, 'binary');
            cb(err, destPath)
        })
    }

function largeExistsForImage(path, cb) {
    var path = exports.largePathForImage(path)

    fileExists(path, cb)
}

function thumbnailExistsForImage(path, cb) {
    var path = exports.thumbPathForImage(path)

    fileExists(path, cb)
}

function fileExists(p, cb) {
    fs.stat(p, function(err, stats) {
        var exists = !err && stats.isFile()
        cb(exists)
    })
}

exports.thumbUrlForImage = function(imgPath) {
    return "/thumb/"+encodeURIComponent(imgPath)
}

exports.largeUrlForImage = function(imgPath) {
    return "/large/"+encodeURIComponent(imgPath)
}

exports.largePathForImage = function(imgPath) {
    return pathLib.join(config.largePath, encodeURIComponent(imgPath))
}

exports.thumbPathForImage = function(imgPath) {
    return pathLib.join(config.thumbPath, encodeURIComponent(imgPath))
}

