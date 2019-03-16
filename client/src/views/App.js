import React, { Component } from 'react';
import './App.css';
import LoginForm from '../components/LoginForm/LoginForm';
import DistrictLogo from '../logoAssets/Logo-Black-Small.png';
import Alexa from '../logoAssets/final-alexa-badge.png';
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <div className="Login-form">
            <img className="District-logo" src={DistrictLogo} alt="District-logo" />
            <LoginForm />
          </div>
          <img className="Alexa-image" src={Alexa} alt="Amazon-Alexa" />
        </div>
      </div>
    );
  }
}


export default (App);
