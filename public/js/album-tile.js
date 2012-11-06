var RANDOM_DELAY_MAX = 70 // in seconds


var AlbumTile = (function() {
    var $template = $(".template.pictureItem").removeClass("template").remove()

    function AlbumTile() {
        this.$tile = $template.clone()
        
        this.$pictureLink = this.$tile.find(".expand")
        this.$pictureDownload = this.$tile.find(".download")
        this.$pictureBox = this.$tile.find(".pictureBox")
        this.$pictureCaption = this.$tile.find(".pictureCaption")
        this.$pictureTitle = this.$tile.find(".title")
        this.$pictureSubtitle = this.$tile.find(".subtitle")
    }

    AlbumTile.prototype.loadPicture = function(album, picture) {
        this.isAlbum = false
        this.album = album
        this.picture = picture

        this.write()
    }

    AlbumTile.prototype.loadAlbum = function(album) {
        clearTimeout(this.randomTimer)
        this.isAlbum = true
        this.album = album

        this.picture = this.randomData()
        this.randomChange()

        this.write()
    }

    AlbumTile.prototype.randomData = function() {
        return this.album.pictures[Math.floor(Math.random()*this.album.pictures.length)]
    }

    AlbumTile.prototype.randomChange = function() {
        var self = this

        this.randomTimer = setTimeout(function() {
            self.$pictureBox.fadeOut(1000, function() {
                self.picture = self.randomData()
                self.write()
                self.$pictureBox.fadeIn(1000, self.randomChange)
            })
        }, Math.random()*RANDOM_DELAY_MAX*1000)
    }

    AlbumTile.prototype.write = function() {
        var self = this
        var isDisplayingImage = this.$pictureBox.attr("background-image") != undefined

        var imageUrl = "/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture)
        var thumbUrl = "/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture)
        var thumbUrl = '/crop/350/232/'+encodeURIComponent(window.location.origin+"/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture))
        var largeUrl = '/fit/800/800/'+encodeURIComponent(window.location.origin+"/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture))

        if(isDisplayingImage) {
            this.$pictureBox.fadeOut(1000, function() {
                self.$pictureBox.css('background-image', 'url("'+thumbUrl+'")')
                self.$pictureBox.fadeIn(1000)
            })
        } else {
            self.$pictureBox.css('background-image', 'url("'+thumbUrl+'")')
        }

        if(this.isAlbum) {
            this.$pictureTitle.html(this.album.title)
            this.$pictureSubtitle.html(this.album.subtitle)
            this.$pictureLink.attr("href", "/album/"+this.album.albumId)
            this.$pictureCaption.fadeIn(1000)
            this.$pictureDownload.remove()
        } else {
            this.$pictureLink.attr("href", largeUrl)
            this.$pictureDownload.attr("href", imageUrl)
            this.$pictureCaption.hide()
        }

        this.$pictureTitle.css({"color": "hsl("+Math.round(Math.random()*360)+", 90%, 70%)"})

    }

    AlbumTile.prototype.element = function() {
        return this.$tile
    }
    
    return AlbumTile
}())

