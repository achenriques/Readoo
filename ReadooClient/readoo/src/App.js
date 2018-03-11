import React, { Component } from 'react';
import ShortcutBar from './components/ShortcutBar';
import BodyContainer from './components/BodyContainer';
import Footer from './components/Footer';
import 'bootstrap';

class App extends Component {
  render() {
    return (
      <div>
        <ShortcutBar/>
        <BodyContainer/>
        <Footer/>
      </div>
    );
  }
}

export default App;
