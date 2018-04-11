import React, {Component} from 'react';
import PhotoTreeMap from "./PhotoTreeMap/PhotoTreeMap";
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="titleContainer">
          <div className="title">MOMA Navigator</div>
          <div className="subtitle1">with</div>
          <div className="subtitle2">PhotoTreeMap</div>
        </div>
        <PhotoTreeMap/>
        <div className="info">
          <div className="title">How it Works?</div>
          <div className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a> labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a>.</div>
          <div className="media"><img src="./media/demo1.gif" alt=""/></div>
        </div>
        <div className="footer">
          Made by <a href="http://luis-mesa.me/" target="_blank" rel="noopener noreferrer">Luis Mesa</a>
        </div>
      </div>
    );
  }
}

export default App;
