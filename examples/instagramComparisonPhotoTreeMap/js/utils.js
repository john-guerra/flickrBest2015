function searchUser(event){
  if (event.key === 'Enter') {
    const user = document.getElementById("searchUser").value;
    console.log(user);
    addNewUserToPhotoTreeMap(user);
  }

}