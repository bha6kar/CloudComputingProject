import React, { Component } from 'react';
import './App.css';
import LoginForm from '../components/LoginForm/LoginForm';
import Logo from '../logoAssets/logo_large.png';
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <div className="Login-form">

            <LoginForm />
          </div>
          <img className="Qmul-image" src={Logo} alt="Qmul-Logo" />
        </div>
      </div>
    );
  }
}


export default (App);
