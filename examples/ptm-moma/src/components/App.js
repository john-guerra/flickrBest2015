import React, {Component} from 'react';
import PhotoTreeMap from "./PhotoTreeMap/PhotoTreeMap";
import './App.css';
import {RaisedButton} from "material-ui";

class App extends Component {
  state = {
    started: false
  };

  render() {
    return (
      <div className="App">
        <div className="titleContainer">
          <div className="title">MOMA Navigator</div>
          <div className="subtitle1">with</div>
          <div className="subtitle2">PhotoTreeMap</div>
        </div>
        {this.state.started ?
          <PhotoTreeMap started={this.state.started}/>
          :
          ''
        }
        <div className="info">
          <div className="info--col info--col1">
            <div className="title">How it Works?</div>
            <div className="text">Navigate around the artworks of <a href="https://www.moma.org/" target="_blank" rel="noopener noreferrer">The Museum of Modern Art (MOMA)</a> based in its characteristics. Thanks to the <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a> you will see photos grouped as your choice and ordered based on the amount of photos in each group, so the group with most images will look bigger and the one with less will be the smaller. In conclusion, you can decide how to organize the artworks, for example, first see the artworks grouped by Nationality, Author's Gender, Classification or Department. In addition, you can configure the properties of the <a href="https://github.com/john-guerra/photoTreemap" target="_blank" rel="noopener noreferrer">PhotoTreeMap</a> as you want.</div>
          </div>
          <div className="info--col info--col2">
            {/*<div className="media"><img src="./media/demo1.gif" alt=""/></div>*/}
            <div className="button" onClick={()=>{this.setState({started: true})}}>Get Started</div>
          </div>
        </div>
        <div className="footer">
          Made by <a href="http://luis-mesa.me/" target="_blank" rel="noopener noreferrer">Luis Mesa</a>
        </div>
      </div>
    );
  }
}

export default App;
