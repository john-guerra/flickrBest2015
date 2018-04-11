const d3 = window.d3;
let photoTreemap;
let mainTree;

//Init the photoTreeMap
export async function initPhotoTreeMap(groupingProperties) {
  //Create the PhotoTreeMap
  photoTreemap = new window.TreeMap("#target");

  //Create the hierarchy
  mainTree = {};
  mainTree.values = await createHierarchyWithFile('./data/moma.csv', groupingProperties);
  mainTree.key = 'ptm-MOMA';
  await fixNode(mainTree);

  //Setup the PhotoTreeMap
  // setTimeout(()=> {
  photoTreemap
    .width(window.innerWidth * 0.7)
    .height(window.innerHeight * 0.7)
    .zoomable(true);
  photoTreemap.update(mainTree);
  // },2000);

  // .showNodeTextTitle(false)
  // // .breadCrumsHtmlID('#breadcrumbs')
  // .zoomable(true)
  // .update(mainTree);
  // photoTreemap.update(mainTree);
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

export async function createTree(oldHierarchy) {
  function recursion(level) {
    level.id = 'abc';
    if (level.values) {
      level.values.forEach(recursion)
    }
  }

  recursion(oldHierarchy);
}

let id = 0;

export async function fixNode(node) {
  if (node.values)
    node.values.forEach(fixNode);
  node.id = "" + id++;
  node.children = node.values;
  node.values = null;
  node.value = node.children ? node.children.reduce((t, c) => c.value + t, 0) : 1;
  node.label = node.key ? node.key : node.Title;
  node.img = node.children ? node.children[0].img : node.ThumbnailURL;
  // if (id % 1000 === 0)
  // console.log(id);
}


//
// export async function addNewArtWork(artWork, groupingPorperty, sortingProperty) {
//   // console.log(user);
//   //Create the hierarchy with the nodes of the user
//   const newTree = await buildTreeWithUser(user);
//   // console.log(newTree);
//
//   //Increase the value of the MainTree based on the new tree
//   mainTree.value += newTree.value;
//
//   //Add the new tree to the main tree and bind the hierarchy with the PhotoTreeMap
//   mainTree.children.push(newTree);
//   // console.log('mainTree',mainTree);
//   photoTreemap.update({...mainTree});
//   // console.log(mainTree);
//   return user;
// }
//
// export async function readArtWorks () {
//     fs.readFile('./oldData/Emergencias_Naturales.csv', 'utf8', (err, data) => {
//
//       parse(data, {comment: '#'}, (err, output) => {
//         output.splice(0, 1);
//         emergencies = output.map((c, j) => {
//
//           return createEmergency(c);
//         })
//       });
//     });
// };

//Show notification
export function showNotification(message) {
  window.alertify.notify(message, 'custom', 7);
}