let photoTreemap;
let users = [];
let mainTree;

//Init the photoTreeMap
async function initPhotoTreeMap() {
  //Setup the PhotoTreeMap
  photoTreemap = new TreeMap("#target")
    .width(window.innerWidth * 0.8)
    .height(window.innerHeight * 0.8)
    .showNodeTextTitle(false)
  ;
  mainTree = {
    id: 'InstagramComparision',
    value: 0,
    label: 'InstagramComparision',
    children : []
  }
}

async function addNewUserToPhotoTreeMap(user) {
//Request the user
  const response = await requestPhotosFromUser(user);
  console.log(response);
  users.push(response.graphql.user.full_name);

  //Create the hierarchy with the nodes of the user
  const newTree = await buildTreeWithUser(response.graphql.user);
  console.log(newTree);

  //Increase the value of the MainTree based on the new tree
  mainTree.value += newTree.value;

  //Add the new tree to the main tree and bind the hierarchy with the PhotoTreeMap
  mainTree.children.push(newTree);
  console.log('mainTree',mainTree);
  photoTreemap.update({...mainTree});
}

//Request info from a specific user
function requestPhotosFromUser(user) {
  return new Promise((resolve, reject) => {
    d3.json("https://www.instagram.com/" + user + "?__a=1", (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(data);
      }
    })
  });
}

//Create a hierarchy based in images nodes
function buildTreeWithUser(user) {
  return new Promise((resolve, reject) => {
    const newTree = {
      id: user.full_name,
      value: user.edge_owner_to_timeline_media.edges.reduce((t, c) => {
        return t + c.node.edge_liked_by;
      }, 0),
      label: user.full_name
    };
   newTree.children = user.edge_owner_to_timeline_media.edges.map(c => {
      return {
        id: c.node.id,
        value: c.node.edge_liked_by.count,
        label: c.node.shortcode,
        img: c.node.display_url
      }
    });
    resolve(newTree);
  });
}

async function run() {
  await initPhotoTreeMap();
  await addNewUserToPhotoTreeMap('atleticodemadrid');
  setTimeout(() => {
    addNewUserToPhotoTreeMap('fcbarcelona')
  }, 5000);

  setTimeout(() => {
    addNewUserToPhotoTreeMap('realmadrid')
  }, 15000);
}

window.onload = run();
