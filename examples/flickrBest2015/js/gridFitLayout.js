d3.layout.gridFit = function() {
  var hierarchy = d3.layout.hierarchy(),
      round = Math.round,
      size = [1, 1], // width, height
      sort = d3_layout_hierarchySort,
      padding = null,
      computeForCols = false,
      pad = d3_layout_gridFitPadNull,
      ratio = 0.5 * (1 + Math.sqrt(5)); // golden ratio

  function findBestLayout(num, rect) {
    var start = new Date().getTime();
    var W = rect.dx,
      H = rect.dy,
      w,h,
      cols,rows,
      bestA = 0,
      bestG = Infinity,
      bestCols, bestRows,
      gc, gr;

    var i = 0;

    function computeFromCols() {
      var g;
      rows = Math.max(Math.ceil(num / cols), 1);
      w = Math.max(W /cols, 0);
      h = Math.max(w / ratio, 0);
      a = w*h;
      g = (W*H) - (rows * cols * a); //wasted spaces area
      // console.log("Cols" + i + " a= " + a + " g "  +  g + " cols " + cols +  " rows " + rows + " W " + W + " w " + w + " H" +  H + " h " + h + "gc " + gc + " gr " + gr + " bestG " + bestG + " bC " + bestCols + " bR " + bestRows + " bA " + bestA);
      return g;
    }

    function computeFromRows() {
      var g;
      cols = Math.max(Math.ceil(num / rows), 1);
      h = Math.max(H /rows, 0);
      w = Math.max(h * ratio, 0);
      a = w*h;
      g = (W*H) - (rows * cols * a); //wasted spaces area
      // console.log("Rows" + i + " a= " + a + " g "  +  g + " cols " + cols +  " rows " + rows + " W " + W + " w " + w + " H" +  H + " h " + h + "gc " + gc + " gr " + gr + " bestG " + bestG + " bC " + bestCols + " bR " + bestRows + " bA " + bestA);
      return g;
    }

    //Initial approach use sqrt
    // var startI = Math.floor(Math.sqrt(num+2));
    var startI = 0;
    //The gap is bigger than the 30% of the available area
    while ( true ) {
      cols = i + startI +  1;
      gc = computeFromCols();
      if (a > bestA && gc > 0) {
        bestA = a;
        bestG = gc;
        bestCols = cols;
        bestRows = rows;
      }

      if (computeForCols) {
        rows = i + startI + 1;
        gr = computeFromRows();
        if (a > bestA && gr > 0) {
          bestA = a;
          bestG = gr;
          bestCols = cols;
          bestRows = rows;
        }
      } else {
        gr = 1;
      }


      if ( Math.abs(bestG) < Math.min(Math.abs(gc), Math.abs(gr)) &&  bestG > 0 ) {
        a = bestA;
        w = Math.sqrt(ratio*a);
        h = (Math.sqrt(ratio*a) / ratio);
        break;
      }

      if (++i > num) {
        a = bestA;
        w = Math.floor(Math.sqrt(ratio*a));
        h = Math.floor((Math.sqrt(ratio*a) / ratio));
        a = w*h;
        console.log("Too many iterations i = " + i  + " num " + num + " a= " + a + " g "  +  Math.min(Math.abs(gc), Math.abs(gr)) + " cols " + cols +  " rows " + rows + " w " +  w + " h " + h );
        break;
      }
    }


    var end = new Date().getTime();
    var time = end - start;
    // console.log('gridfit Execution time: ' + time);
    return {"rows":bestRows,
      "cols":bestCols,
      "a":bestA,
      "w":w,
      "h":h,
      "W":W,
      "H":H,
      "g":bestG
    };
  }


  function gridFitLayout(node) {
    var children = node.children;
    if (children!==undefined) { children = children.sort(sort); }
    if (children && children.length) {
      var rect = pad(node),
          num = children.length,
          remaining = children.slice(), // copy-on-write
          child;

      layout = findBestLayout(num, rect);
      children.forEach(function (c, i) {
        position(c, i % layout.cols, Math.floor(i / layout.cols), rect, layout);
      });
      children.forEach(gridFitLayout);
    }
  }

  // Positions the specified node
  function position(o, i, j, rect, layout) {
    o.dx = layout.w;
    o.dy = layout.h;
    o.x = rect.x + i * o.dx;
    o.y = rect.y + j * o.dy;
    o.area = layout.a;
  }

  function gridFit(d) {
    var nodes = hierarchy(d),
        root = nodes[0];
    root.x = 0;
    root.y = 0;
    root.dx = size[0];
    root.dy = size[1];

    gridFitLayout(root);
    return nodes;
  }

  gridFit.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return gridFit;
  };

  gridFit.sort = function(x) {
    if (!arguments.length) return sort;
    sort = x;
    return gridFit;
  };

  gridFit.padding = function(x) {
    if (!arguments.length) return padding;

    function padFunction(node) {
      var p = x.call(gridFit, node, node.depth);
      return p == null
          ? d3_layout_gridFitPadNull(node)
          : d3_layout_gridFitPad(node, typeof p === "number" ? [p, p, p, p] : p);
    }

    function padConstant(node) {
      return d3_layout_gridFitPad(node, x);
    }

    var type;
    pad = (padding = x) == null ? d3_layout_gridFitPadNull
        : (type = typeof x) === "function" ? padFunction
        : type === "number" ? (x = [x, x, x, x], padConstant)
        : padConstant;
    return gridFit;
  };

  gridFit.round = function(x) {
    if (!arguments.length) return round != Number;
    round = x ? Math.round : Number;
    return gridFit;
  };

  gridFit.ratio = function(x) {
    if (!arguments.length) return ratio;
    ratio = x;
    return gridFit;
  };

  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }

  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }

  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }

  function d3_layout_gridFitPadNull(node) {
    return {x: node.x, y: node.y, dx: node.dx, dy: node.dy};
  }

  function d3_layout_gridFitPad(node, padding) {
    var x = node.x + padding[3],
        y = node.y + padding[0],
        dx = node.dx - padding[1] - padding[3],
        dy = node.dy - padding[0] - padding[2];
    if (dx < 0) { x += dx / 2; dx = 0; }
    if (dy < 0) { y += dy / 2; dy = 0; }
    return {x: x, y: y, dx: dx, dy: dy};
  }


  return d3_layout_hierarchyRebind(gridFit, hierarchy);
};


