const d3 = window.d3;
let photoTreemap;
let mainTree;
const file = './data/moma.csv';

//Init the photoTreeMap
export async function initPhotoTreeMap(groupingProperties) {
  //Create the PhotoTreeMap
  photoTreemap = new window.TreeMap("#target");
  //Setup the PhotoTreeMap
  photoTreemap
    .breadCrumsHtmlID('#breadcrumbs')
    .width(window.innerWidth * 0.7)
    .height((window.innerHeight * 0.8) - 20)
    .zoomable(true);
  //Create the hierarchy and update
  updatePhotoTreeMap(groupingProperties);
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
  node.img = node.children ? node.children[0].img : node.ThumbnailURL;
  // if (id % 1000 === 0)
  // console.log(id);
}

export async function updatePhotoTreeMap(groupingProperties) {
  mainTree = {};
  mainTree.values = await createHierarchyWithFile(file, groupingProperties);
  mainTree.key = 'MOMA';
  await fixNode(mainTree);
  photoTreemap.update(mainTree);
}
//Show notification
export function showNotification(message) {
  window.alertify.notify(message, 'custom', 7);
}