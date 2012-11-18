fs = require 'fs'
path = require 'path'
async = require 'async'
{curry} = require 'fjs'
config = require '../config'

module.exports = ->
  config.resolve (RESIZED_PHOTO_PATH, PHOTO_PATH, Photo) ->

    findPicturesWithoutColors = (cb) ->
      Photo.photos (photos=[]) =>
        walk = scan photos.reduce ((prev, curr) -> prev[curr.path()]; prev), {}
        fs.readdir PHOTO_PATH, (err, dirs=[]) ->
          async.concat dirs, walk, cb

    scan = curry (pics, dir, cb) ->
      fs.readdir (path.join PHOTO_PATH, dir), (err, files=[]) ->
        files = files.filter (file) -> file isnt '.DS_Store' 
        files = files.filter (file) -> 
          loc = path.join PHOTO_PATH, dir, file
          not pics[loc]?

        photos = files.map (file) -> 
          new Photo 
            photoId: file
            albumId: dir

        cb null, photos

    colorizePictures = (photos, cb) ->
      queue = async.queue ((item, cb) -> item.detectColors cb), 10
      queue.push photo for photo in photos

    {colorizePictures, findPicturesWithoutColors}


if module is require.main
  racist = module.exports()

  async.waterfall [
    racist.findPicturesWithoutColors
    racist.colorizePictures 
  ], (err, res) ->
    console.log "Finished", (if err? then "with error: #{err}" else "")
