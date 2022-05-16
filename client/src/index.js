import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from "./login.component";
import history from './history';
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
/*ReactDOM.render(<App />, document.getElementById('root'));*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

ReactDOM.render(
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        <Router history={history}>
          <Switch>
            <Route exact path='/' component={Login} />  
          </Switch>
        </Router>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>,
    document.getElementById('root')
  );
serviceWorker.unregister();

//export default App;
