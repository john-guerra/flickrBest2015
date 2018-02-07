/*jslint browser: true, indent: 4 */
/* global d3: false, $: false, alert: false, TreeMap: false , FlickrUtils: true, console: true, utils: true */

function Globe(htmlID) {
  "use strict";
  var self = this;

  var width,height = 200;
  self.margin = {top: 0, right: 0, bottom: 200, left: 0};
  var previousCountry;
  htmlID = htmlID || "#globe";



  var canvas = d3.select(htmlID).append("canvas");


  var projection = d3.geo.orthographic()
  // var projection = d3.geo.mercator()
      .clipAngle(90)
      .precision(0.6);


  var c = canvas.node().getContext("2d");

  var path = d3.geo.path()
      .projection(projection)
      .context(c);

  var title = d3.select("h1");

  updateDimensions();



  queue()
      .defer(d3.json, "world-110m.json")
      .defer(d3.tsv, "world-country-names.tsv")
      .await(ready);

  var countriesMap = d3.map();

  var globe = {type: "Sphere"},
      land ,
      countries,
      borders,
      i,
      n;

  function ready(error, world, names) {
    if (error) throw error;

    // globe = {type: "Sphere"};
    globe = {type: "Point"};
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
    i = -1;
    n = countries.length;

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    countries.forEach(function (d) {
      countriesMap.set(d.name.toUpperCase(), d);
    });

    // transition();
  }

  function updateDimensions( ) {

    width = (self.width !== undefined ? self.width : document.getElementById(htmlID.slice(1)).offsetWidth) - self.margin.left - self.margin.right;
    height = (self.height !== undefined ? self.height :  $(window).height()) - self.margin.top - self.margin.bottom;

    projection.translate([width / 2, height / 2])
      .scale(width / 2 - 20);
    canvas
      .attr("width", width)
      .attr("height", height);


   d3.select(self.frameElement).style("height", height + "px");
  }

  self.rotateToCountry = function (country) {

    updateDimensions();

    console.log("Rotate to " + country.name);
    return d3.transition()
        .duration(1250)
        .each("start", function() {
          title.text(country.name);
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(country),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
            c.fillStyle = "#f00", c.beginPath(), path(country), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        })
        // .transition()
        // .each("end", transition);

    };

  self.rotateToLatLong = function (name, lat, lon, scale) {
    updateDimensions();
    console.log("Rotate to " + name + " " + lat + " " +  lon);
    scale = scale  || width / 2 - 20;
    return d3.transition()
        .duration(1250)
        .each("start", function() {
          title.text(name);
        })
        .tween("rotate", function() {
          var r = d3.interpolate(projection.rotate(), [-lat, -lon]);
          return function(t) {
            projection.rotate(r(t));
            projection.scale(scale);
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
            if (previousCountry) {
              c.fillStyle = "#f00", c.beginPath(), path(previousCountry), c.fill();
            }
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        });
        // .transition()
        // .each("end", transition);
  };

  self.reset = function () {
    updateDimensions();
    console.log("Reset globe");
    var scale = 150;
    return d3.transition()
        .duration(1250)
        .tween("rotate", function() {
          var r = d3.interpolate(projection.rotate(), [103, -48]);
          return function(t) {
            projection.rotate(r(t));
            projection.scale(scale);
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        });
        // .transition()
        // .each("end", transition);
  };



  function transition() {
    self.rotateToCountry(countries[i = (i + 1) % n]);
  }

  self.rotateTo = function (name) {
    name = name.toUpperCase();
    if (countriesMap.has(name)) {
      self.rotateToCountry(countriesMap.get(name));
      previousCountry = countriesMap.get(name);
      return true;
    } else {
      console.log("Couldn't find country " + name);
      return false;
    }

  };







  self.countries = countries;



  return self;
}
