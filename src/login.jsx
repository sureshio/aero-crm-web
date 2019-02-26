import React, { Component } from 'react';
import { Redirect } from 'react-router';
import swal from 'sweetalert';

import * as url from './baseUrl';

var $ = require("jquery");
const axios = require('axios');

class Login extends Component {
    constructor(props) {
        super(props);

        localStorage.removeItem('memberInfo');
        localStorage.removeItem('x-token');

        this.state = {
            login: false,
            forgotUsername: false,
            forgotPassword: false,
            signup: false,
            user_name: '',
            password: '',
            errorUser: false,
            errorPassword: false
        };

    }

    componentDidMount() {
        $('#sidebar').hide();
    }

    fieldValue(fieldName, event) {
        if (fieldName == 'user_name') {
            this.setState({
                user_name: event.target.value
            });
        }

        if (fieldName == 'password') {
            this.setState({
                password: event.target.value
            });
        }
    }

    login() {

        var errorUser = false;
        var errorPassword = false;

        if (!this.state.user_name) {
            errorUser = true;
            this.setState({
                errorUser: true
            });
        }

        if (!this.state.password) {
            errorPassword = true;
            this.setState({
                errorPassword: true
            });
        }

        if (!errorUser && !errorPassword) {
            var data = {
                user_name: this.state.user_name,
                password: this.state.password
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'member/login',
                data: data
            }).then((response) => {
                localStorage.setItem('memberInfo', JSON.stringify(response.data.info));
                localStorage.setItem('x-token', response.headers['x-token']);
                localStorage.setItem('login', 1);
                this.setState({
                    login: true
                });
                <Redirect push to="/dashboard" />
            }).catch((error) => {
                swal("Invalid username and password", "", "error");
            });
        } else {
            swal("Please enter Username and Password", "", "error");
        }
    }

    forgotUsername() {
        this.setState({
            forgotUsername: true
        });
    }

    forgotPassword() {
        this.setState({
            forgotPassword : true
        })
    }

    signup() {
        this.setState({
            signup: true
        });
    }

    render() {
        if (this.state.login) {
            return <Redirect push to="/dashboard" />;
        }

        if (this.state.forgotUsername) {
            return <Redirect push to="/forgot-username" />;
        }

        if(this.state.forgotPassword) {
            return <Redirect push to="/forgot-password"/>
        }

        if (this.state.signup) {
            return <Redirect push to="/signup" />;
        }

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        return <div>
            <div className="loginDiv">
                <div className="overlay">
                    <div className="content allign-content">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-2 col-xs-2"></div>
                            <div className="col-lg-4 col-md-4 col-sm-8 col-xs-8">
                                <div className="panel panel-transparent">
                                    <div className="panel-heading text-center panel-heading-login">
                                        <img src="gym-logo.png" alt="gym app" id="logo"/>
                                    </div>
                                    <div className="panel-body">
                                        <div className="row">
                                            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1"></div>
                                            <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                                <form>
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                                            <input type="text" name="username" className={this.state.errorUser ? 'form-control input-error-color' : 'form-control'} placeholder="Username" required="required" value={this.state.user_name} onChange={e => this.fieldValue('user_name', e)} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                                            <input type="password" className={this.state.errorPassword ? 'form-control input-error-color' : 'form-control'} name="password" placeholder="Password" required="required" value={this.state.password} onChange={e => this.fieldValue('password', e)} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <a className="btn btn-primary btn-block btn-sm" onClick={()=>this.login()}>Sign In</a>
                                                        <a className="btn btn-info btn-block btn-sm"  onClick={()=>this.signup()}>Sign Up</a>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
                                                            <a className="alink" onClick={()=>this.forgotUsername()}>Forgot Username?</a>
                                                        </div>
                                                        <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                                            <a className="alink" onClick={()=>this.forgotPassword()}>Forgot Password?</a>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-2 col-xs-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default Login;