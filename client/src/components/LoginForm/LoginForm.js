import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../views/reducer';
import './LoginForm.css';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'input'
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.showHide = this.showHide.bind(this);
  }


  emailHandler = (e) => {
    this.setState({ email: e.target.value })
  }
  passwordHandler = (e) => {
    this.setState({ password: e.target.value })
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ type: this.state.type === 'input' ? 'password' : 'input' })
  }


  render() {
    let {
      email, password
    } = this.state;
    let {
      isLoginPending,
      isLoginSuccess,
      loginError
    } = this.props;
    return (<div className="login-form-wrapper" onSubmit={this.onSubmit}>
      <form name="LoginForm" >
        <p className="description" > Please login below</p>
        <label className="username-label" > Username: </label>
        <br />
        <input className="email" type="email" name="email" onChange={this.emailHandler} value={email} />
        <br />
        <label className="password-label" > Password: </label>
        <br />
        <input className="password" type={this.state.type} name="password" onChange={this.passwordHandler} value={password} />
        <br />
        <span className="password-show" onClick={this.showHide}>{this.state.type === 'input' ? 'Hide' : 'Show'}</span>
        <br />
        <input className="login-button" type="submit" value="Sign In" />
        {isLoginPending && <p className="error" > Please wait... </p>}
        {loginError && <p className="error" > {loginError.message} </p>}
      </form >
    </div>
    );
  }
  onSubmit(e) {
    e.preventDefault();
    let { email, password } = this.state;
    this.props.login(email, password);
    this.setState({
      email: '',
      password: '',
    });
  }
}

const mapStateToProps = (state) => {
  return {
    isLoginPending: state.isLoginPending,
    isLoginSuccess: state.isLoginSuccess,
    loginError: state.loginError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(login(email, password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);