import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card.jsx";
import { FormInputs } from "../../components/FormInputs/FormInputs.jsx";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';
import ReportTitle from './ReportTitle';
import PaymentPlan from './PaymentPlan';
import EmailSubject from './EmailSubject';

import 'react-datepicker/dist/react-datepicker.css';

var moment = require('moment');

var $ = require("jquery");

class Setting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            report: true,
            payment: false,
            email: false
        }

    }

    componentDidMount() {
        $('#sidebar').show();
    }

    settingPages(pageName) {
        if (pageName == 'report') {
            this.setState({
                report: true,
                payment: false,
                email: false
            });
        }

        if (pageName == 'payment') {
            this.setState({
                report: false,
                payment: true,
                email: false
            });
        }

        if (pageName == 'email') {
            this.setState({
                report: false,
                payment: false,
                email: true
            });
        }
    }


    render() {

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        const borderActive = {
            'border-bottom': '3px solid #1DC7EA'
        }

        const noActiveBorder = {
            'border-bottom': '0px'
        }

        return <div className="content">
            <Grid fluid>
                <Row>
                    <Col md={9}>
                        <Navbar id="nav-color">
                            <Nav>
                                <NavItem eventKey={1} href="#" onClick={() => this.settingPages('report')} style={this.state.report ? borderActive : noActiveBorder}>
                                    Report Title
                                </NavItem>
                                <NavItem eventKey={2} href="#" onClick={() => this.settingPages('payment')} style={this.state.payment ? borderActive : noActiveBorder}>
                                    Payment Plan
                                </NavItem>
                                <NavItem eventKey={3} href="#" onClick={() => this.settingPages('email')} style={this.state.email ? borderActive : noActiveBorder}>
                                    Email Subject
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
                <Row style={this.state.report ? show : hide}>
                    <ReportTitle />
                </Row>
                <Row style={this.state.payment ? show : hide}>
                    <PaymentPlan />
                </Row>
                <Row style={this.state.email ? show : hide}>
                    <EmailSubject />
                </Row>
            </Grid>
        </div>;
    };
}

export default Setting;