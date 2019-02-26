import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { FormInputs } from "./components/FormInputs/FormInputs.jsx";
import Button from './components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import swal from 'sweetalert';

import * as url from './baseUrl';

var $ = require("jquery");
const axios = require('axios');

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            render: false,
            password: '',
            repassword: '',
            isPasswordMissMatch : false,
            keyToken : this.props.match.params.token
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

    fieldChange(fieldName, event) {
        var isPasswordMissMatch = false;
        if(fieldName=='pwd') {
            this.setState({
                password : event.target.value
            });

            if(this.state.password !== event.target.value) {
                isPasswordMissMatch = true;
            }
        }

        if(fieldName=='repwd') {
            this.setState({
                repassword : event.target.value
            });

            if(this.state.password !== event.target.value) {
                isPasswordMissMatch = true;
            }
        }

        this.setState({
            isPasswordMissMatch : isPasswordMissMatch
        });
    }

    savePassword() {
        if(this.state.password && !this.state.isPasswordMissMatch) {
            var str = this.state.keyToken.split('(-*-)');
            console.log('Token : ' + str[0]);
            console.log('email : ' + str[1]);
            var data = {
                token : str[0],
                email : str[1],
                password : this.state.password
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'member/password/change',
                data : data
            }).then((response) => {
                swal({
                    title: "Great!",
                    text: "Password changed sucessfully",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }).catch((error) => {
                swal("Oops!", "Something went wrong", "error");
            });
        } else {
            swal("Oops!", "Please enter password", "error");
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
                                                <h5 className="text-primary">Chanage Password</h5>
                                                <input type="password" className="form-control" name="password" placeholder="Enter password" required="required" value={this.state.password} onChange={e => this.fieldChange('pwd', e)}/><br/>
                                                <input type="password" className="form-control" name="repassword" placeholder="Confirm password" required="required" value={this.state.repassword} onChange={e => this.fieldChange('repwd', e)}/><br/>
                                                <span className="text-danger" style={this.state.isPasswordMissMatch && this.state.password.length > 0 && this.state.repassword.length > 0 ? show : hide}>Password not matched</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}></Col>
                                            <Col md={1} xs={3}>
                                                <Button bsStyle="primary" fill onClick={()=>this.savePassword()}>Save</Button>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ChangePassword;