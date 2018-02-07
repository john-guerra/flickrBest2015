var CSVtoTree = function (path_separator, name, size, img, numAttribs){
	var self = this;
	var sep = path_separator=== undefined ? "~" : path_separator;
	numAttribs = numAttribs !== undefined ? numAttribs : [];

	self.maxLeafs = undefined;

	var dNodes;
	var root = {
		"label": "World",
		"path": "",
		"id": "",
		"value": 0,
		"numChildren": 1,
		"children": [],
		"node":{}
	};

	dNodes = d3.map();
	dNodes.set('', root);

	function addChildren(parent, path, d) {
		var node = {
			// "label": d!== undefined && name!== undefined ? d[name] : path[path.length-1],
			"label": path[path.length-1].replace("_", " "),
			"path": path.join(path_separator),
			"value": 0,
			"numChildren": 1
		};

		// node.id = path.join(path_separator).replace(/\@/g, "_") + "_" + node.label;
		node.id = path.join(path_separator).replace(/\@/g, "_");


		if (d!== undefined && size!==undefined)  node.value = d[size];
		if (d!== undefined && img!==undefined)  node.img = d[img];
		numAttribs.forEach(function (a) {
			if (d!== undefined && d[a]!==undefined)
				node[a] = d[a];
		});

		if (d!==undefined) {
			node.node = d;
		}

		if (parent.children === undefined) {
			parent.children = [];
		}
		parent.children.push(node);
		dNodes.set(path.join(path_separator), node);
		return node;
	}

	function getNodeOrCreate(path , d) {
		var node, parent;
		if (dNodes.has(path.join(path_separator))) {
			node = dNodes.get(path.join(path_separator));
		} else {
			parent = getNodeOrCreate(path.slice(0, path.length - 1 ));
			node = addChildren(parent, path, d);
		}
		if (d !== undefined) {
			node.node = d;
		}
		return node;
	}

	function limitLeafs(node) {
		if (self.maxLeafs===undefined) {
			return;
		}

		var childrenLeafs, childrenNonLeaf;

		if (node.children) {
			node.children.forEach(function (c) { limitLeafs(c); });

			childrenLeafs = node.children.filter(function (d) { return !d.children; });
			childrenNonLeafs = node.children.filter(function (d) { return d.children; });

			node.children = childrenNonLeafs.concat(childrenLeafs.slice(0, self.maxLeafs));
		}

	}

    function accumulate(d, value) {
    	value = (value !== undefined) ? value : "value";
        if (d.children && d.children.length !== 0) {
            d[value] = d.children.reduce(function(p, v) { return p + accumulate(v, value); }, 0);
        }
        return d[value];
    }


	self.getTreeWithHierarchy = function (csv, hierarchy) {
		function getPath(n) {
			return hierarchy.map(function (h) { return n[h]; });
		}
		csv.forEach(function (d) {
			var path = getPath(d);
			var parent = getNodeOrCreate(path.slice(0, path.length - 1 ), d);
			addChildren(parent,  path, d);
		});

		accumulate(root, "numChildren");
		limitLeafs(root);
		return root;
	}; //self.getTreeWithHierarchy


	self.getTreeWithPath = function (csv, path) {
		if (path===undefined) {
			path = "path";
		}
		function getPath(n) {
			return n[path].split(path_separator);
		}

		csv.forEach(function (d) {
			var path = getPath(d);
			var parent = getNodeOrCreate(path.slice(0, path.length - 1 ), d);
			addChildren(parent,  path, d);
		});

		limitLeafs(root);
		accumulate(root, "value");
		accumulate(root, "numChildren");
		numAttribs.forEach(function (a) {
			accumulate(root, a);
		});
		return root;
	}; //self.getTreeWithPath

	return self;
};

