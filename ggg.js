// example ggg.js. Delete what you don't need
module.exports = {

  // services
  start: "node_modules/.bin/coffee app.coffee",

  // install
  install: "npm install",

  // servers to deploy to
  servers: {
    bozar: "root@bozar.dyndns.org"
  }
}
