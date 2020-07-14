import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import WebFont from 'webfontloader';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Titillium Web',
      'sans-serif'
    ].join(','),
    fontSize: 16
  }
});

WebFont.load({
  google: {
    families: ['Titillium Web', 'sans-serif']
  },
  loading: function () { console.log('webfont loading'); },
  active: function () { console.log('webfont active'); },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
