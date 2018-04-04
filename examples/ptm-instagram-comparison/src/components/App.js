import React, {Component} from 'react';
import {addNewUserToPhotoTreeMap, changeImagesAmountPerUser, deleteUserFromPhotoTreeMap, initPhotoTreeMap, showNotification, resizePhotoTreeMap} from '../utils/main';
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
          const totalValue = newUser.images.slice(0, this.state.numberValue).reduce((t, c) => {
            return t + c.likes_count;
          }, 0);
          this.setState({users: [...this.state.users, {...newUser, totalValue}]});

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
    this.setState({users: this.state.users.filter(c => c.username !== user.username)});
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
    }, 1200);
  };

  numberChange = async (event) => {
    const last = this.state.numberValue;
    await this.setState({numberValue: event.target.value});
    if (last !== this.state.numberValue && ( this.state.numberValue >= min && this.state.numberValue <= max )) {
      changeImagesAmountPerUser(this.state.numberValue, this.state.users);
      this.fixBorders();
      this.setState({
        users: this.state.users.map(c => {
          c.totalValue = c.images.slice(0, this.state.numberValue).reduce((t, c) => {
            return t + c.likes_count;
          }, 0);
          return c;
        })
      });
    }
  };

  render() {
    const totalValuePTM = this.state.users.reduce((t, c) => c.totalValue + t, 0);
    return (
      <div className="App">
        <div className="titleContainer">
          <div className="title">Instagram Trends</div>
          <div className="subtitle1">with</div>
          <div className="subtitle2">PhotoTreeMap</div>
        </div>
        <div className="input" id="input">
          <SearchUserInput addUser={this.addUser}/>
          <div className={"imagesAmount tooltip " + (this.state.numberValue < min || this.state.numberValue > max ? "error" : " ")}>
            <input type="number" onChange={this.numberChange} value={this.state.numberValue} min="5" max="50"/>
            <div className="label">
              <div>images/</div>
              <div>user</div>
            </div>
            {(this.state.numberValue < min || this.state.numberValue > max ) ?
              <span className="tooltiptext">The amount should be between {min} and {max}</span>
              :
              ''
            }
          </div>
        </div>
        <div className="allUsers">
          {this.state.users.sort((a, b) => b.totalValue - a.totalValue).map((user, i) =>
            <div className="user" key={i} style={{border: "2px solid " + user.color}}>
              {user.username}
              <span className="percentage tooltip">
                ({Number(user.totalValue * 100 / totalValuePTM).toFixed(2)}%)
                <span className="tooltiptext">Area of the PhotoTreeMap</span>
              </span>
              <i className="mdi mdi-close" onClick={() => this.deleteUser(user)}/>
            </div>
          )}
        </div>
        <div id="target" className={this.state.started ? "started" : ""}/>
        <div className="info">
          <div className="title">How it Works?</div>
          <div className="text">Compare Instagram users based on the likes in their photos. Thanks to the <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a>, the users are ordered in a way in which the user with more likes will be the bigger one and the user with less likes will be the smaller. In addition, you can decide how many photos to show per user in the <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a>.</div>
          <div className="media"><img src="./media/demo1.gif" alt=""/></div>
        </div>
        <div className="footer">
          Made by <a href="http://luis-mesa.me/" target="_blank" rel="noopener noreferrer">Luis Mesa</a>
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
  '#030303',
  '#fab1a0'
];
//Min and max number of images
const min = 5;
const max = 50;


export default App;
