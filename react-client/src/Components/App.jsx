import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import NavBar from './HeaderComponent/NavBar';
import Opening from './Opening.jsx'

class App extends Component {

  render() {
    return (
      <Router>
        <NavBar />
        <Opening/>
        {/* <div>
          
          <Route name="home" exact path="/" component={HomePage} />
        </div> */}
      </Router>
    )
  }
}
export default App;