import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import history from './history';
import HealthPage from './Pages/HealthPage';
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import RegisterStudentPage from "./Pages/RegisterStudent";
import RegisterSR from "./Pages/RegisterSr";
import LandingPage from "./Pages/LandingPage";
import ProfilePage from "./Pages/ProfilePage";
import StudentRegisterCoursePage from "./Pages/RegisterCourse";
import AddCourseSRPage from "./Pages/AddCourseSr";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import SrProfilePage from './Pages/ProfilePageSr';
import ProfilePageSr from './Pages/ProfilePageSr';
/*ReactDOM.render(<App />, document.getElementById('root'));*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path="/health" component={HealthPage} />
          {/* Student Pages */}
          <Route path="/register-student" component={RegisterStudentPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/register-course" component={StudentRegisterCoursePage} />
          {/* Student Resources Pages */}
          <Route path="/register-sr" component={RegisterSR} />
          <Route path="/sr-profile" component={ProfilePageSr} />
          <Route path="/sr-add-course" component={AddCourseSRPage} />
        </Switch>
      </Router>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);
serviceWorker.unregister();

//export default App;