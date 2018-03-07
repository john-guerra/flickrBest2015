# PhotoTreemap

A library for displaying groups of photos with statistics on a TreeMap.

# Usage

To start using the PhotoTreeMap you will need in your HTML a target element to display the tree, a target element to display the breadcrumbs and to import the following files: [PhotoTreeMap.js](https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js), [ShannonEntropy.js](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js), [d3.v3.js](http://d3js.org/d3.v3.min.js) and [jquery-3.3.1.js](https://code.jquery.com/jquery-3.3.1.min.js)

## Example

```html
  <div id="breadcrumbs"></div>
  <div id="target"></div>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js"></script>
```

Before create the PhotoTreeMap you need to create the Hierarchy to display. A Hierarchy is the root Node of the tree, each Node must have at least the following properties:
* id \<String> : ID of the node.
* value \<Number> : Value of the node, this will be used to sort the nodes and they will be displayed depending on it.
* label \<String> : Text to be displayed in each Node.

Each Node with children should have the children property.

* children \<Array\<Node>> : An array with nodes, which represent the node's children.

In addition, the leaves or the nodes which represents a category must to have the property img.

* img \<Strig> : Source of the image of the Node, the root Node should not have img.

## Example

```javascript
// Root Node of the Hierarchy
const root = {
    id: "root",
    value: 120,
    label:'LabelRoot',
    children: [
      {
        id: "Children1",
        value: 10,
        label:'Label1',
        img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg",
      },
      {
        id: "Children2",
        value: 10,
        label:'Label2',
        img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg",
      },
      {
        id: "Children3",
        value: 50,
        label:'Label3',
        img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/3fee8b7eb40ba438c02bedffe74eb197/5B2D3365/t51.2885-15/e35/26072072_205501003340388_8879725742087208960_n.jpg",
      },
      {
        id: "Children4",
        value: 50,
        label:'Label4',
        img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg",
        children: [
          {
            id: "Children5",
            value: 25,
            label:'Label5',
            img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg"
          },
          {
            id: "Children6",
            value: 25,
            label:'Label6',
            img: "https://instagram.fbog4-1.fna.fbcdn.net/vp/4c06e947198a45daf087f9a6c8ea3d2c/5B103BC9/t51.2885-15/e35/25010558_961562707324535_8861611580077375488_n.jpg"
          },
        ],
      }
    ],
  };
```

Now you will need to create a new TreeMap and setup it. All possible configurations are applicable using a chaining approach, so each function return the PhotoTreeMap itself. All functions (configurations) are listed below:
* height (height \<Number>)  : Set the height in pixels of the PhotoTreeMap. 
* width (width \<Number>)  : Set the width in pixels of the PhotoTreeMap.
* chainedAnimations (enabled \<Boolean>) : Allows the PhotoTreeMap to chain its animations.
* animationDuration (duration \<Number>) : Set the duration of the animations.
* zoomable (enabled \<Boolean>) : Allows the PhotoTreeMap to be zoomable.
* padding (padding \<Number>) : Set the padding in pixels of the PhotoTreeMap.
* breadCrumsHtmlID (ID <String>) : ID of the element in which will be displayed the breadcrumbs.

Bind the data with the PhotoTreeMap by calling the update function and send as param the root of the hierarchy to display.
update (root \<Hierarchy>) : Bind the hierarchy with the PhotoTreeMap.

## Example

```javascript
// Create a new photoTreemap, setup and finally add data to the PhotoTreeMap
let photoTreemap = new TreeMap("#target");
  photoTreemap
    .height(600)
    .width(600)
    .chainedAnimations(false)
    .animationDuration(0)
    .zoomable(true)
    .padding(0)
    .breadCrumsHtmlID('#breadcrumbs')
    .init()
    .update(root);
```
Finally, you need to define a proper style for the PhotoTreeMap. In order to do it, you should define styles for .node, .leaf, .nodeText, .nodeTextTitle, .nodeTextValue and .nodeBG. 

## Example

```css
.node {
  line-height: 1;
  overflow: hidden;
  position: absolute;
  text-indent: 2px;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.50);
}
.nodeText {
  width: 100%;
  background: rgba(51, 51, 51, 0.37);
  font-size: 14px;
  color: #FFFFFF;
  line-height: 16px;
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
.node.leaf {
  border-radius: 0;
  box-shadow: none;
}
.nodeBG {
  /*z-index: -1;*/
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
.showAllLabels .nodeText {
  visibility: visible;
}
.node:hover .nodeText {
  opacity: 1.0;
  visibility: visible;
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