mongoose = require 'mongoose'
Schema = mongoose.Schema
path = require 'path'
imagemagick = require "imagemagick"

module.exports = (db, PHOTO_PATH) ->

  PhotoSchema = new Schema

    # (Required) usually the filename
    photoId: type: String, index: true, unique: true, required: true

    # (Required) the directory
    albumId: type: String, index: true, required: true

    # (Optional) dominant colors of the photo.  these will be added on 
    # by an external process which will run every 5 minutes.
    #
    # ex: [{amount: 123, colors:{r: 123, g: 245, b: 123}}, ...]
    colors: type: [Object]

  PhotoSchema.statics.upsert = (photo, cb) ->
    @findOneAndUpdate photoId: photo.photoId, photo, upsert: true, cb

  PhotoSchema.statics.photos = (cb) ->
    @find {}, cb

  PhotoSchema.methods.path = ->
    path.join PHOTO_PATH, path.join @albumId, @photoId

  PhotoSchema.methods.detectColors = (cb) ->
    url = @path()
    imagemagick.convert [url, "-colors", 12, "-format", "%c", "-depth", 8, "histogram:info:-"], (err, output) ->
      output = output.trim()

      amountRegex = /([0-9]+):/
      colorRegex = /srgb.([0-9]+),([0-9]+),([0-9]+)/

      colors = (output.split "\n").map (line) ->

        amount: +(amountRegex.exec line)[1]
        colors: 
          r: +(colorRegex.exec line)[1]
          g: +(colorRegex.exec line)[2]
          b: +(colorRegex.exec line)[3]

      @colors = colors.sort (a, b) -> b.amount - a.amount
      @save cb


  Photo = db.model 'Photo', PhotoSchema