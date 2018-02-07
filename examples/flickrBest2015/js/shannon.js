function loadedImage(ev) {
  "use strict";
  var element = document.getElementById('imagec');
  var context = element.getContext('2d');
  var im = ev.target;
  var width = im.width;
  var height = im.height;
  element.width = width;
  element.height = height;
  context.width = width;
  context.height = height;
  context.drawImage(im, 0, 0);
  var imageData = context.getImageData(0, 0, width, height);
  var h1 = computeHistogram(imageData, 1);
  var h2 = computeHistogram(imageData, 2);
  var h3 = computeHistogram(imageData, 3);
  var h4 = computeHistogram(imageData, 4);
  var e1 = computeEntropy(h1);
  var e2 = computeEntropy(h2);
  var e3 = computeEntropy(h3);
  var e4 = computeEntropy(h4);
  document.getElementById('one').innerHTML = e1;
  document.getElementById('two').innerHTML = e2;
  document.getElementById('three').innerHTML = e3;
  document.getElementById('four').innerHTML = e4;
  var quads = [];
  quads.push(["I", e1]);
  quads.push(["II", e2]);
  quads.push(["III", e3]);
  quads.push(["IV", e4]);
  quads.sort(function (a, b) {
    return a[1] <= b[1];
  });
  console.log(quads);
  drawSailentRect(imageData, quads[0][0]);
  document.getElementById('result').innerHTML = quads[0][0];
}

function doClick() {
  "use strict";
  var u = document.getElementById("url").value;
  var i = new Image();
  i.onload = loadedImage;
  i.crossOrigin = "anonymous";
  i.src = u;
}

function computeHistogram(imageData, quad) {
  "use strict";
  var points = getQuadRect(imageData, quad);

  var sum = 0.0;
  var hist = Array.apply(0, new Array(256)).map(function (x, i) { return 0; });
  var histN = Array.apply(0, new Array(256)).map(function (x, i) { return 0; });

  var raw = [];
  for (var y = points[1]; y < points[3]; y++) {
    for (var x = points[0]; x < points[2]; x++) {
      var p = getPixelXY(imageData, x, y);
      var b = (p[0] + p[1] + p[2]) / 3;
      hist[b]++;
      sum += b;
    }
  }

  for (var j = 0; j < 256; j++) {
    histN[j] = hist[j] / sum;
  }
  return histN;
}

function computeEntropy(histN) {
  var e = 0.0;
  for (var i = 0; i < histN.length; i++) {
    var frequency = histN[i];
    if (frequency != 0) {
      e -= frequency * (Math.log(frequency) / Math.log(2));
    }
  }
  return e;
}

function drawSailentRect(imageData, quad) {
  switch(quad) {
  case "I":
    quad = 1;
    break;
  case "II":
    quad = 2;
    break;
  case "III":
    quad = 3;
    break;
  case "IV":
    quad = 4;
    break;
  }
  var element = document.getElementById('imagec');
  var context = element.getContext('2d');
  var points = getQuadRect(imageData, quad);

  context.moveTo(points[0], points[1]);
  context.lineWidth = 5;
  context.lineTo(points[2], points[1]);
  context.stroke();
  context.lineTo(points[2], points[3]);
  context.stroke();
  context.lineTo(points[0], points[3]);
  context.stroke();
  context.lineTo(points[0], points[0]);
  context.stroke();
}

function getQuadRect(imageData, quad) {
  quad = typeof quad !== 'undefined' ? quad : 0;

  var x_start = 0;
  var x_end = imageData.width;
  var y_start = 0;
  var y_end = imageData.height;

  switch(quad) {
  case 1:
    x_start = imageData.width / 2;
    x_end = imageData.width;
    y_start = 0;
    y_end = imageData.height / 2;
    break;
  case 2:
    x_start = 0;
    x_end = imageData.width / 2;
    y_start = 0;
    y_end = imageData.height / 2;
    break;
  case 3:
    x_start = 0;
    x_end = imageData.width / 2;
    y_start = imageData.height / 2;
    y_end = imageData.height;
    break;
  case 4:
    x_start = imageData.width / 2;
    x_end = imageData.width;
    y_start = imageData.height / 2;
    y_end = imageData.height;
    break;
  }
  return [x_start, y_start, x_end, y_end];
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 */
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
  case 0: r = v, g = t, b = p; break;
  case 1: r = q, g = v, b = p; break;
  case 2: r = p, g = v, b = t; break;
  case 3: r = p, g = q, b = v; break;
  case 4: r = t, g = p, b = v; break;
  case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}


/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR
 * r, g, b
 */
function RGBtoHSV(r, g, b) {
  if (arguments.length === 1) {
    g = r.g, b = r.b, r = r.r;
  }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
  case min: h = 0; break;
  case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
  case g: h = (b - r) + d * 2; h /= 6 * d; break;
  case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return {
    h: h,
    s: s,
    v: v
  };
}

// http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function getPixel(imgData, index) {
  var i = index * 4;
  var d = imgData.data;
  return [d[i], d[i+1], d[i+2], d[i+3]];
}

function getPixelXY(imgData, x, y) {
  return getPixel(imgData, (y * imgData.width) + x);
}
