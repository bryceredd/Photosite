var RANDOM_DELAY_MAX = 70 // in seconds


var AlbumTile = (function() {
    var $template = $(".template.pictureItem").removeClass("template").remove()
    var randomColor = "hsl("+Math.round(Math.random()*360)+", 90%, 70%)"

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
        //this.randomChange()
        this.colorChange(0, 255, 0)

        this.write()
    }

    AlbumTile.prototype.randomData = function() {
        return this.album.pictures[Math.floor(Math.random()*this.album.pictures.length)]
    }

    AlbumTile.prototype.colorChange = function(r, g, b) {
        this.album.pictures = this.album.pictures.sort(function(i, j) {
            i = i.colors? i.colors[0] : null
            j = j.colors? j.colors[0] : null

            if(!i && !j) return 0
            if(!i) return -1
            if(!j) return 1

            iScore = Math.abs(i.r - r) + Math.abs(i.g - g) + Math.abs(i.b - b)
            jScore = Math.abs(j.r - r) + Math.abs(j.g - g) + Math.abs(j.b - b)

            console.log("iscore", iScore, jScore)

            return (iScore > jScore ? 1 : -1)
        })
        
        console.log(this.album.pictures)

        if(this.album.pictures[0].colors)
            console.log("this picture is ", this.album.pictures[0].colors[0].r, this.album.pictures[0].colors[0].g, this.album.pictures[0].colors[0 ].b)

        this.picture = this.album.pictures[0]
        this.write()
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
        var retina = window.devicePixelRatio > 1
        var width = retina? 700 : 350
        var height = retina ? 464 : 232
        var isDisplayingImage = this.$pictureBox.attr("background-image") != undefined

        var imageUrl = "/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture.file)
        var thumbUrl = "/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture.file)
        var thumbUrl = '/crop/'+width+'/'+height+'/'+encodeURIComponent(window.location.origin+"/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture.file))
        var largeUrl = '/fit/800/800/'+encodeURIComponent(window.location.origin+"/photo/"+encodeURIComponent(this.album.albumId)+'/'+encodeURIComponent(this.picture.file))

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

        this.$pictureTitle.css({"color":randomColor})

    }

    AlbumTile.prototype.element = function() {
        return this.$tile
    }
    
    return AlbumTile
}())

