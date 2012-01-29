var path = require('path')

exports.root = '/var/www/photosite'

exports.thumbSize = "350x232"
exports.largeSize = "1200x900"

exports.thumbWidth = 350
exports.thumbHeight = 232

exports.thumbPath = path.join(exports.root, '/public/'+exports.thumbSize)
exports.largePath = path.join(exports.root, '/public/'+exports.largeSize)
exports.photoPath = path.join(exports.root, '/public/organized')
exports.photoUrl = '/organized'



