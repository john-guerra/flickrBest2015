import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from "material-ui/Checkbox";
import {applyConfiguration} from "../../../../utils/main";
import './Input.css';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.input.value
    };
  }

  handleChange = (event, newValue) =>{
    this.setState({value: newValue});
    applyConfiguration({...this.props.input, value : newValue});
  };

  render() {
    const {label, type} = this.props.input;
    const {value} = this.state;
    return (
        <div className="Input">
          {type === 'boolean' ?
            <Checkbox
              label={label}
              labelPosition="left"
              checked={value}
              onCheck={this.handleChange}
            />
            :
            <TextField
              defaultValue={value}
              floatingLabelText={label}
              type={type}
              onChange={this.handleChange}
            />
          }
        </div>
    )
  }

}

export default Input;