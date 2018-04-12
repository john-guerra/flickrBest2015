import React, {Component} from 'react';
import {initPhotoTreeMap, updatePhotoTreeMap} from "../../utils/main";
import Grouping from "./Grouping/Grouping";
import Configurations from "./Configurations/Configurations";
import './PhotoTreeMap.css';

class PhotoTreeMap extends Component {
  state = {
    started: false,
  };

  init = (firstProperties) => {
    initPhotoTreeMap(firstProperties);
    this.setState({started: true});
  };

  update = (properties) => {
    updatePhotoTreeMap(properties);
  };

  render() {
    return (
      <div className={"PhotoTreeMap " + (this.state.started ? "started" : "")}>
        <div id="dnd-tree-container"/>
        <div className="col1 paper paper__no-padding">
            <div id="breadcrumbs"/>
            <div id="target"/>
        </div>
        <div className="col2">
          <Grouping init={this.init} update={this.update}/>
          <Configurations/>
        </div>
      </div>
    )
  }
}

export default PhotoTreeMap;