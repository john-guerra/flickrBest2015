# PhotoTreemap

A library for displaying groups of photos with statistics on a TreeMap.

# Usage

### Import
To start using the PhotoTreeMap you will need in your HTML a target element to display the tree, a target element to display the breadcrumbs and to import the following files: [PhotoTreeMap.js](https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js), [ShannonEntropy.js](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js), [d3.v3.js](http://d3js.org/d3.v3.min.js) and [jquery-3.3.1.js](https://code.jquery.com/jquery-3.3.1.min.js)

### Import Example

```html
  <div class="mainContainer">
    <div id="breadcrumbs"></div>
    <div id="target"></div>
  </div>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js"></script>
```
## Hierarchy
Before create the PhotoTreeMap you need to create the Hierarchy to display. A Hierarchy is the root Node of the tree, each Node must have at least the following properties:
* id \<String> : ID of the node.
* value \<Number> : Value of the node, this will be used to sort the nodes and they will be displayed depending on it.
* label \<String> : Text to be displayed in each Node.

Each Node with children should have the children property.

* children \<Array\<Node>> : An array with nodes, which represent the node's children.

In addition, the leaves or the nodes which represents a category must to have the property img.

* img \<Strig> : Source of the image of the Node, the root Node should not have img.

### Hierarchy Example

```javascript
// Root Node of the Hierarchy
 const root = {
    id: "root",
    value: 120,
    label:'Animals',
    children: [
      {
        id: "Children1",
        value: 10,
        label:'Fish',
        img: "https://images.unsplash.com/photo-1513570050319-4797c2aef25e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9a0e774d1c6dc64d2db999ac99fd5dd0&auto=format&fit=crop&w=1079&q=80",
      },
      {
        id: "Children2",
        value: 10,
        label:'Bug',
        img: "https://images.unsplash.com/photo-1519167734660-d1a18d66190b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cfde3f91a1c44c82fc604ffc2bf5af19&auto=format&fit=crop&w=1049&q=80",
      },
      {
        id: "Children3",
        value: 50,
        label:'Bird',
        img: "https://images.unsplash.com/photo-1482330625994-3bb3c90a5d05?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e0ead9e00f1af258d880308b9a0af37b&auto=format&fit=crop&w=1052&q=80",
      },
      {
        id: "Children4",
        value: 50,
        label:'Felines',
        img: "https://images.unsplash.com/photo-1507984211203-76701d7bb120?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=eacbf50fac29a13afba26ad7499cedee&auto=format&fit=crop&w=1052&q=80",
        children: [
          {
            id: "Children5",
            value: 20,
            label:'Cat',
            img: "https://images.unsplash.com/photo-1507984211203-76701d7bb120?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=eacbf50fac29a13afba26ad7499cedee&auto=format&fit=crop&w=1052&q=80"
          },
          {
            id: "Children6",
            value: 30,
            label:'Tiger',
            img: "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9da9e3aa07ca3d4d09a08ec168815d68&auto=format&fit=crop&w=1050&q=80"
          },
        ],
      }
    ],
  };
```
## Setup

Now you will need to create a new TreeMap and setup it. All possible configurations are applicable using a chaining approach, so each function return the PhotoTreeMap itself. All functions (configurations) are optional and listed below:
* breadCrumsHtmlID (ID \<String>) : ID of the element in which will be displayed the breadcrumbs.
* zoomable (enabled \<Boolean>) : Allows the PhotoTreeMap to be zoomable. If it is false, all the images will be showed at the same time.
* height (height \<Number>)  : Set the height in pixels of the PhotoTreeMap. 
* width (width \<Number>)  : Set the width in pixels of the PhotoTreeMap.
* chainedAnimations (enabled \<Boolean>) : Allows the PhotoTreeMap to chain its animations.
* animationDuration (duration \<Number>) : Set the duration of the animations.
* padding (padding \<Number>) : Set the padding in pixels of the PhotoTreeMap.

Finally, bind the data with the PhotoTreeMap by calling the update function and send as param the root of the hierarchy to display.
* update (root \<Hierarchy>) : Bind the hierarchy with the PhotoTreeMap.

## Setup Example

```javascript
// Create a new photoTreemap, setup and finally add the data
let photoTreemap = new TreeMap("#target")
    .breadCrumsHtmlID('#breadcrumbs')
    .zoomable(true)
    .update(root);
```

## Styles
Finally, you need to define a proper style for the PhotoTreeMap. In order to do it, you should define styles for .node, .leaf, .nodeText, .nodeTextTitle, .nodeTextValue and .nodeBG. 

## Styles Example

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
.mainContainer{
      width: fit-content;
      height: fit-content;
      margin: auto;
}
```