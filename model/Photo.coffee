mongoose = require 'mongoose'
Schema = mongoose.Schema

module.exports = (db) ->

  PhotoSchema = new Schema

    # usually the filename
    photoId: type: String, index: true, unique: true

    # the directory
    albumId: type: String, index: true

  PhotoGameSchema.statics.upsert = (game, cb) ->
    @findOneAndUpdate gameId: game.gameId, game, upsert: true, cb

  PhotoGameSchema.statics.gamesBetweenTimeForLeageAndTeams = (start, end, league, teams, cb) ->
    @find {
      startTime: {$gte: start, $lte: end}
      league: league
      $or: [ { homeId: { $in: teams } }, { awayId: { $in: teams } } ]
    }, cb

  PhotoGame = db.model 'Photo', PhotoGameSchema