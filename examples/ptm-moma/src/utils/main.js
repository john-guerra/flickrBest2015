const d3 = window.d3;
let photoTreemap;
let mainTree;

//Init the photoTreeMap
export async function initPhotoTreeMap(groupingProperties) {
  //Setup the PhotoTreeMap
  // mainTree = {
  //   // "values": null,
  //   // "key": "ptm-MOMA",
  //   "id": 125,
  //   "value": 1,
  //   "label":"ptm-moma",
  //   "children": [
  //     {
  //       // "key": "Austria",
  //       // "values": null,
  //       // id: "Children1",
  //       // value: 10,
  //       // label:'Fish',
  //       // img: "https://images.unsplash.com/photo-1513570050319-4797c2aef25e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9a0e774d1c6dc64d2db999ac99fd5dd0&auto=format&fit=crop&w=1079&q=80",
  //       id: "ch"+8,
  //       value: 1,
  //       label:"ptm-moma",
  //       img: "http://www.moma.org/media/W1siZiIsIjU5NDA1Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=137b8455b1ec6167",
        // "children": [
        //   {
        //     // "key": "Architecture & Design",
        //     // "values": null,
        //     "value": 1,
        //     "label":"ptm-moma",
        //     "img": "http://www.moma.org/media/W1siZiIsIjU5NDA1Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=137b8455b1ec6167",
        //     "id": 7,
        //     "children": [
        //       {
        //         // "key": "Architecture",
        //         // "values": null,
        //         "value": 1,
        //         "label":"ptm-moma",
        //         "img": "http://www.moma.org/media/W1siZiIsIjU5NDA1Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=137b8455b1ec6167",
        //         "id": 6,
        //         "children": [
        //           {
        //             "Title": "Ferdinandsbr�cke Project, Vienna, Austria, Elevation, preliminary version",
        //             "Nationality": "(Austrian)",
        //             "Gender": "(Male)",
        //             "Date": "1896",
        //             "AccessionNumber": "885.1996",
        //             "Classification": "Architecture",
        //             "Department": "Architecture & Design",
        //             "DateAcquired": "4/9/96",
        //             "ObjectID": "2",
        //             "URL": "http://www.moma.org/collection/works/2",
        //             "ThumbnailURL": "http://www.moma.org/media/W1siZiIsIjU5NDA1Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=137b8455b1ec6167",
        //             "Diameter (cm)": "",
        //             "Height (cm)": "48.6",
        //             "Width (cm)": "168.9",
        //             "id": 0,
        //             "values": null,
        //             "value": 1,
        //             "label": "Ferdinandsbr�cke Project, Vienna, Austria, Elevation, preliminary version",
        //             "img": "http://www.moma.org/media/W1siZiIsIjU5NDA1Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=137b8455b1ec6167"
        //           },
        //           {
        //             "Title": "Villa near Vienna Project, Outside Vienna, Austria, Elevation",
        //             "Nationality": "(Austrian)",
        //             "Gender": "(Male)",
        //             "Date": "1903",
        //             "AccessionNumber": "1.1997",
        //             "Classification": "Architecture",
        //             "Department": "Architecture & Design",
        //             "DateAcquired": "1/15/97",
        //             "ObjectID": "4",
        //             "URL": "http://www.moma.org/collection/works/4",
        //             "ThumbnailURL": "http://www.moma.org/media/W1siZiIsIjk4Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=fdcfca4db3acac1f",
        //             "Diameter (cm)": "",
        //             "Height (cm)": "34.3",
        //             "Width (cm)": "31.8",
        //             "id": 1,
        //             "values": null,
        //             "value": 1,
        //             "label": "Villa near Vienna Project, Outside Vienna, Austria, Elevation",
        //             "img": "http://www.moma.org/media/W1siZiIsIjk4Il0sWyJwIiwiY29udmVydCIsIi1yZXNpemUgMzAweDMwMFx1MDAzZSJdXQ.jpg?sha=fdcfca4db3acac1f"
        //           },
        //           {
        //             "Title": "Villa, project, outside Vienna, Austria, Exterior perspective",
        //             "Nationality": "(Austrian)",
        //             "Gender": "(Male)",
        //             "Date": "1903",
        //             "AccessionNumber": "2.1997",
        //             "Classification": "Architecture",
        //             "Department": "Architecture & Design",
        //             "DateAcquired": "1/15/97",
        //             "ObjectID": "6",
        //             "URL": "http://www.moma.org/collection/works/6",
        //             "ThumbnailURL": "http://www.moma.org/media/W1siZiIsIjEyNiJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDMwMHgzMDBcdTAwM2UiXV0.jpg?sha=b21f3d10def77da9",
        //             "Diameter (cm)": "",
        //             "Height (cm)": "38.4",
        //             "Width (cm)": "19.1",
        //             "id": 2,
        //             "values": null,
        //             "value": 1,
        //             "label": "Villa, project, outside Vienna, Austria, Exterior perspective",
        //             "img": "http://www.moma.org/media/W1siZiIsIjEyNiJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDMwMHgzMDBcdTAwM2UiXV0.jpg?sha=b21f3d10def77da9"
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // ]
  //     }
  //   ]
  // }
  mainTree = {};
  mainTree.values = await createHierarchyWithFile('./data/moma.csv', groupingProperties);
  mainTree.key = 'ptm-MOMA';
  await fixNode(mainTree);
  setTimeout(() => {
    photoTreemap = new window.TreeMap("#target")
      .width(window.innerWidth * 0.7)
      .height(window.innerHeight * 0.7)
      .zoomable(true);
    // console.log(JSON.stringify(mainTree, null, 2));
    photoTreemap.update(mainTree);
  }, 5000)

  // .showNodeTextTitle(false)
  ;
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
  node.id = ""+id++;
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