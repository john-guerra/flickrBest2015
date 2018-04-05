const d3 = window.d3;
let photoTreemap;
let mainTree;

//Init the photoTreeMap
export async function initPhotoTreeMap() {
  //Setup the PhotoTreeMap
  photoTreemap = new window.TreeMap("#target")
    .width(window.innerWidth * 0.7)
    .height(window.innerHeight * 2)
  // .showNodeTextTitle(false)
  ;
  mainTree = {
    id: 'MOMANavigator',
    value: 0,
    label: 'MOMANavigator',
    children: []
  };
  readFile()
  // console.log(MOMAData);
}

export function createHierarchywWithFile(file, groupingProperty) {
  d3.csv("./data/moma.csv", (csv_data) => {
    const nested_data = d3.nest()
      // .key(d => d.Title)
      // .key(d => d.Department)
      .key(d => d.Classification)
      .entries(csv_data);
    console.log(nested_data);
  });
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