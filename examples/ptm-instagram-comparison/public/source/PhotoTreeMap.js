/* global d3: false, getUrlForPhoto: false, $: false , ShanonEntropy: false */

/*jslint browser: true, indent: 2 */

function TreeMap(htmlID) {
  "use strict";
  let self = this,
    width = window.innerWidth / 2,
    height = window.innerHeight / 2,
    color = d3.scale.category20c(),
    treemap,
    fScale,
    div,
    grandparent,
    oldDepth,
    transitioning = false,
    breadCrumsHtmlID = "#breadCrums",
    accumulateValue = false,
    value = "value",
    labelValue = "value",
    showLabel = function (d) {
      return true;
    },
    label = "label",
    sort = value,
    showAsGrid = false,
    padding = 0,
    filter = function (d) {
      return d;
    },
    currentNode,
    shannon = new ShannonEntropy(),
    useShannon = false,
    dImgQuadrants = new d3.map(),
    chainedAnimations = true,
    animationDuration = 0,
    zoomable = false,
    showNodeTextTitle = true,
    showNodeTextValue = true;
  ;

  self.margin = {top: 0, right: 0, bottom: 0, left: 0};

  self.zoomable = function (_) {
    if (!arguments.length) return zoomable;
    zoomable = _;
    return self;
  };

  self.breadCrumsHtmlID = function (_) {
    if (!arguments.length) return breadCrumsHtmlID;
    breadCrumsHtmlID = _;
    return self;
  };

  self.sort = function (_) {
    if (!arguments.length) return sort;
    sort = _;
    return self;
  };

  self.value = function (_) {
    if (!arguments.length) return value;
    value = _;
    return self;
  };

  self.label = function (_) {
    if (!arguments.length) return label;
    label = _;
    return self;
  };
  //TODO : Add in the README.md
  self.accumulateValue = function (_) {
    if (!arguments.length) return accumulateValue;
    accumulateValue = _;
    return self;
  };

  self.labelValue = function (_) {
    if (!arguments.length) return labelValue;
    labelValue = _;
    return self;
  };
//TODO : Add in the README.md
  self.filter = function (_) {
    if (!arguments.length) return filter;
    filter = _;
    return self;
  };

  self.showLabel = function (_) {
    if (!arguments.length) return showLabel;
    showLabel = _;
    return self;
  };

  self.padding = function (_) {
    if (!arguments.length) return padding;
    padding = _;
    return self;
  };
//TODO : Add in the README.md
  self.showAsGrid = function (_) {
    if (!arguments.length) return showAsGrid;
    showAsGrid = _;
    return self;
  };

  self.useShannon = function (_) {
    if (!arguments.length) return useShannon;
    useShannon = _;
    return self;
  };

  self.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return self;
  };

  self.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return self;
  };

  self.chainedAnimations = function (_) {
    if (!arguments.length) return chainedAnimations;
    chainedAnimations = _;
    return self;
  };

  self.animationDuration = function (_) {
    if (!arguments.length) return animationDuration;
    animationDuration = _;
    return self;
  };

  self.showNodeTextValue = function (_) {
    if (!arguments.length) return showNodeTextValue;
    showNodeTextValue = _;
    return self;
  };

  self.showNodeTextTitle = function (_) {
    if (!arguments.length) return showNodeTextTitle;
    showNodeTextTitle = _;
    return self;
  };

  let currentDepth = 0;
  let TEXT_HEIGHT = 50;
  let MIN_SIZE_FOR_TEXT = 100;
  let ZOOM_TRANSITION_DURATION = 750;
  self.showPhotos = true;
  self.growable = false;

  let x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

  let y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

  fScale = d3.scale.linear()
    .domain([10, 30000])
    .range([0.7, 10.0]);
  treemap = getTreemap();
  self.treemap = treemap;

  function getTreemap() {
    // console.log(self);
    if (self.zoomable()) {
      if (showAsGrid) {
        return d3.layout.gridFit()
          .value(function (d) {
            return d[value];
          })
          .children(function (d, depth) {
            return depth ? null : filter(d._children);
          })
          // .children(function(d) { return filter(d._children); })
          .sort(function (a, b) {
            return d3.ascending(a[sort], b[sort]);
          })
          .size([width, height])
          .ratio(1) //squares
          .round(false);
      } else {
        return d3.layout.treemap()
        // treemap
        // .padding(0)
          .value(function (d) {
            return d[value];
          })
          .children(function (d, depth) {
            return depth ? null : filter(d._children);
          })
          // .sort(function(a, b) { return a[value] - b[value]; })
          // .sort(function (a, b) { return d3.descending(a[sort], b[sort]); })
          .sort(function (a, b) {
            return d3.ascending(a[sort], b[sort]);
          })
          .size([width, height])
          // .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
          .ratio(1)
          .round(false);
      }
    } else {
      if (showAsGrid) {
        return d3.layout.gridFit()
          .value(function (d) {
            return d[value];
          })
          .children(function (d) {
            return filter(d.children);
          })
          .sort(function (a, b) {
            return d3.ascending(a[sort], b[sort]);
          })
          .size([width, height])
          .ratio(1); //squares
      } else {
        return d3.layout.treemap()
          .padding(8)
          .children(function (d) {
            return filter(d.children);
          })
          .value(function (d) {
            return d[value];
          })
          .size([width, height])
          .sort(function (a, b) {
            return d3.ascending(a[sort], b[sort]);
          });
      }
    }
  }

  //Alex grande answer in http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
  function isFunction(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  self.loading = function () {
    div.select("#spinner").style("display", "inline");
  };

  self.init = function () {
    div = d3.select(htmlID).append("div")
      .attr("id", "innerTreeMap");

    div.append("div")
      .attr("id", "spinner")
      .style("position", "absolute")
      .append("div")
      .attr("id", "spinnerBG")
      .append("div")
      .style("padding-top", "45%")
      .style("text-align", "center")
      .text("Please wait while we load 50k images");

    div.select("#spinner")
      .append("img")
      .attr("src", "img/spinner.gif")
      .style("display", "inline")
      .style("position", "absolute");

    if (self.zoomable()) {
      // grandparent = div.append("div")
      // .attr("class", "grandparent node");
    }

    self.updateWindowSizes();
    self.loading();
    return self;
  };

  self.updateWindowSizes = function () {
    width = (self.width() !== undefined ? self.width() : document.getElementById(htmlID.slice(1)).offsetWidth) - self.margin.left - self.margin.right;
    height = (self.height() !== undefined ? self.height() : $(window).height()) - self.margin.top - self.margin.bottom;

    x.domain([0, width])
      .range([0, width]);

    y.domain([0, height])
      .range([0, height]);

    div.style("position", "relative")
      .style("width", (width + self.margin.left + self.margin.right) + "px")
      .style("height", (height + self.margin.top + self.margin.bottom) + "px")
      .style("left", self.margin.left + "px")
      .style("top", self.margin.top + "px");

    div.select("#spinnerBG")
      .style("width", (width ) + "px")
      .style("height", (height) + "px")
      .style("left", "0px")
      .style("top", "0px");

    div.select("#spinner img")
      .style("left", (self.margin.left + width / 2) + "px")
      .style("top", (self.margin.top + height / 2) + "px");

    if (self.zoomable()) {
      // grandparent.style("padding", "5px 0px 0px 5px")
      //     .style("top", "-30px")
      //     .style("left", "0px")
      //     .style("width", (width - 5) + "px")
      //     .style("height", "30px")
      //     .style("background-color", "orange");
    }
    treemap.size([width, height]);
  };

  function findNodeWithId(id) {
    let node, queue = [];

    queue.push(self.root);

    while (queue.length > 0) {
      node = queue.shift();

      if (node.id === id) {
        return node;
      } else {
        if (node.children) {
          queue = queue.concat(node.children);
        }
        if (node._children) {
          queue = queue.concat(node._children);
        }
      }
    }
    return undefined;
  }

  //Traverse the tree applying one function, and saving the result in d.attrib
  function treeTraverse(fn) {
    function treeTraverseHelper(node) {
      let filteredChildren = node.children !== undefined ? filter(node.children) : [];
      if (filteredChildren) {
        filteredChildren.map(treeTraverseHelper);
      }
      fn(node);
    }

    treeTraverseHelper(self.root);
  }

  function computeImageEntropies(node) {
    let start, end;
    let getQuadrantFn = function (d) {
      let img;
      if (d.img && d.quadrant === undefined) {
        img = isFunction(d.img) ? d.img(250) : d.img;
        d.quadrant = false; //To avoid recomputing
        shannon.getQuadrant(img, function (url, quad) {
          // dImgQuadrants.set(img, quad);
          d.quadrant = quad;

          d3.select("#node" + d.id).select(".nodeBG")
          // .transition()
          // .duration(1000)
            .style("background-position", nodeBGPosition(d));

          // console.log("Node " + d.id + " quad = " + quad);
        });
        // console.log(img);
      }
    };
    start = new Date().getTime();

    let filteredChildren = node.children !== undefined ? filter(node.children) :
      node._children !== undefined ? filter(node._children) : [];
    filteredChildren.map(getQuadrantFn);

    end = new Date().getTime();

    // console.log('Computing entropies ' + node.label + ' time: ' + (end - start));
  }

  self.update = function (root, _currentNode) {
    div.select("#spinner")
      .style("display", "none");

    if (root !== undefined)
      self.root = root;

    if (_currentNode !== undefined) {
      currentNode = _currentNode;
    } else {
      if (currentNode === undefined) {
        currentNode = self.root;
      } else {
        currentNode = findNodeWithId(currentNode.path);
        if (currentNode === undefined) {
          console.log("Couldn't find the previous currentNode");
          console.log(currentNode);
          currentNode = self.root;
        }
      }
    }

    // console.log("Update root:");
    // console.log(self.root);
    // console.log("Update currentNode:");
    // console.log(currentNode);

    treemap = getTreemap();
    if (self.zoomable()) {
      initialize(self.root);
      accumulate(self.root);
      // treemap.nodes(self.root);
      layout(self.root);
      // layout(currentNode);
    }

    //Draw, then animate
    let node = updateHelper(currentNode);
    updateImg(node);
    //LM Bug Fixed, the node text now does not disappear
    nodeAppendText(node);
    node.transition()
      .duration(750)
      .call(position)
      .each("end", function () {
        if (useShannon) {
          computeImageEntropies(currentNode);
        }
      });

    // nodeUpdate(node);
    // jumpInto(self.root);
    // jumpInto(currentNode);
    return self;
  };

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    let filteredChildren = filter(d.children);
    if (filteredChildren) {
      d._children = d.children;
      let accum = filteredChildren.reduce(function (p, v) {
        return p + accumulate(v);
      }, 0);
      if (accumulateValue) {
        d[value] = accum;
      }
    }
    return d[value];
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (filter(d._children)) {
      // treemap.size([d.dx, d.dy]);
      treemap.nodes({_children: filter(d._children)});
      filter(d._children).forEach(function (c) {
        //TODO: if we are passing the width/height such that the treemap knows the correct aspect ratio
        //this computation is not necessary
        // if (!showAsGrid) {
        //   c.x = d.x + c.x * d.dx;
        //   c.y = d.y + c.y * d.dy;
        //   c.dx *= d.dx;
        //   c.dy *= d.dy;
        // }
        c.x = d.x + c.x;
        c.y = d.y + c.y;

        c.parent = d;
        layout(c);
      });
    }
  }

  function name(d) {
    return d.parent !== undefined ?
      name(d.parent) + "." + d[label] :
      d[label];
  }

  function nodeBGPosition(d) {
    if (d.quadrant === undefined) {
      return "center";
    } else {
      // console.log("QUAD");
      // console.log(d.quadrant);
      if (d.quadrant === 0) {
        // return "top left";
        return "33% 33%";
      } else if (d.quadrant === 1) {
        // return "top right";
        return "66% 33%";
      } else if (d.quadrant === 2) {
        // return "bottom left";
        return "33% 66%";
      } else if (d.quadrant === 3) {
        // return "bottom right";
        return "66% 66%";
      } else {
        console.error("Weird quadrant = " + d.quadrant);
        // console.log(d);
        return "center";
      }
    }
  }

  function nodeEnter(sel) {
    // console.log("Node Enter");
    let nodeDiv = sel.enter()
      .append("div")
      .attr("class", function (d) {
        return "node";
      })
      .classed("leaf", function (d) {
        return !d._children;
      })
      .attr("id", function (d) {
        return "node" + d.id;
      })
      .on("mouseover", function (d, i) {
        // console.log(d);
        if (filter(d.children)) { //don't hover on parents
          return;
        }
        if (d.onMouseOver) {
          return d.onMouseOver(d, i, this);
        } else {
          // d3.select("#albums").classed("selected", true);
          d3.select(htmlID).classed("selected", true);
          d3.selectAll("#node" + d.id).classed("selected", true);
          if (self.growable) {
            growNode(d, i, this);
          }
        }
      })
      .on("mouseout", function (d, i) {
        if (filter(d.children)) { //don't hover on parents
          return;
        }
        if (d.onMouseOut) {
          return d.onMouseOut(d, i, this);
        } else {
          // d3.select("#albums").classed("selected", false);
          d3.select(htmlID).classed("selected", false);
          d3.selectAll(".node").classed("selected", false);
          if (self.growable) {
            shrinkNode(d, i, this);
          }
        }
      })
      .on("click", function (d, i) {
        if (filter(d.children)) { //for parents remove pointer events
          return;
        }
        if (self.zoomable()) {
          if (d.onClick) {
            d.onClick(d, i, this);
          }
          if (d._children) {
            jumpInto(d);
          } else {
            if (d3.event.shiftKey && d.sUrl) {
              window.open(d.sUrl, '_blank');
            } else if (d.url) {
              window.open(d.url, '_blank');
            }
          }

        } else {
          if (d.onClick) {
            return d.onClick(d, i, this);
          } else {
            if (d3.event.shiftKey && d.sUrl) {
              window.open(d.sUrl, '_blank');
            } else if (d.url) {
              window.open(d.url, '_blank');
            }
          }
        }
      })
      .each(function (d) {
        d.position = position;
        if (filter(d.children)) { //for parents remove pointer events
          d3.select(this)
            .style("pointer-events", "none")
            .selectAll("*").remove();
        }
      })
      .style("width", "0px")
      .style("height", "0px");

    //Tooltip
    // nodeDiv.filter(showLabel).attr("title", function (d) {
    //   return d[label] + "\n" + d[labelValue];
    // });

    nodeDiv.each(function (d) {
      if (filter(d.children)) {//Do not add the nodeText to the parent nodes
        return;
      }
      let nodeDiv = d3.select(this);
      nodeDiv.append("div")
        .attr("class", "nodeBG");
      nodeDiv.filter(showLabel)
        .call(nodeAppendText);
    });
    if (self.animationDuration()) {
      nodeDiv = nodeDiv.transition();
    }
    nodeDiv
      .call(position);
  } //nodeEnter

  function nodeUpdate(sel) {
    // nodeDiv.call(position);
    // console.log("Node Update");
    // sel.selectAll(".node")
    // sel.selectAll(".node")
    sel
    // .data(treemap.nodes)
      .classed("leaf", function (d) {
        return filter(d.children);
      });
    // if (self.animationDuration()) {
    //     sel = sel.transition();
    // }
    //Delete the labels from the ones that don't need it
    sel
      .filter(function (d) {
        return !showLabel(d);
      })
      .select(".nodeText")
      .remove();
    //Append the labels to the ones that need it
    sel
      .filter(showLabel)
      .select(".nodeText")
      .remove();
    sel
      .call(position);
    if (showNodeTextTitle) {
      d3.selectAll(".node").select(".nodeText").select(".nodeTextTitle")
        .html(function (d) {
          // return filter(d.children) ? null : d[label];
          return d[label];
        });
    }
    if (showNodeTextValue) {
      d3.selectAll(".node").select(".nodeText").select(".nodeTextValue")
        .html(function (d) {
          // return filter(d.children) ? null : d.labelValue;
          return d.labelValue;
        });
    }

    // .transition()
    // .duration(1500)
    // .style("font-size", function (d) { return d.children ? null : fScale(d[value]) + "em"; });
  } // nodeUpdate

  function nodeExit(sel) {
    // console.log("Node Exit");
    let nExit = sel.exit();
    // .style("opacity", "1")
    // .transition()
    // .duration(self.animationDuration() !== undefined ? self.animationDuration(): 750)
    // .style("opacity", 0);

    nExit.selectAll("*").remove();
    nExit.remove();
    // node.select(".nodeText").remove();
  } //nodeExit

  function nodeAppendText(sel) {
    sel
      .filter(showLabel)
      .append("div")
      .attr("class", "nodeText");
    sel
      .select(".nodeText")
      .style("font-size", function (d) {
        // LM: Fix Bug, the font size of the node text now is relative to the width of the node
        // console.log(d);
        const per = window.innerWidth / d.dx;
        return ((d.value + "").length)/per + "vw";
      });
    if (showNodeTextTitle) {
      sel.select(".nodeText")
        .append("span")
        .attr("class", "nodeTextTitle")
        .html(function (d) {
          // return filter(d.children) ? null : d[label];
          return d[label];
        });
    }
    if (showNodeTextValue) {
      sel.select(".nodeText")
        .append("span")
        .attr("class", "nodeTextValue")
        .html(function (d) {
          // return filter(d.children) ? null : d[labelValue];
          return d[labelValue];
        });
    }
  }

  self.jumpIntoRandom = function () {
    let options = [], i;
    //Treemap is not drawn yet
    if (!currentNode) {
      return;
    }
    //Build options with childrens and parent if they exist
    if (currentNode && currentNode.children) {
      for (i = 0; i < currentNode.children.length; i++) {
        if (currentNode.children[i]._children) {
          options.push(currentNode.children[i]);
        }
      }
    }
    if (currentNode && currentNode.parent) {
      for (i = 0; i < currentNode.children.length; i++) {
        // I add up many times the parent to give 50% chances of going up
        options.push(currentNode.parent);
      }
    }

    //Choose one node at random
    let randI = Math.floor(Math.random() * options.length);
    let randomNode = options[randI];

    if (randomNode) {
      // console.log("jumpIntoRandom jump into ");
      // console.log(randomNode);
      jumpInto(randomNode);
    } else {
      console.error("jumpIntoRandom couldn't find a node");
    }
  };


  function jumpInto(d) {
    let node = d;
    if (node.oldX) node.x = node.oldX;
    if (node.oldY) node.y = node.oldY;
    if (node.oldDx) node.dx = node.oldDx;
    if (node.oldDy) node.dy = node.oldDy;

    // //Disable the nodes from the old root
    // if (d.children) {
    //     d.children.forEach(disable);
    // }
    // disable(d);

    //Avoid jumping to more than one level depth at a time
    while (node.depth > currentDepth + 1) {
      node = node.parent;
    }
    currentNode = d;
    // console.log("Jump INTO ");
    // console.log(node);
    // console.log("jump into currentNode");
    // console.log(currentNode);
    jumpIntoHelper(node);
  }

  function addBaseDepth(d) {
    return div.insert("div", ".grandparent")
      .datum(d, function (d) {
        return d.id;
      })
      .attr("class", "depth");
  }

  let jumpIntoHelper = function (d) {
    if (transitioning || !d) return;

    if (d.onJumpInto) {
      d.onJumpInto(d);
    }
    currentDepth = d.depth;
    transitioning = true;
    // console.log("Transitioning " + d.id);
    // console.log(d);
    // grandparent
    //         .datum(d.parent, function (d) { return d.id; })
    //         .on("click", jumpIntoHelper)
    //         .text(name(d));
    let t1;
    if (oldDepth === undefined) {
      oldDepth = d3.selectAll(".depth");
    }
    t1 = oldDepth.transition().duration(ZOOM_TRANSITION_DURATION);

    //Mark the old depth as .oldDepth before creating the new depth
    d3.select(".depth").attr("id", "oldDepth");
    // oldDepth = d3.select(".depth").attr("id", "oldDepth");

    oldDepth = addBaseDepth(d);//The selection where the animation will work

    let g2 = updateHelper(d, oldDepth);
    let t2 = g2.transition().duration(ZOOM_TRANSITION_DURATION);

    // Update the domain only after entering new elements.
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    // // Enable anti-aliasing during the transition.
    // svg.style("shape-rendering", null);

    // // Draw child nodes on top of parent nodes.
    div.selectAll(".depth").sort(function (a, b) {
      return a.depth - b.depth;
    });

    // // Fade-in entering text.
    // g2.selectAll("text").style("fill-opacity", 0);

    // Transition to the new view.
    // t1.selectAll("text").call(text).style("fill-opacity", 0);
    // t2.selectAll("text").call(text).style("fill-opacity", 1);
    t1.selectAll(".node").call(position);
    t2.call(position);

    // nodeUpdate();
    t1.selectAll(".node").select(".nodeBG").style("opacity", 0);
    t1.selectAll(".node").style("opacity", 0);
    t2.select(".nodeBG").style("opacity", 1);
    // // Remove the old node when the transition is finished.
    t1.remove().each("end", function (sel) {
      // svg.style("shape-rendering", "crispEdges");
      transitioning = false;
      //Update the image after the animation ends
      // console.log("Transition finished");
      // g2.call(position);
      // console.log(sel);
      if (useShannon) {
        computeImageEntropies(d);
      }

    });

  }; //transition

  let drawBreadCrum = function (d) {
    let pathList = [];
    let tmpNode = d;

    //Create a list with all the ancestors of the current node d
    while (tmpNode !== undefined) {
      pathList.push(tmpNode);
      tmpNode = tmpNode.parent;
    }

    let breadCrums = d3.select(breadCrumsHtmlID)
      .selectAll(".breadCrum")
      .data(pathList.reverse());
    breadCrums.enter()
      .append("span")
      .attr("class", "breadCrum");
    breadCrums
      .on("click", jumpInto)
      .text(function (d, i) {
        return d[label].charAt(0).toUpperCase() + d[label].slice(1);
      })
      .each(function (d, i) {
        if (i < ( pathList.length - 1 )) {
          d3.select(this)
            .append("span")
            .attr("class", "breadCrumArrow")
            .text(" > ")
        }
      });

    breadCrums.exit()
      .remove();
  };

  let updateHelper = function (d, selection, doUpdate) {
    transitioning = false;
    self.currentRoot = d;
    drawBreadCrum(d);
    doUpdate = doUpdate === undefined ? true : doUpdate;
    d3.select("body").on("keydown", function (e) {
      if (self.zoomable() && d3.event.keyCode === 27) {
        jumpInto(self.currentRoot.parent !== undefined ? self.currentRoot.parent : self.root);
      }
    });

    //If not selection given use the current div
    if (selection === undefined) {
      if (self.zoomable()) {
        //Try getting the oldDepth
        if (oldDepth === undefined) {
          oldDepth = d3.selectAll(".depth");
        }

        //If there are no current depth create it
        if (oldDepth[0].length === 0) {
          oldDepth = addBaseDepth(d);
        }

        selection = oldDepth;
      } else {
        selection = div;
      }
    }

    let nodes;
    treemap.size([d.dx, d.dy]);
    let prevx = d.x, prevy = d.y;
    // if(self.zoomable()) {
    //     nodes = filter(d._children);
    // } else {
    nodes = treemap.nodes(d);
    // }
    // d._children.forEach(function (c) {
    //     c.x += prevx;
    //     c.y += prevy;
    // });

    let node = selection.selectAll(".node")
      .data(nodes, function (d) {
        return d.path + d.id;
      });
    // .data(nodes);

    // Draw child nodes on top of parent nodes.
    selection.selectAll(".depth").sort(function (a, b) {
      return a.depth - b.depth;
    });

    fScale.domain(d3.extent(nodes, function (d) {
      return d[value];
    }));

    if (self.chainedAnimations()) {
      //Chain the events nicely
      d3.transition().duration(500).each(function () {
        //Exit
        nodeExit(node);
      }).transition().duration(500).each(function () {
        //Update
        nodeUpdate(node);
      }).transition().duration(500).each(function () {
        //Enter
        nodeEnter(node);
      });
    } else {
      nodeExit(node);
      // TODO Find a better fix
      // nodeUpdate(node);
      nodeEnter(node);
    }

    treemap.size([width, height]);
    nodes = treemap.nodes(d);

    // // Update the domain only after entering new elements.
    // x.domain([d.x, d.x + d.dx]);
    // y.domain([d.y, d.y + d.dy]);
    // computeImageEntropies(d);
    return node;
  }; //updateHelper

  //Animate a node to make it grow to show the whole photo
  function growNode(n, i, ele) {
    // console.log("grow n.id" + n.id);
    let imageSrc = d3.select(ele)
      .select(".nodeBG")
      .style("background-image")
      .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
      .split(',')[0];

    // I just broke it up on newlines for readability
    let image = new Image();
    image.src = imageSrc;

    let width = image.width,
      height = image.height;

    let ratio = width / height;

    // if (n.dx > width) {
    //     width = n.dx;
    //     height = width/ratio;
    // }
    // if (n.dy > height) {
    //     height = n.dy;
    //     width = ratio*height;
    // }

    // console.log("children " + n.label + " id " + n.id + " x = " + n.x + " dx " + n.dx + " i " + n.i);
    n.oldDx = n.dx;
    n.oldDy = n.dy;
    n.oldX = n.x;
    n.oldY = n.y;
    n.dx = x.invert(image.width + x(n.x)) - n.x;
    n.dy = y.invert(image.height + y(n.y)) - n.y;
    // n.x = n.oldX - (n.dx - n.oldDx) / 2;
    // n.y = n.oldY - (n.dy - n.oldDy) / 2;

    d3.select(ele)
      .transition()
      .delay(100)
      .call(position);
  }

  //Animate a node to make it shrink back to normal
  function shrinkNode(n, i, ele) {
    // console.log("shrink n.id" + n.id);
    n.dx = n.oldDx;
    n.dy = n.oldDy;
    n.x = n.oldX;
    n.y = n.oldY;
    n.oldX = n.oldY = n.oldDx = n.oldDy = undefined;
    d3.select(ele).transition().call(position);
  }

  let updateImg = function (sel) {
    // console.log("updateImg");
    sel.select(".nodeBG")
      .style("background-position", nodeBGPosition)
      .style("background-image", function (d) {
        // if (d.children)
        //     return null;
        if (self.showPhotos && d.img) {
          if (isFunction(d.img)) {
            // return "url(" + String(d.img(d.dx)) + ")";
            return "url(" + String(d.img(Math.max(
              x(d.x + Math.max(0, d.dx)) - x(d.x),
              y(d.y + Math.max(0, d.dy)) - y(d.y)))) + ")";
          } else {
            return "url(" + String(d.img) + ")";
          }
        } else {
          return "";
        }
      });
  };

  let position = function (sel) {
    let originalSel = sel;

    if (self.animationDuration() !== undefined && self.animationDuration() !== 0) {
      sel = sel.transition()
        .duration(self.animationDuration() !== undefined ? self.animationDuration() : 750);
    }

    if (self.animationDuration() !== undefined && self.animationDuration() !== 0) {
      sel = sel.transition()
        .duration(self.animationDuration() !== undefined ? self.animationDuration() : 750);
    }

    //After transition if any
    sel
      .style("left", function (d) {
        return x(d.x) + self.padding() + "px";
      })
      .style("top", function (d) {
        return y(d.y) + self.padding() + "px";
      })
      .style("width", function (d) {
        return x(d.x + Math.max(0, d.dx)) - x(d.x) - self.padding() + "px";
      })
      .style("height", function (d) {
        return y(d.y + Math.max(0, d.dy)) - y(d.y) - self.padding() + "px";
      });
    sel.select(".nodeBG")
    // .style("background-size", function (d) {
    //         return Math.max(0, d.dx - 1) + "px " + Math.max(0, d.dy - 1) + "px";
    //     })
      .style("background-color", function (d) {
        return filter(d.children) ? null : color(d[label]);
      });

    sel.select(".nodeText")
    // .style("position", "relative");
    // .style("visibility", function (d) { return  (d.dx < MIN_SIZE_FOR_TEXT) ? "hidden" : "visible"; })
    // .style("left", function(d) { return (x(d.x + d.dx) - x(d.x) / 2)  + "px"; })

    if (self.zoomable()) {
      sel.select(".nodeText")
      // .style("left", function (d) {
      //   return 0 + "px";
      // })
      // .style("top", function (d) {
      //   return (y(d.y + d.dy) - y(d.y) - TEXT_HEIGHT ) / 2 + "px";
      // });
    } else {
      sel.select(".nodeText")
        .style("left", function (d) {
          return 0 + "px";
        })
        .style("top", function (d) {
          return (y(d.y + d.dy) - y(d.y) - TEXT_HEIGHT) + "px";
        });
    }
    // sel.select(".nodeTextTitle")
    //     .style("width", function(d) { return  x(d.x + d.dx) - x(d.x) + "px"; });
    updateImg(originalSel);
  };

  self.jumpInto = jumpInto;
  self.nodePosition = position;

  self.init();
  return self;
}