import React, {Component} from 'react';
import './Configurations.css';

class Configurations extends Component {
  state = {
    confs: getConfs()
  };

  render() {
    return (
      <div className="Configurations paper">
        <div className="paper--title">Configurations</div>
        <div className="paper--body list">
          {this.state.confs.map((c,i) =>
            <div className="config-item" key={i}>
              {c.name}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Configurations;

const getConfs = () => {
  return [
    {name: 'Width'},
    {name: 'Height'},
    {name: 'Zoomable'},
    {name: 'Padding'},
    {name: 'Value'},
    {name: 'Label'},
    {name: 'LabelValue'},
    {name: 'ShowLabel'},
    {name: 'UseShannon'},
  ]
};