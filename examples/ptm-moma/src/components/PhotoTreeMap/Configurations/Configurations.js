import React, {Component} from 'react';
import Input from "./Input/Input";
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
            <Input input={c} key={i} />
          )}
        </div>
      </div>
    )
  }
}

export default Configurations;

const getConfs = () => {
  return [
    {label: 'Padding', value: 0, type:'number'},
    {label: 'Width', value: Math.floor(window.innerWidth*0.7), type:'number'},
    {label: 'Height', value: Math.floor(((window.innerHeight * 0.8) - 20)), type:'number'},
    {label: 'Value', value: 'value', type:'text'},
    {label: 'Label', value: 'label', type:'text'},
    {label: 'LabelValue', value: 'labelValue', type:'text'},
    {label: 'Zoomable', value: true, type:'boolean'},
    {label: 'ShowLabel', value: true, type:'boolean'},
    {label: 'UseShannon', value: false, type:'boolean'},
  ]
};