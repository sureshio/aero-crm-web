import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { FormInputs } from "./components/FormInputs/FormInputs.jsx";
import Button from './components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import swal from 'sweetalert';

import * as url from './baseUrl';

var $ = require("jquery");
const axios = require('axios');

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            render: false,
            email: '',
            user_name: '',
            password: '',
            repassword: '',
            gender: '',
            errorEmail: false,
            errorUser: false,
            errorPassword: false,
            isPwdNotMatched: false,
            isEmailUsed: false,
            isInValidEmail : false,
            isUsernameUsed: false
        }
    }

    componentDidMount() {
        $('#sidebar').hide();
    }

    loginPage() {
        this.setState({
            render: true
        });
    }

    fieldValue(fieldName, event) {
        if (fieldName == 'email') {
            this.setState({
                email: event.target.value
            });

            this.validateEmail(event.target.value);
            this.checkEmail(event.target.value);
        }

        if (fieldName == 'user_name') {
            this.setState({
                user_name: event.target.value
            });

            this.userName(event.target.value);
        }

        if (fieldName == 'password') {
            this.setState({
                password: event.target.value
            });
        }

        if (fieldName == 'repassword') {
            this.setState({
                repassword: event.target.value
            });

            this.passwordMatch(event.target.value);
        }

        if (fieldName == 'gender') {
            this.setState({
                gender: event.target.value
            });
        }
    }

    validateEmail(emailData) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        var isInvalidEmail = false;

        if (emailData.match(mailformat)) {
            isInvalidEmail = false;
        } else {
            isInvalidEmail = true;
        }

        this.setState({
            isInValidEmail : isInvalidEmail
        });        
    }

    checkEmail = (value) => {
        var error = false;
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'member/email/' + value
        }).then((response) => {
            error = false;
            this.setState({
                isEmailUsed: error
            });
        }).catch((error) => {
            error = true;
            this.setState({
                isEmailUsed: error
            });
        });
    }

    userName = (value) => {
        var error = false;
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'member/username/' + value
        }).then((response) => {
            error = false;
            this.setState({
                isUsernameUsed: error
            });
        }).catch((error) => {
            error = true;
            this.setState({
                isUsernameUsed: error
            });
        });
    }

    passwordMatch = (repassword) => {
        if (this.state.password != repassword) {
            this.setState({
                isPwdNotMatched: true
            })
        } else {
            this.setState({
                isPwdNotMatched: false
            })
        }
    }

    register = () => {
        var errorEmail = false;
        var errorUser = false;
        var errorPassword = false;

        if (!this.state.email) {
            errorEmail = true;
        }

        if (!this.state.user_name) {
            errorUser = true;
        }

        if (!this.state.password) {
            errorPassword = true;
        }

        this.setState({
            errorEmail: errorEmail,
            errorUser: errorUser,
            errorPassword: errorPassword
        });

        if (!errorEmail && !errorUser && !errorPassword) {
            var data = {
                user_name: this.state.user_name,
                email: this.state.email,
                password: this.state.password,
                gender: this.state.gender
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'member/create',
                data: data
            }).then((response) => {
                swal({
                    title: "Great",
                    text: "You are registered",
                    icon: "success",
                    dangerMode: true,
                  })
                  .then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                  });
            }).catch((error) => {

            });
        } else {
            swal("Oops!", "Please enter Email, Username, Password", "error");
        }
    }

    render() {
        if (this.state.render) {
            return <Redirect push to="/login" />;
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
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2"></div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <div className="panel panel-transparent">
                                <div className="panel-heading text-center panel-heading-login">
                                    <img src="gym-logo.png" alt="gym app" id="logo"/>
                                </div>
                                <Grid fluid>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={4} sm={12} xs={12}>
                                    <input type="email" className={this.state.errorEmail ? 'form-control input-error-color' : 'form-control'} name="email" placeholder="Email" required="required" value={this.state.email} onChange={e => this.fieldValue('email', e)} />
                                    <span className="text-danger" style={this.state.isEmailUsed && this.state.email.length > 0 ? show : hide}>Email not available</span>
                                    <span className="text-danger" style={this.state.isInValidEmail == true  && this.state.email.length > 0 ? show : hide}>Not a valid email</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={4} sm={12} xs={12}><br />
                                    <input type="text" className={this.state.errorUser ? 'form-control input-error-color' : 'form-control'} name="uesrname" placeholder="Username" required="required" value={this.state.user_name} onChange={e => this.fieldValue('user_name', e)} />
                                    <span className="text-danger" style={this.state.isUsernameUsed && this.state.user_name.length > 0 ? show : hide}>Username not available</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={4} sm={12} xs={12}><br />
                                    <input type="password" className={this.state.errorPassword ? 'form-control input-error-color' : 'form-control'} name="paasword" placeholder="Password" required="required" value={this.state.password} onChange={e => this.fieldValue('password', e)} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={4} sm={12} xs={12}><br />
                                    <input type="password" className="form-control" name="re-password" placeholder="Re-enter Password" required="required" value={this.state.repassword} onChange={e => this.fieldValue('repassword', e)} />
                                    <span className="text-danger" style={this.state.isPwdNotMatched ? show : hide}>Password not matched</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={4}><br />
                                    <FormGroup controlId="formControlsSelectMultiple">
                                        <FormControl componentClass="select" onChange={e => this.fieldValue('gender', e)} value={this.state.gender}>
                                            <option selected>Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}></Col>
                                <Col md={1} xs={4}>
                                    <Button bsStyle="primary" fill onClick={this.register}>Save</Button>
                                </Col>
                                <Col md={1} xs={3}>
                                    <Button bsStyle="warning" fill onClick={() => this.loginPage()}>Back</Button>
                                </Col>
                            </Row>
                        </Grid>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
        
        // <div>
        //     <div className="loginDiv">
        //         <div className="overlay">
        //             <div className="content">
        //                 <Grid fluid>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={4} sm={12} xs={12}><br /><br />
        //                             <input type="email" className={this.state.errorEmail ? 'form-control input-error-color' : 'form-control'} name="email" placeholder="Email" required="required" value={this.state.email} onChange={e => this.fieldValue('email', e)} />
        //                             <span className="text-danger" style={this.state.isEmailUsed ? show : hide}>Email not available</span>
        //                         </Col>
        //                     </Row>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={4} sm={12} xs={12}><br />
        //                             <input type="text" className={this.state.errorUser ? 'form-control input-error-color' : 'form-control'} name="uesrname" placeholder="Username" required="required" value={this.state.user_name} onChange={e => this.fieldValue('user_name', e)} />
        //                             <span className="text-danger" style={this.state.isUsernameUsed ? show : hide}>Username not available</span>
        //                         </Col>
        //                     </Row>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={4} sm={12} xs={12}><br />
        //                             <input type="password" className={this.state.errorPassword ? 'form-control input-error-color' : 'form-control'} name="paasword" placeholder="Password" required="required" value={this.state.password} onChange={e => this.fieldValue('password', e)} />
        //                         </Col>
        //                     </Row>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={4} sm={12} xs={12}><br />
        //                             <input type="password" className="form-control" name="re-password" placeholder="Re-enter Password" required="required" value={this.state.repassword} onChange={e => this.fieldValue('repassword', e)} />
        //                             <span className="text-danger" style={this.state.isPwdNotMatched ? show : hide}>Password not matched</span>
        //                         </Col>
        //                     </Row>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={4}><br />
        //                             <FormGroup controlId="formControlsSelectMultiple">
        //                                 <FormControl componentClass="select" onChange={e => this.fieldValue('gender', e)} value={this.state.gender}>
        //                                     <option selected>Gender</option>
        //                                     <option value="male">Male</option>
        //                                     <option value="female">Female</option>
        //                                 </FormControl>
        //                             </FormGroup>
        //                         </Col>
        //                     </Row>
        //                     <Row>
        //                         <Col md={4}></Col>
        //                         <Col md={1} xs={3}>
        //                             <Button bsStyle="primary" fill onClick={this.register}>Save</Button>
        //                         </Col>
        //                         <Col md={1} xs={3}>
        //                             <Button bsStyle="warning" fill onClick={() => this.loginPage()}>Back</Button>
        //                         </Col>
        //                     </Row>
        //                 </Grid>
        //             </div>
        //         </div>
        //     </div>
        // </div>;
    }
}

export default SignUp;