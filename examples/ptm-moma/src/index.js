import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';

ReactDOM.render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('root'));
