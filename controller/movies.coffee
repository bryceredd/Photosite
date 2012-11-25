fs = require 'fs'
path = require 'path'

module.exports = (MOVIE_PATH) ->

  getMovie = (req, res) ->
    movieId = req.params.movieId
    file = path.join MOVIE_PATH, movieId

    res.contentType file
    res.sendfile file

  getMovies = (req, res) ->
    fs.readdir MOVIE_PATH, (err, dirs=[]) ->
      return res.send err, 500 if err?

      res.send dirs.filter (dir) -> not (/^\./.test dir)

  return {
    getMovie
    getMovies
  }
