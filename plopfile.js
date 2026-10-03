const generateComponent = require("./.plop/generators/component")
const generateRoute = require("./.plop/generators/route");

module.exports = function (plop) {
  // controller generator
  plop.setGenerator("component", generateComponent)

  // route generator
  plop.setGenerator("route", generateRoute)
}