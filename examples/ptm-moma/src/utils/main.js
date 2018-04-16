const d3 = window.d3;
let photoTreemap;
let mainTree;
const file = './data/moma.csv';
let data = null;
const config = {
  width: window.innerWidth * 0.7,
  height: (window.innerHeight * 0.8) - 20,
  padding: 0,
  value: 'value',
  label: 'label',
  zoomable: true,
  showLabel: true,
  userShannon: false
};

let oldGroupingProperties = [];

//Init the photoTreeMap
export async function initPhotoTreeMap(groupingProperties) {
  //If needed delete old PhotoTreeMap
  document.getElementById('main-container').innerHTML = `<div id="breadcrumbs"></div> <div id="target"></div>`;

  //Update properties
  oldGroupingProperties = groupingProperties ? groupingProperties : oldGroupingProperties ;
  //Create the PhotoTreeMap
  photoTreemap = new window.TreeMap("#target");
  //Setup the PhotoTreeMap
  photoTreemap
    .breadCrumsHtmlID('#breadcrumbs')
    .padding(config.padding)
    .width(config.width)
    .height(config.height)
    .value(config.value)
    .label(config.label)
    .zoomable(config.zoomable)
    .showLabel(config.showLabel)
    .useShannon(config.userShannon);
  // console.log(config);
  //Create the hierarchy and update
  await readFile(file);
  await updatePhotoTreeMap(groupingProperties ? groupingProperties : oldGroupingProperties);
  updateDNDTree(mainTree);
}

export async function readFile (file){
  return new Promise((resolve, reject) => {
    d3.csv(file, (csv_data) => {
      data = csv_data;
      resolve(csv_data);
    })
  });
};

export async function createHierarchyWithGroupingProperties (groupingProperties) {
  return new Promise((resolve, reject) => {
    let nested_data = d3.nest();
    groupingProperties.forEach(c => {
      nested_data = nested_data.key(d => c.fun ? c.fun(d) : d[c.name]);
    });
    // console.log(csv_data)
    if (!data)
      readFile(file);
    nested_data = nested_data.entries(data.filter(c => c.ThumbnailURL));
    resolve(nested_data);
  });
}

export async function createHierarchyWithFile(file, groupingProperties) {
  return new Promise((resolve, reject) => {
    d3.csv(file, (csv_data) => {
      let nested_data = d3.nest();
      groupingProperties.forEach(c => {
        nested_data = nested_data.key(d => c.fun ? c.fun(d) : d[c.name]);
      });
      // console.log(csv_data)
      nested_data = nested_data.entries(csv_data.filter(c => c.ThumbnailURL));
      resolve(nested_data);
    })
  });
}

let id = 0;

export async function fixNode(node) {
  if (node.values)
    node.values.forEach(fixNode);
  node.id = "" + id++;
  node.children = node.values;
  node.values = null;
  node.value = node.children ? node.children.reduce((t, c) => c.value + t, 0) : 1;
  node.label = node.key ? node.key : node.Title ? node.Title : 'None';
  node.img = node.children ? node.children[Math.floor(Math.random() * node.children.length)].img : node.ThumbnailURL;
  // if (id % 1000 === 0)
  // console.log(id);
}

export async function updatePhotoTreeMap(groupingProperties) {
  mainTree = {};
  mainTree.values = await createHierarchyWithGroupingProperties(groupingProperties);
  mainTree.key = 'MOMA';
  mainTree.label = 'MOMA';
  await fixNode(mainTree);
  photoTreemap.update(mainTree);
  // console.log(mainTree);
}

export function updateDNDTree(tree) {
  if (document.getElementById("tree-container"))
    document.getElementById("tree-container").remove(document.getElementsByClassName("overlay"));
  window.dndTree(tree, window.innerWidth * 0.2 - 15, window.innerHeight * 0.345);
}

export function applyConfiguration(newConf) {
  config[newConf.label.toLowerCase()] = newConf.value;
  initPhotoTreeMap();
}

//Show notification
export function showNotification(message) {
  window.alertify.notify(message, 'custom', 7);
}