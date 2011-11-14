
var AlbumTile = (function() {
    var $template = $(".template.albumTile").removeClass("template").remove()

    function AlbumTile(jsonData) {
        this.allData = jsonData
        this.data = this.randomData()

        this.$tile = $template.clone()
        this.$pictureBox = this.$tile.find(".pictureBox")
        this.$pictureCaption = this.$tile.find(".pictureCaption")
        this.$pictureTitle = this.$tile.find(".title")
        this.$pictureSubtitle = this.$tile.find(".subtitle")

        this.randomChange()
        this.write()
    }

    AlbumTile.prototype.randomData = function() {
        return this.allData[Math.floor(Math.random()*this.allData.length)]
    }

    AlbumTile.prototype.randomChange = function() {
        var self = this
        setTimeout(function() {
            self.$pictureBox.fadeOut(1000, function() {
                self.data = self.randomData()
                self.write()
                self.$pictureBox.fadeIn(1000)
            })
        }, Math.random()*30*1000)
    }

    AlbumTile.prototype.write = function() {
        this.$pictureBox.css('background-image', 'url('+this.data.thumb+')')
        this.$pictureTitle.html(this.data.title)
        this.$pictureSubtitle.html(this.data.subtitle)
        this.$tile.attr("href", "/album/"+this.data.name)
    }

    AlbumTile.prototype.element = function() {
        return this.$tile
    }
    
    return AlbumTile
}())


function loadAlbums(data) {
    var $tiles = $('.tiles')

    for(var i=0; i<data.length; i++) {
        var tile = new AlbumTile(data[i])

        $tiles.append(tile.element())
    }
}

