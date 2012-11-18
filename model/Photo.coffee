mongoose = require 'mongoose'
Schema = mongoose.Schema
path = require 'path'
imagemagick = require "imagemagick"

module.exports = (db, PHOTO_PATH) ->

  PhotoSchema = new Schema

    # (Required) usually the filename
    photoId: type: String, index: true

    # (Required) the directory
    albumId: type: String, index: true

    # (Optional) dominant colors of the photo.  these will be added on 
    # by an external process which will run every 5 minutes.
    #
    # ex: [{amount: 123, colors:{r: 123, g: 245, b: 123}}, ...]
    colors: Array

  # photos must have an albumId property
  # and a photoId property
  PhotoSchema.statics.hydrate = (album, cb) ->
    ors = ({albumId:album.albumId, photoId:photo} for photo in album.pictures)
    @find {$or: ors}, (err, data) ->
      datas = data.reduce ((prev, curr) -> prev[curr.photoId] = curr; prev), {}

      album.pictures = album.pictures.map (picture) ->
        file: picture
        colors: datas[photo]?.colors

      cb err, album

  PhotoSchema.statics.upsert = (photo, cb) ->
    console.log "upserting", photo.photoId
    @findOneAndUpdate photoId: photo.photoId, photo, upsert: true, cb

  PhotoSchema.methods.path = ->
    path.join PHOTO_PATH, path.join @albumId, @photoId

  PhotoSchema.methods.detectColors = (cb) ->
    url = @path()
    imagemagick.convert [url, "-colors", 12, "-format", "%c", "-depth", 8, "histogram:info:-"], (err, output) =>
      output = output.trim()

      amountRegex = /([0-9]+):/
      colorRegex = /srgb.([0-9]+),([0-9]+),([0-9]+)/

      colors = (output.split "\n").map (line) ->

        amount: +(amountRegex.exec line)?[1]
        colors: 
          r: +(colorRegex.exec line)?[1]
          g: +(colorRegex.exec line)?[2]
          b: +(colorRegex.exec line)?[3]

      photo = @toJSON()
      delete photo._id
      photo.colors = colors.sort (a, b) -> b.amount - a.amount
      Photo.upsert photo, cb


  Photo = db.model 'Photo', PhotoSchema