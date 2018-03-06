# PhotoTreemap

A library for displaying groups of photos with statistics on a TreeMap.

# Usage

To start using the PhotoTreeMap you will need in your HTML a target element and to import the following files: [PhotoTreeMap.js](https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js), [ShannonEntropy.js](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js), [d3.v3.js](http://d3js.org/d3.v3.min.js) and [jquery-3.3.1.js](https://code.jquery.com/jquery-3.3.1.min.js)

## Example

```html
  <div id="target"></div>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js"></script>
```

Before create the PhotoTreeMap you need to create the Hierarchy to display. A Hierarchy is the root Node of the tree, each Node must have at least the following properties:
* id \<String> : ID of the node.
* value \<Number> : Value of the node, this will be used to sort the nodes and they will be displayed depending on it.
* children \<Array\<Node>> : An array with nodes, which represent the node's children.

In addition, the leaves or the nodes which represents a category must to have the property img.
* img \<Strig> : Source of the image.

## Example

```javascript
// Root Node of the Hierarchy
const root = {
  id:"root",
  value:10,
  children:[
    {id:"Children1", img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg", value:10},
    {id:"Children2", img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg", value:10},

    {id:"Children3", img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg", value:50},
    {
      id:"more",
      value:50,
      img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg", 
      children : [
        {id:"Children4", img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg", value:25},
        {id:"Children5", img:"https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg", value:25},
      ], 
    }
  ]
};
```

Now you will need to create a new TreeMap and setup it. All possible configurations are applicable using a chaining approach, so each function return the PhotoTreeMap itself. All functions (configurations) are listed below:
* height (height \<Number>)  : Set the height in pixels of the PhotoTreeMap 
* width (width \<Number>)  : Set the width in pixels of the PhotoTreeMap
* chainedAnimations (enabled \<Boolean>) : Allows the PhotoTreeMap to chain its animations.
* animationDuration (duration \<Number>) : Set the duration of the animations.
* zoomable (enabled \<Boolean>) : Allows the PhotoTreeMap to be zoomable.
* padding (padding \<Number>) : Set the padding in pixels of the PhotoTreeMap.

Bind the data with the PhotoTreeMap by calling the update function and send as param the root of the hierarchy to display.
update (root \<Hierarchy>) : Bind the hierarchy with the PhotoTreeMap.

## Example

```javascript
// Create a new photoTreemap and setup
let photoTreemap = new TreeMap("#target")
photoTreemap.height = 600;
photoTreemap.width = 600;
photoTreemap.chainedAnimations = false;
photoTreemap.animationDuration = 0;
photoTreemap.zoomable = true;
photoTreemap.init();

photoTreemap.labelValue("value").padding(function (d) { return 10; });
// Add data to the tree
photoTreemap.update(root);
```
Finally, you need to define a proper style for the PhotoTreeMap.

## Example

```css
.node {
      line-height: 1;
      overflow: hidden;
      position: absolute;
      text-indent: 2px;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 5px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
    }
    .node.leaf {
      border-radius: 0;
      box-shadow: none;
    }
    .nodeText {
      width: 100%;
      background: rgba(51, 51, 51, 0.37);
      font-size: 14px;
      color: #FFFFFF;
      line-height: 16px;
    }
    .showAllLabels .nodeText {
      visibility: visible;
    }
    .nodeText img {
      height: 10px;
      pointer-events: none;
      margin-top: 2px;
    }
    .nodeTextTitle {
      height: 20px;
      font-family: Arial-BoldMT;
      font-size: 10pt;
      overflow: hidden;
    }
    .nodeTextValue {
      font-family: Arial;
      font-size: 10pt;
    }
    .node:hover .nodeText {
      opacity: 1.0;
      visibility: visible;
    }
    .nodeBG {
      opacity: 1.0;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .node.leaf:hover {
      cursor: pointer;
    }
    .node.leaf:hover .nodeBG {
      border-color: steelblue;
      border-style: solid;
      border-width: 2px;
    }
    .node.leaf:hover {
      z-index: 10;
    }
```