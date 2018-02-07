/*jslint browser: true, indent: 4 */
/* global d3: false, $: false, alert: false, TreeMap: false , FlickrUtils: true, console: true, utils: true */

//Main
(function () {
    "use strict";

    var TOP_PHOTOS = 50,
        MAX_treeMap = 1,
        NUM_PAGES = 5,
        NUM_PHOTO_PER_CATEGORY = 25;

    var dateFmt = d3.time.format("%Y-%m-%d");

    var treeMap,
    animals,
    dAnimalFreq,
    firstTry = true,
    sortBy = "views",
    showPhotos = true,
    showLabels = true,
    showTreemap = true,
    autopilot = false,
    autopilotTimer = 60, //in seconds
    autopilotIntervalId,
    zoomable = true,
    url = "getTree",
    maxLeafs = 20,
    searchKWD = "",
    globe = new Carto("#globe", onClickMap),
    hierarchy = ["TYPE", "NAME", "PHOTOID"],
    nodesMap = d3.map();

    globe.height = 200;

    if(utils.getParameterByName("showTreemap") !== undefined && utils.getParameterByName("showTreemap") !== "") {
        showTreemap = (utils.getParameterByName("showTreemap") === "true");
    }
    if(utils.getParameterByName("showLabels") !== undefined && utils.getParameterByName("showLabels") !== "") {
        showLabels = (utils.getParameterByName("showLabels") === "true");
    }
    if(utils.getParameterByName("hierarchy") !== undefined && utils.getParameterByName("hierarchy") !== "") {
        hierarchy = utils.getParameterByName("hierarchy").split("/");
    }
    if(utils.getParameterByName("zoomable") !== undefined && utils.getParameterByName("zoomable") !== "") {
        zoomable = (utils.getParameterByName("zoomable") === "true");
    }
    if(utils.getParameterByName("maxLeafs") !== undefined && utils.getParameterByName("maxLeafs") !== "") {
        maxLeafs = utils.getParameterByName("maxLeafs");
    }
    if(utils.getParameterByName("searchKWD") !== undefined && utils.getParameterByName("searchKWD") !== "") {
        searchKWD = utils.getParameterByName("searchKWD");
    }
    if(utils.getParameterByName("url") !== undefined && utils.getParameterByName("url") !== "") {
        url = utils.getParameterByName("url");
    }

    if(utils.getParameterByName("autopilot") !== undefined && utils.getParameterByName("autopilot") !== "") {
        autopilot = utils.getParameterByName("autopilot") === "true";
        d3.select("#checkAutopilot").property("checked", autopilot);
    }

    if(utils.getParameterByName("autopilotTimer") !== undefined && utils.getParameterByName("autopilotTimer") !== "") {
        autopilotTimer = utils.getParameterByName("autopilotTimer");
    }

    d3.select("#checkShowTreemap").property("checked", showTreemap).on("change", updateAll);
    // d3.select("#checkZoomable").property("checked", zoomable).on("change", function () {
    //         zoomable = d3.select("#checkZoomable").property("checked");
    //         showLabels != zoomable;
    //         treeMap.zoomable = zoomable;
    //         treeMap.init();
    //         updateAll();
    //         });
    d3.select("#searchKWD").property("value",searchKWD).on("search", updateAll);
    d3.select("#checkAutopilot").on("change", onChangeAutopilot);


    function getParams() {
        console.log("getParams");

        autopilot = d3.select("#checkAutopilot")[0][0]!== null ? d3.select("#checkAutopilot").property("checked") : autopilot;
        showTreemap = d3.select("#checkShowTreemap").property("checked");
        // zoomable = d3.select("#checkZoomable").property("checked");
        searchKWD = d3.select("#searchKWD").property("value");
        utils.setGetParameter("showTreemap", showTreemap);
        utils.setGetParameter("showLabels", showLabels);
        utils.setGetParameter("hierarchy", hierarchy.join("/"));
        utils.setGetParameter("zoomable", zoomable);
        utils.setGetParameter("maxLeafs", maxLeafs);
        utils.setGetParameter("searchKWD", searchKWD);
        utils.setGetParameter("autopilot", autopilot);
        utils.setGetParameter("autopilotTimer", autopilotTimer);

    }

    function getAttribForTreemap() {
        return showTreemap ? "value" : "allones";
    }

    function updateAll() {
        console.log("Update");
        getParams();

        nodesMap = d3.map();
        // colorDateButtons();

        var children;

        d3.select("#mainContainer")
            .classed("showAllLabels", showLabels ? true : false);





        var attrib = getAttribForTreemap();
        var csvToTree = new CSVtoTree("@", "NAME", "value", "img");
        csvToTree.maxLeafs = maxLeafs;
        // var tree = csvToTree.getTreeWithHierarchy(animals, hierarchy);
        var tree = csvToTree.getTreeWithPath(animals, "path");

        tree = filterTree(tree, searchKWD);
        tree = specialFilterForBartsDuplicatedNodes(tree);

        // csvToTree.accumulate(tree);
        propagateImgs(tree);
        // if (showTreemap) {
        //     treeMap.sort("value");
        // } else {
        //     treeMap.sort("path");
        // }

        treeMap.value("numChildren");
        treeMap.showPhotos = showPhotos;

        treeMap.showAsGrid(!showTreemap);


        treeMap.update(tree);
    }


    //Filter the tree
    function filterTree(tree, searchKWD) {
        function copyNode(node) {
            var newNode = {};
            for (var a in node) {
                if (node.hasOwnProperty(a))
                    newNode[a] = node[a];
            }
            return newNode;
        }
        searchKWD = searchKWD.toUpperCase().trim();

        function filterHelper(d) {
            //If the node itself has the keyword return it as it
            if (d.label && d.label.toUpperCase().search(searchKWD) !== -1) {
                return d;
            } else {
                //If the node's children have the keyword return it
                if (d.children || d._children) {
                    var newNode = copyNode(d);
                    if (d.children) {
                        newNode.children = d.children.map(filterHelper).filter(function (e) { return e!==false; });
                        if (newNode.children.length === 0 && newNode.path !== "")
                            return false;
                    }
                    if (d._children) {
                        newNode._children = d._children.map(filterHelper).filter(function (e) { return e!==false; });
                        if (newNode._children.length === 0 && newNode.path !== "")
                            return false;
                    }
                    return newNode;
                } else {
                    return false;
                }
            }
        }

        //Force the search even for empty strings to remove leafs from nodes that have other leaves
        if (searchKWD === "")
            return tree;
        else
            return filterHelper(tree);
    }

    function specialFilterForBartsDuplicatedNodes(tree) {
        function copyNode(node) {
            var newNode = {};
            for (var a in node) {
                if (node.hasOwnProperty(a))
                    newNode[a] = node[a];
            }
            return newNode;
        }

        function filterOutLeaves(children) {
            var nonLeafChildren = children.filter(function (d) {
                return d.children || d._children;
            });


            //Are there children with non leafs, then don't show the leafs;
            if (nonLeafChildren.length !== 0 && children.length !== nonLeafChildren.length) {
                return nonLeafChildren;
            } else {
                return children;
            }
        }



        function specialFilterHelper(d) {
            if (d.children || d._children) {
                var newNode = copyNode(d);
                if (d.children) {
                    newNode.children = d.children.map(specialFilterHelper).filter(function (e) { return e!==false; });
                    if (newNode.children.length === 0 && newNode.path !== "")
                        return false;

                    newNode.children = filterOutLeaves(newNode.children);
                }
                if (d._children) {
                    newNode._children = d._children.map(specialFilterHelper).filter(function (e) { return e!==false; });
                    if (newNode._children.length === 0 && newNode.path !== "")
                        return false;

                    newNode._children = filterOutLeaves(newNode._children);
                }
                return newNode;
            } else {
                return d;
            }
        }

        return specialFilterHelper(tree);
    }

    function getBestChildren(d) {
        var countAttr = "SCORE";

        d.children = d.children.sort(function (a, b) {
            if (a[countAttr] !== undefined) {
                return d3.descending(a[countAttr], b[countAttr]);
            } else {
                return d3.descending(a.value, b.value);
            }
        });


        return d.children[0];
    }

    function propagateImgs(d) {
        var bestC;
        if (d.children && d.children.length>0) {
            d.children.forEach(propagateImgs);
            bestC = getBestChildren(d);
            d.img = bestC.img;
            d.url = bestC.url;

        }
        nodesMap.set(d.label, d);
        // d.value = d.children ? d.children.length : 1;

        d.onJumpInto = function (e) {
            if (globe){
                if (d.depth === 0) {
                    globe.reset();
                }
                if (!globe.rotateTo(d.label) && d.node) { //Try by name or else by lat long

                    if (globe.rotateToBoundingBox!== undefined && d.node.LONMIN && d.node.LATMIN &&  d.node.LONMAX && d.node.LATMAX) {
                        globe.rotateToBoundingBox(d.label, d.node.LONMIN, d.node.LATMIN,  d.node.LONMAX, d.node.LATMAX);
                    } else if (globe.rotateToLatLong!== undefined && d.node.LONCTR && d.node.LATCTR) {
                        globe.rotateToLatLong(d.label, d.node.LONCTR, d.node.LATCTR, (150 + (150 * d.depth)) );
                    }
                }
            } else {
                console.log("Not lat long");
                console.log(d);
            }
        };
        d.labelValue = "# photos: " +  Math.round( d.numChildren);
        d.url = d.node && d.node.url;
        d.allones = 1;
        return d.img;
    }


    function onClickMap(name) {
        if (nodesMap.has(name)) {
            treeMap.jumpInto(nodesMap.get(name));
        }

    }


    function treeCallback (err, data) {
        // var dFamilies = d3.map();



        data.forEach(function (d, i) {
            d.allones = 1;
            d.id = i;
            d.value= +d.SCORE;
            d.labelValue= 1;
            d.NAME = d.NAME.replace((/\ /g), "_");
            d.path = d.NAME + "@" + d.PHOTOID;
            // if (d.value > 20) {
            //     d.value /= 20;
            // } else {
            //     d.value = 1;
            // }
            // d.FARM = (+d.SERVER.slice(0, 1)) + 1;

            d.img = function (width) { return FlickrUtils.getImgForPhoto(d.PHOTOID, d.SERVER, d.FARM, d.SECRET, width); };
            d.url = FlickrUtils.getUrlForPhoto(d.PHOTOID, d.USERNSID);
        });

        animals = data;
        // tree = new CSVtoTree("_", "Name", "allones", "img")
        //     .getTreeWithHierarchy(data, ["Genus","Species"]);

        updateAll();
        onChangeAutopilot();

        // globe.rotateTo("United States");
        //Init the globe
        // globe.rotateToLatLong("", -103, 48);
        globe.reset();
    }

    function reloadData() {
        reInittreeMap();

        treeMap.loading();


        // d3.json(url, treeCallback);
        d3.csv("data.csv", treeCallback);


    }




    function reInittreeMap() {
        //Delete the old treeMap
        d3.select("#mainContainer")
            .selectAll(".treemapContainer")
            .remove();

        var treeMapHeight = $(window).height() - document.getElementById("mainContainer").offsetTop - 50;


        d3.select("#mainContainer")
            .append("div")
            .attr("class", "treemapContainer")
            .attr("id", "mainContainer");
        treeMap = new TreeMap("#mainContainer")
            .breadCrumsHtmlID("#breadCrums")
            .labelValue("labelValue")
            .showLabel(function (d) { //don't show labels on leafs
                return d.children || d._children;
            })
            .padding(function (d) { return d.children || d._children ? 8 : 0; })
            .sort("numChildren");
        treeMap.height = treeMapHeight;

        treeMap.zoomable = zoomable;

        showLabels != zoomable;

        treeMap.chainedAnimations = false;
        treeMap.animationDuration = 0;


        treeMap.init();


        window.onresize = onResize;

    }


    function onResize(event) {
        console.log("on Resize");

        var treeMapHeight = $(window).height() - document.getElementById("mainContainer").offsetTop - 50;

        treeMap.height = treeMapHeight;
        treeMap.updateWindowSizes();
        treeMap.update();
    }


    function jumpIntoRandom() {


        treeMap.jumpIntoRandom();

    }

    function onChangeAutopilot(event) {


        console.log("Change autopilot");
        getParams();

        if (autopilot) {
            console.log("Starting autopilot timer");
            autopilotIntervalId = setInterval(jumpIntoRandom, autopilotTimer*1000);
        } else {
            if (autopilotIntervalId!==undefined) {
                console.log("Stopping autopilot timer");
                clearInterval(autopilotIntervalId);
            }
        }
    }




    reloadData();




}()); //main
