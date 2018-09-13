import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom"


import Login from "./Components/Login/Login"
import Private from "./Components/Private/Private"

class App extends Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route path="/private" component={Private} />
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
