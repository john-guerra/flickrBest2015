import React, {Component} from 'react';
import {addNewUserToPhotoTreeMap, changeImagesAmountPerUser, deleteUserFromPhotoTreeMap, initPhotoTreeMap, showNotification} from '../utils/main';
import {getUser} from "../utils/requests";
import SearchUserInput from "./SearchUserInput/SearchUserInput";
import './App.css';

class App extends Component {
  state = {
    users: [],
    currentColor: 0,
    numberValue: 12,
    started: false
  };

  addUser = async (userName) => {
    if (!this.state.started) {
      this.setState({started: true});
      await initPhotoTreeMap();
    }
    if (!this.state.users.find(user => user.username === userName)) {
      //Request the user
      const newUser = await getUser(userName);
      if (newUser) {
        if (newUser.images.length !== 0) {
          await addNewUserToPhotoTreeMap({...newUser, images: newUser.images.slice(0, this.state.numberValue)});
          newUser.color = colors[this.state.currentColor < colors.length ? this.state.currentColor++ : 0];
          this.setState({users: [...this.state.users, newUser]});

          //Add styles for the new user's tree
          const css = window.document.createElement("style");
          css.type = "text/css";
          css.innerHTML = `#node${newUser.id}{ border: 1px solid ${newUser.color}; border-radius: 0px; }`;
          window.document.body.appendChild(css);
          this.fixBorders();
        }
        else {
          showNotification(`${userName} does not have images or is a private account`);
        }
      }
      else {
        showNotification(`${userName} is not a valid Instagram user`);
      }
    }
    else {
      showNotification(`The user ${userName} is already in the PhotoTreeMap`);
    }
  };

  deleteUser = async (user) => {
    await deleteUserFromPhotoTreeMap(user);
    this.setState({users: this.state.users.filter(c => c.username !== user.username)})
    this.fixBorders();
  };

  fixBorders = () => {
    //Fix width and height
    setTimeout(() => {
      this.state.users.forEach(user => {
        const newNode = window.document.getElementById("node" + user.id);
        newNode.style.width = newNode.style.width.split("px")[0] - 4 + "px";
        newNode.style.height = newNode.style.height.split("px")[0] - 4 + "px";
      });
    }, 1000);
  };

  numberChange = async (event) => {
    const min = 5;
    const max = 50;
    const last = this.state.numberValue;
    if (event.target.value >= min && event.target.value <= max) {
      await this.setState({numberValue: event.target.value})
    }
    else if (event.target.value <= min) {
      await this.setState({numberValue: 5})
    }
    else if (event.target.value >= max) {
      await this.setState({numberValue: 50})
    }
    if (last !== this.state.numberValue) {
      changeImagesAmountPerUser(this.state.numberValue, this.state.users);
    }
  };

  render() {
    return (
      <div className="App">
        <div className="titleContainer">
          <div className="title">Instagram Trends</div>
          <div className="subtitle1">with</div>
          <div className="subtitle2">PhotoTreeMap</div>
        </div>
        <div className="input" id="input">
          <SearchUserInput addUser={this.addUser}/>
          <div className="imagesAmount">
            <input type="number" onChange={this.numberChange} value={this.state.numberValue}/>
            <div className="label">
              <div>images/</div>
              <div>user</div>
            </div>
          </div>
        </div>
        <div className="allUsers">
          {this.state.users.map((user, i) => <div className="user" key={i} style={{border: "2px solid " + user.color}}>{user.username} <i className="mdi mdi-close" onClick={() => this.deleteUser(user)}/></div>)}
        </div>
        <div id="target" className={this.state.started?"started":""}/>
        <div className="info">
          <div className="title">How it Works?</div>
          <div className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          <div className="media"><img src="./media/demo1.gif" alt=""/> </div>
        </div>
      </div>
    );
  }
}

// https://flatuicolors.com/palette/us
const colors = [
  '#0984e3',
  '#d63031',
  '#00b894',
  '#6c5ce7',
  '#636e72',
  '#e84393',
  '#fdcb6e',
  '#2d3436',
  '#fab1a0'
];

export default App;
