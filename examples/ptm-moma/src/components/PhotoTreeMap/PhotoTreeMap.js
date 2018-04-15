import React, {Component} from 'react';
import {initPhotoTreeMap, updatePhotoTreeMap} from "../../utils/main";
import Grouping from "./Grouping/Grouping";
import Configurations from "./Configurations/Configurations";
import DNDTree from "./DNDTree/DNDTree";
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
      <div className={"PhotoTreeMap " + (this.props.started ? "started" : "notStarted")}>
        <div className="col1 paper paper__no-padding" id="main-container">
            <div id="breadcrumbs"/>
            <div id="target"/>
        </div>
        <div className="col2">
          <Grouping init={this.init} update={this.update}/>
          <Configurations/>
          {/*<DNDTree/>*/}
        </div>
      </div>
    )
  }
}

export default PhotoTreeMap;