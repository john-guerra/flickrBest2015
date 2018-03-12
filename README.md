# PhotoTreemap

A library for displaying groups of photos with statistics on a TreeMap.

# Usage

### Imports
To start using the PhotoTreeMap you will need in your HTML a target element to display the tree, a target element to display the breadcrumbs and to import the following files: [PhotoTreeMap.js](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/PhotoTreeMap.js), [ShannonEntropy.js](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/ShannonEntropy.js), [d3.v3.js](http://d3js.org/d3.v3.min.js), [jquery-3.3.1.js](https://code.jquery.com/jquery-3.3.1.min.js) and [defaultStyles.css](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/css/defaultStyles.css).

### Imports Example

```html
<head>
<link rel="stylesheet" href="https://cdn.rawgit.com/john-guerra/photoTreemap/b695caed7b139317ae78b49feaff3ab19bb1ff47/source/css/defaultStyles.css">
</head>
...
  <div class="mainContainer">
    <div id="breadcrumbs"></div>
    <div id="target"></div>
  </div>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/b695caed7b139317ae78b49feaff3ab19bb1ff47/source/ShannonEntropy.js"></script>
  <script src="https://cdn.rawgit.com/john-guerra/photoTreemap/b695caed7b139317ae78b49feaff3ab19bb1ff47/source/PhotoTreeMap.js"></script>
```
## Hierarchy
Before create the PhotoTreeMap you need to create the Hierarchy to display. A Hierarchy is the root Node of the tree, each Node must have at least the following properties:
* id \<String> : ID of the node.
* value \<Number> : Value of the node, this will be used to sort the nodes and they will be displayed depending on it.
* label \<String> : Text to be displayed in each Node.

Each Node with children should have the children property.

* children \<Array\<Node>> : An array with nodes, which represent the node's children.

In addition, the leaves or the nodes which represents a category must to have the property img.

* img \<String> : Source of the image of the Node, the root Node should not have img.

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

| Name                  | Type                  |  Description |
| -------------         |-------------          | -----                            |
| breadCrumsHtmlID      | string                | ID of the element in which will be displayed the breadcrumbs.|
| zoomable              | boolean               | Allows the PhotoTreeMap to be zoomable. If it is false, all the images will be showed at the same time.|
| height                | number                | Set the height in pixels of the PhotoTreeMap.|
| width                 | number                | Set the width in pixels of the PhotoTreeMap.|
| chainedAnimations     | boolean               | Allows the PhotoTreeMap to chain its animations.|
| animationDuration     | number                | Set the duration of the animations.|
| padding               | number                | Set the padding in pixels of the PhotoTreeMap.|
| sort                  | string                | Set the property used to sort the Nodes, as default they are sorted by the property value.|
| value                 | string                | Set the property used as value of the Nodes, as default their value is the property value.|
| label                 | string                | Set the property shown as label, as default the property showed is label.|
| labelValue            | string                | Set the property shown as label value, as default the property showed is labelValue.|
| showLabel             | boolean               | Enable or disable the display of labels in the Nodes.|
| useShannon            | boolean               | Enable the PhotoTreeMap to use ShannonEntropy, it allows the Nodes to display the most relevant part of the image.|

Finally, bind the data with the PhotoTreeMap by calling the update function and send as param the root of the hierarchy to display.
| update                |Hierarchy              | Bind the hierarchy with the PhotoTreeMap.

## Setup Example

```javascript
// Create a new photoTreemap, setup and finally add the data
let photoTreemap = new TreeMap("#target")
    .breadCrumsHtmlID('#breadcrumbs')
    .zoomable(true)
    .update(root);
```

## Styles
The PhotoTreeMap as default have styles defined in [defaultStyles.css](https://raw.githubusercontent.com/john-guerra/photoTreemap/master/source/css/defaultStyles.css). However, you can override these styles, the classes used are: .node, .leaf, .nodeText, .nodeTextTitle, .nodeTextValue and .nodeBG.

# Examples
 
## Basic Example

![Basic Example](https://github.com/john-guerra/photoTreemap/blob/master/examples/demos/PTMDemoBasicExample1.gif?raw=true "PhotoTreeMap Basic Example Demo 1")

This [Basic Example](https://github.com/john-guerra/photoTreemap/tree/master/examples/basic) create a PhotoTreeMap with minimum configuration and with a small hierarchy.
