import React, {Component} from 'react';
import Autosuggest from "react-autosuggest";
import {getUserList} from '../../utils/requests';
import './SearchUserInput.css';

// https://github.com/moroshko/react-autosuggest#installation

class ResultList extends Component {
  state = {
    value: '',
    suggestions: [],
    searching: ''
  };

  onSuggestionSelected = async (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
    if (method === 'click' && this.state.searching !== suggestion.username) {
      this.setState({searching: suggestion.username});
      await this.props.addUser(suggestion.username);
      this.setState({value: '', searching: ''});
    }
  };

  onKeyDown = async (event) => {
    if (event.key === 'Enter' && this.state.searching !== this.state.value) {
      this.setState({searching: this.state.value});
      await this.props.addUser(this.state.value);
      this.setState({value: '', searching: ''});
    }
  };

  onChange = async (event, {newValue, method}) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({value}) => {
    this.setState({
      suggestions: await this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = async value => {
    const newResults = await getUserList(value);
    return newResults.slice(0, 5);
  };

  render() {
    const {value, suggestions} = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type an Instagram user',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

export default ResultList;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.username;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div className="Suggestion">
    <div className="image">
      <img src={suggestion.profile_pic_url} alt={suggestion.full_name}/>
    </div>
    <div className="info">
      <div className="username">
        {suggestion.username}
        {suggestion.is_verified ?
          <i className="mdi mdi-approval" style={{color:"#0984e3"}}/>
          :
          ""
        }
      </div>
      <div className="full_name">
        {suggestion.full_name}
      </div>
    </div>
  </div>
);