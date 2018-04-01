// This function is called everytime the user type something in the input, when the key is enter then search for the user
function searchUser(event){
  if (event.key === 'Enter') {
    const user = document.getElementById("searchUser").value;
    document.getElementById("searchUser").value = '';
    // console.log(user);
    addNewUserToPhotoTreeMap(user);
    addUserToList(user)
  }
}

function addUserToList (user) {
  const list = document.getElementById("allUsers");
  list.innerHTML= `<div class="user">${user}</div>` + list.innerHTML ;
}