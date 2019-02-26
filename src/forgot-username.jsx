import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { FormInputs } from "./components/FormInputs/FormInputs.jsx";
import Button from './components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import swal from 'sweetalert';

import * as url from './baseUrl';

var $ = require("jquery");
const axios = require('axios');

class ForgotUsername extends Component {
    constructor(props) {
        super(props);

        this.state = {
            render: false,
            email: '',
            errorEmail: false,
            isInValidEmail : false,
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

    fieldValue = (event) => {
        this.setState({
            email: event.target.value
        });

        this.validateEmail(event.target.value);
    }

    sendEmail() {
        var errorEmail = false;
        console.log(this.state.email);
        if (this.state.email == '') {
            errorEmail = true;
            this.setState({
                errorEmail: errorEmail
            });
        }

        if (!errorEmail) {
            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'member/forgot-uesrname/' + this.state.email
            }).then((response) => {
                swal({
                    title: "Great",
                    text: "Mail sent to your email id",
                    icon: "success",
                    dangerMode: true,
                })
                    .then(willDelete => {
                        if (willDelete) {
                            window.location.href = '/';
                        }
                    });
            }).catch((error) => {
                swal("Oops!", "Something went wrong", "error");
            });
        } else {
            swal("Oops!", "Please enter Email", "error");
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
                                                <h5 className="text-primary">Enter your email</h5>

                                                <input type="email" className={this.state.errorEmail ? 'form-control input-error-color' : 'form-control'} name="email" placeholder="Enter your email" required="required" value={this.state.email} onChange={e => this.fieldValue(e)} />
                                                <span className="text-danger" style={this.state.isInValidEmail == true && this.state.email.length > 0? show : hide}>Not a valid email</span>
                                                <br />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}></Col>
                                            <Col md={1} xs={4}>
                                                <Button bsStyle="primary" fill onClick={() => this.sendEmail()}>Send</Button>
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
    }
}

export default ForgotUsername;