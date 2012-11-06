fs = require 'fs'
path = require 'path'
request = require 'request'
imagemagick = require "imagemagick"

module.exports = (RESIZED_PHOTO_PATH) ->

  fit = (req, res) ->
    resize fitImage, req, res

  crop = (req, res) ->
    resize cropImage, req, res

  resize = (func, req, res) ->
    url = req.params.url
    size = "#{req.params.width}x#{req.params.height}"
    func url, size, (err, file) ->
      return res.send err, 500 if err?
      console.log "output file: ", file
      res.contentType file
      res.sendfile file

  fitImage = (url, size, cb) ->
    dest = pathForImage url, size, "fit"
    ensureDoesntExist dest, cb, ->
      imagemagick.convert [url, "-resize", size, dest], (err, metadata) ->
        cb err, dest

  cropImage = (url, size, cb) ->
    [width, height] = size.split "x"
    dest = pathForImage url, size, "crop"
    ensureDoesntExist dest, cb, ->

      imagemagick.convert [url, "-resize", size+"^", "-gravity", "north",  "-extent", size, dest], (err, metadata) ->
        cb err, dest

  ensureDoesntExist = (dest, exists, doesntExist) ->
    fs.stat dest, (err, stats) ->
      if not err and stats.isFile()
        exists err, dest
      else
        doesntExist()

  pathForImage = (sourceUrl, size, type) ->
    path.join RESIZED_PHOTO_PATH, ("#{type}#{encodeURIComponent(sourceUrl)}#{size}".replace /[^a-zA-Z0-9]/, "")+".jpg"

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
    fit 
    crop
  }

