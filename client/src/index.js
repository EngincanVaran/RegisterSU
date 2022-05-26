import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoginPage from './Pages/LoginPage';
import history from './history';
import HealthPage from './Pages/HealthPage';
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import AddCourse from "./Pages/AddCourse3"
import CloseCourse from "./Pages/CloseCourse";
import RegisterCourse from "./Pages/RegisterCourse";
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
          <Route exact path='/' component={LoginPage} />
          <Route path="/AddCourse" component={AddCourse} />
          <Route path="/CloseCourse" component={CloseCourse} />
          <Route path="/RegisterCourse" component={RegisterCourse} />
          <Route path="/health" component={HealthPage} />
        </Switch>
      </Router>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);
serviceWorker.unregister();

//export default App;