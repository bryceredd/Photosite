var MoviePage = (function() {
  var $menu = $(".moviemenu")
  var $player = $(".player")
  var $showmenu = $(".showmenu")
  var $download = $(".downloadmovie")

  function MoviePage() {
    self = this
    this.movie == null
    this.loadMovies()

    $showmenu.bind("click", function() {
      self.movie = null
      self.write()
    })

    $download.bind("click", function() {
      window.location = "/movies/"+self.movie
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
          window.location = "/movies/"+e.data
        })

        $menu.append(element)
      }

      $player.hide()
      $menu.show()
      $showmenu.hide()
      $download.hide()

    } else {

      video = $player.find("video")
      video.attr("src", "/movies/"+this.movie)
      $player.show()
      $menu.hide()
      $showmenu.show()
      $download.show()
    }
  }

  return MoviePage

}())