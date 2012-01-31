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
                resizeImage(path, largePath, config.largeSize, cb)
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
                generateThumbnailForImage(path, thumbPath, cb)
        })
    })
}

exports.thumbnailWithName = function(thumbName, cb) {
    var thumbPath = pathLib.join(config.thumbPath, encodeURIComponent(thumbName))
    var fullPath = decodeURIComponent(thumbName)

    fileExists(thumbPath, function(exists) {
        if(exists) {
            colorSchemeForImage(thumbPath, function() {})
            cb(null, thumbPath) 
        } else 
            generateThumbnailForImage(fullPath, thumbPath, cb)
    })
}

function resizeImage(srcPath, destPath, size, cb) {
    console.log('shrinking ', srcPath)
    imagemagick.convert([srcPath, '-resize', size, destPath], function(err, metadata) {
        console.log('shrunk to ', destPath)

        cb(err, destPath)
    })
}

function generateThumbnailForImage(srcPath, destPath, cb) {
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

exports.colorsForUrl = function(url, cb) {
    imagemagick.convert([url, '-colors', 12, '-format', '%c', '-depth', 8, 'histogram:info:-'], function(err, output) {

        output = output.trim()
        output = output.replace(/:.*#/g, ", \"color\": \"#")
        output = output.replace(/^\s*/gm, "{\"amount\": ")
        output = output.replace(/ rgb.*/g, "\"},")
        output = output.substring(0, output.length-1)
        output = "[" + output + "]"

        var results = JSON.parse(output)

        results = results.sort(function(a, b) {
            return b.amount - a.amount
        })

        var colors = []
        for(var i=0; i<results.length; i++) {
            colors.push(results[i].color)
        }

        cb(null, colors)
    })
}

function colorSchemeForImage(path, cb) {
    imagemagick.convert([path, '-colors', 4, '-format', '%c', '-depth', 8, 'histogram:info:-'], function(err, output) {
        console.log(output)
        cb(output)
    })
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

