path = require 'path'
mongoose = require 'mongoose'
{container} = require 'dependable'

deps = container()

mongoHQusername = 'mongo_user_0249'
mongoHQpassword = 'mongo_pass_6338'
mongoHQdbname = 'photobase'

# CONFIG / VARIABLES
PHOTO_DB = process.env.PHOTO_DB || "mongodb://#{mongoHQusername}:#{mongoHQpassword}@staff.mongohq.com:10081/#{mongoHQdbname}"
deps.register "PHOTO_DB", PHOTO_DB
deps.register "PHOTOSITE_PORT", process.env.PHOTOSITE_PORT || 8081
deps.register "IMAGE_RESIZER", process.env.IMAGE_RESIZER || 'resizer.i.tv'
deps.register "PHOTO_PATH", process.env.PHOTO_PATH || 'organized'
deps.register "RESIZED_PHOTO_PATH", process.env.RESIZED_PHOTO_PATH || 'resized'

db = mongoose.createConnection PHOTO_DB

# APPLICATION CODE
deps.load path.join __dirname, 'controller'
deps.load path.join __dirname, 'model'
deps.load path.join __dirname, 'util'

module.exports = deps

