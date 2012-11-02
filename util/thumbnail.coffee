fs = require 'fs'
path = require 'path'
imagemagick = require "imagemagick"

module.exports = (RESIZED_PHOTO_PATH) ->

  resize = (req, res) ->
    url = req.params.url
    size = "#{req.params.width}x#{req.params.height}"
    cropImage url, size, (err, dest) ->
      return res.send err, 500 if err?
      res.contentType file
      res.sendfile file

  fit = (req, res) ->
    url = req.params.url
    size = "#{req.params.width}x#{req.params.height}"

  cropImage = (sourceUrl, size, cb) ->
    console.log "shrinking ", sourceUrl
    destPath = pathForImage sourceUrl, size

    ensureDoesntExist destPath, cb, ->

      imagemagick.convert [sourceUrl, "-resize", size, destPath], (err, metadata) ->
        console.log "shrunk to ", destPath
        cb err, destPath

  ###fitImage = (sourceUrl, destPath, size, cb) ->
    imgData = fs.readFileSync(srcUrl, "binary")
    console.log "shrinking ", srcUrl
    imagemagick.resize
      srcData: imgData
      strip: false
      width: config.thumbWidth
      height: "^" + config.thumbHeight
      customArgs: ["-gravity", "north", "-extent", config.thumbSize]
    , (err, stdout, stderr) ->
      console.log "shrunk to ", destPath
      fs.writeFileSync destPath, stdout, "binary"
      cb err, destPath###

  ensureDoesntExist = (destPath, exists, doesntExist) ->
    fs.stat destPath, (err, stats) ->
      if not err and stats.isFile()
        exists()
      else
        doesntExist()

  pathForImage = (sourceUrl, size) ->
    path.join RESIZED_PHOTO_PATH, ("#{encodeURIComponent(sourceUrl)}#{size}".replace /[^a-zA-Z0-9]/, "")+".jpg"

  colorSchemeForImage = (path, cb) ->
    imagemagick.convert [path, "-colors", 4, "-format", "%c", "-depth", 8, "histogram:info:-"], (err, output) ->
      console.log output
      cb output

  colorsForUrl = (url, cb) ->
    imagemagick.convert [url, "-colors", 12, "-format", "%c", "-depth", 8, "histogram:info:-"], (err, output) ->
      output = output.trim()
      output = output.replace(/:.*#/g, ", \"color\": \"#")
      output = output.replace(/^\s*/g, "{\"amount\": ")
      output = output.replace(RegExp(" rgb.*", "g"), "\"},")
      output = output.substring(0, output.length - 1)
      output = "[" + output + "]"
      results = JSON.parse(output)
      results = results.sort((a, b) ->
        b.amount - a.amount
      )
      colors = []
      i = 0

      while i < results.length
        colors.push results[i].color
        i++
      cb null, colors

  return {
    resize
    fit 
  }

