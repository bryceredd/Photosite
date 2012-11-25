var MoviePage = (function() {
  var $menu = $(".moviemenu")
  var $player = $(".player")
  var $showmenu = $(".showmenu")

  function MoviePage() {
    self = this
    this.movie == null
    this.loadMovies()

    $showmenu.bind("click", function() {
      self.movie = null
      self.write()
    })
  }

  MoviePage.prototype.loadMovies = function() {
    var self = this

    $.get("/movies", function(response) {
        self.movies = response.sort()
        self.write()
    })
  }

  MoviePage.prototype.write = function() {
    self = this

    if (this.movie == null) {
      $menu.empty()
      for (var i=0; i < this.movies.length; i++) {
        var movie = this.movies[i]

        var element = $("<li></li>")
        element.append(movie.replace(/\..*$/, ""))
        element.bind("click", movie, function(e) {
          self.movie = e.data
          self.write()
        })

        $menu.append(element)
      }

      $player.hide()
      $menu.show()
      $showmenu.hide()

    } else {

      video = $player.find("video")
      video.attr("src", "/movies/"+this.movie)
      $player.show()
      $menu.hide()
      $showmenu.show()
    }
  }

  return MoviePage

}())