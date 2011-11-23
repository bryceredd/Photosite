var AlbumPage = (function() {
    var $template = $("body")
    var $titleBoxTemplate =  $(".template.titleBox").removeClass("template").remove()

    function AlbumPage() {
        var self = this
        this.isAlbum = document.location.pathname != "/"

        this.$titleBox = $titleBoxTemplate.clone()
        this.$titleBoxTitle = this.$titleBox.find(".title")
        this.$titleBoxSubtitle = this.$titleBox.find(".subtitle")

        this.$page = $template
        this.tiles = []


        if(this.isAlbum) {
            var album = document.location.pathname.split("/")[2]
            this.loadAlbum(album)
        } else {
            this.loadAlbums();
        }
    }

    AlbumPage.prototype.loadAlbums = function() {
        var self = this

        $.get("/photos", function(response) {
            self.albumdata = response;

            self.write()
        })
    }

    AlbumPage.prototype.loadAlbum = function(album) {
        var self = this
        $.get("/photos/"+album, function(response) {
            self.albumdata = response
            self.write()
        })
    }

    AlbumPage.prototype.write = function() {
        this.$page.empty()

        for(var i=0; i<this.albumdata.length; i++) {

            if(i == 1 && this.isAlbum) {
                this.$page.append(this.$titleBox)
                this.$titleBoxTitle.text(this.albumdata[0].title)
                this.$titleBoxSubtitle.text(this.albumdata[0].subtitle)

                if(!this.albumdata[0].subtitle)
                    this.$titleBoxSubtitle.hide()
            }

            var tile = new AlbumTile(this)
            this.tiles.push(tile)
            tile.loadData(this.albumdata[i])
            this.$page.append(tile.element())

        }

        if(this.isAlbum)
            $('.expand').lightBox()
    }

    return AlbumPage

}())
