path = require 'path'
{container} = require 'dependable'

deps = container()

# CONFIG / VARIABLES
deps.register "PHOTOSITE_PORT", process.env.PHOTOSITE_PORT || 8081
deps.register "IMAGE_RESIZER", process.env.IMAGE_RESIZER || 'resizer.i.tv'
deps.register "PHOTO_PATH", process.env.PHOTO_PATH || 'organized'
deps.register "RESIZED_PHOTO_PATH", process.env.RESIZED_PHOTO_PATH || 'resized'

exports.mongoHQusername = 'mongo_user_0249'
exports.mongoHQpassword = 'mongo_pass_6338'
exports.mongoHQdbname = 'photobase'
exports.mongoHQcollection = 'photos'

# APPLICATION CODE
deps.load path.join(__dirname, 'controller')
deps.load path.join(__dirname, 'util')

module.exports = deps

