/*jslint browser: true, indent: 4 */
/* global d3: false, $: false, alert: false, TreeMap: false , FlickrUtils: true, console: true, utils: true */

function Carto(htmlID, clickCallBack) {
  "use strict";
  var self = this;

  var width,height;

  self.margin = {top: 0, right: 0, bottom: 150, left: 0};
  var previousCountry;
  htmlID = htmlID || "#globe";
  var countriesMap = d3.map();

  var zoomMap = d3.carto.map();

  updateDimensions();
  d3.select(htmlID).call(zoomMap);

  zoomMap.setScale(2);

  var tileLayer = d3.carto.layer.tile();
    tileLayer
    .tileType("stamen")
    .path("watercolor")
    .label("Watercolor")
    // .tileType("cartodb")
    // .path("examples.map-zgrqqx0w")
    // .label("Terrain");

  zoomMap.addCartoLayer(tileLayer);


  d3.json("world.geojson", function(error, data) {

    data.features.forEach(function (d) {
      countriesMap.set(d.properties.name.toUpperCase(), d);
    });


    var featureLayer = d3.carto.layer.featureArray();
    featureLayer
      .features(data.features)
      .label("Countries")
      .cssClass("invisible")
      .renderMode("svg")
      .clickableFeatures(true)
      .on("load", clickToZoom);

    zoomMap.addCartoLayer(featureLayer);
  });

  function clickToZoom() {
    d3.select(htmlID).selectAll("path.invisible").on("click", function (d) {

      var path = d3.geo.path().projection(zoomMap.projection());
      zoomMap.zoomTo(path.bounds(d),"scaled", 0.95,2000);

      clickCallBack(d.properties.name);

    });
  }

  function updateDimensions( ) {
    d3.select(htmlID).select("#d3MapLayerBox").style("display", "none");
    // zoomMap.div().select("#d3MapZoomBox").style("display", "none");
    width = (self.width !== undefined ? self.width : document.getElementById(htmlID.slice(1)).offsetWidth) - self.margin.left - self.margin.right;
    height = (self.height !== undefined ? self.height :  $(window).height()) - self.margin.top - self.margin.bottom;
    height =  $(window).height() / 4;

    d3.select(htmlID)
      .style("width", width + "px")
      .style("height", height+ "px");

  }


 self.rotateToCountry = function (country) {

    updateDimensions();

    console.log("Rotate to " + country.properties.name);


    var path = d3.geo.path().projection(zoomMap.projection());
    zoomMap.zoomTo(path.bounds(country),"scaled", 0.95,2000);



    };

  self.rotateToLatLong = function (name, lat, lon, scale) {
    updateDimensions();
    console.log("Rotate to " + name + " " + lat + " " +  lon);
    var path = d3.geo.path().projection(zoomMap.projection());
    // zoomMap.zoomTo(path.bounds(d),"scaled", 0.95,2000);
  };

  self.rotateToBoundingBox = function (name, minlat, minlon, maxlat, maxlon) {
    updateDimensions();
    console.log("Rotate to BB " + name + " " + minlat + " " +  minlon + " " + maxlat + " " +  maxlon);
    var proj = zoomMap.projection();
    var bounds = [
      proj([minlat, minlon]),
      proj([maxlat, maxlon])
    ];
    zoomMap.zoomTo(bounds,"scaled", 0.95,2000);
  };

  self.reset = function () {
    updateDimensions();
    console.log("Reset carto");
    clickToZoom();
  };



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

  return self;
}
