var RANDOM_DELAY_MAX = 70 // in seconds


var AlbumTile = (function() {
    var $template = $(".template.pictureItem").removeClass("template").remove()

    function AlbumTile(page) {
        this.page = page
        this.$tile = $template.clone()
        
        this.$pictureLink = this.$tile.find(".expand")
        this.$pictureDownload = this.$tile.find(".download")
        this.$pictureBox = this.$tile.find(".pictureBox")
        this.$pictureCaption = this.$tile.find(".pictureCaption")
        this.$pictureTitle = this.$tile.find(".title")
        this.$pictureSubtitle = this.$tile.find(".subtitle")
    }

    AlbumTile.prototype.loadData = function(jsonData) {
        clearTimeout(this.randomTimer)
        this.isAlbum = $.isArray(jsonData)

        if(this.isAlbum) {
            this.allData = jsonData 
            this.data = this.randomData()
            this.randomChange()
        } else {
            this.data = jsonData
        }

        this.write()
    }


    AlbumTile.prototype.randomData = function() {
        return this.allData[Math.floor(Math.random()*this.allData.length)]
    }

    AlbumTile.prototype.randomChange = function() {
        var self = this
        this.randomTimer = setTimeout(function() {
            self.$pictureBox.fadeOut(1000, function() {
                self.data = self.randomData()
                self.write()
                self.$pictureBox.fadeIn(1000, function() {
			self.randomChange()
		})
            })
        }, Math.random()*RANDOM_DELAY_MAX*1000)
    }

    AlbumTile.prototype.write = function() {
        var self = this
        var isDisplayingImage = this.$pictureBox.attr("background-image") != undefined

        if(isDisplayingImage) {
            this.$pictureBox.fadeOut(1000, function() {
                self.$pictureBox.css('background-image', 'url(\"'+this.data.thumb+'\")')
                self.$pictureBox.fadeIn(1000)
            })
        } else {
            self.$pictureBox.css('background-image', 'url(\"'+this.data.thumb+'\")')
        }
        this.$pictureTitle.html(this.data.title)
        this.$pictureSubtitle.html(this.data.subtitle)



        if(this.isAlbum) {
            this.$pictureLink.attr("href", "/album/"+this.data.name)
            this.$pictureCaption.fadeIn(1000)
            this.$pictureDownload.remove()
        } else {
            this.$pictureLink.attr("href", this.data.large)
            this.$pictureDownload.attr("href", this.data.full)
            this.$pictureCaption.hide()
        }

    }

    AlbumTile.prototype.element = function() {
        return this.$tile
    }
    
    return AlbumTile
}())

