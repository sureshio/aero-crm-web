import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card.jsx";
import { FormInputs } from "../../components/FormInputs/FormInputs.jsx";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';
import DetailsEdit from './DetailsEdit';
import MedicalAdd from './MedicalAdd';
import PersonalAdd from './PersonalAdd';
import PaymentAdd from './PaymentAdd';

import 'react-datepicker/dist/react-datepicker.css';

var moment = require('moment');

var $ = require("jquery");

class MemberComponent extends Component {
    constructor(props) {
        super(props);

        if (!localStorage.getItem('x-token') || !localStorage.getItem('memberInfo')) {
            window.location.href = '/';
        }

        if (localStorage.getItem('member')) {
            localStorage.removeItem('member');
            window.location.reload(true);
        }

        this.state = {
            redirect: false,
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            subMemberId: this.props.match.params.id,
            first_name: '',
            last_name: '',
            email: '',
            gender: '',
            payment_plan: '',
            payment_start_date: '',
            last_payment_date: '',
            phone_number: '',
            address: '',
            errorFn: false,
            errorLn: false,
            errorEmail: false,
            errorGender: false,
            errorPlan: false,
            errorPhone: false,
            errorAddress: false,
            isEmailUsed: false,
            isInValidEmail: false,
            isUpdate: false,
            modalIsOpen: false,
            amount: '',
            paymentList: [],
            isDetails: true,
            isMedical: false,
            isPersonal: false,
            isPayment: false
        }
    }

    componentWillMount() {
        var isShow = true;
        if(localStorage.getItem('pay')) {
            this.setState({
                isDetails: !isShow,
                 isMedical: !isShow,
                 isPersonal: !isShow,
                 isPayment: isShow
            });

            localStorage.removeItem('pay');
        }
    }

    nevigateToPage() {
        this.setState({ redirect: true });
    }

    memberPage(pageName) {
        var isShow = true;
         if (pageName == 'details') {
             this.setState({
                 isDetails: isShow,
                 isMedical: !isShow,
                 isPersonal: !isShow,
                 isPayment: !isShow
             })
         }
 
         if (pageName == 'medical') {
             this.setState({
                 isDetails: !isShow,
                 isMedical: isShow,
                 isPersonal: !isShow,
                 isPayment: !isShow
             })
         }
 
         if (pageName == 'personal') {
             this.setState({
                 isDetails: !isShow,
                 isMedical: !isShow,
                 isPersonal: isShow,
                 isPayment: !isShow
             })
         }

         if(pageName == 'payment') {
            this.setState({
                isDetails: !isShow,
                 isMedical: !isShow,
                 isPersonal: !isShow,
                 isPayment: isShow
            });
        }
     }


    render() {
        if (this.state.redirect) {
            return <Redirect push to="/dashboard" />;
        }

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
                                <NavItem eventKey={1} href="#" onClick={() => this.memberPage('details')} style={this.state.isDetails ? borderActive : noActiveBorder}>
                                    Details
                                </NavItem>
                                <NavItem eventKey={2} href="#" onClick={() => this.memberPage('medical')} style={this.state.isMedical ? borderActive : noActiveBorder}>
                                    Medical History
                                </NavItem>
                                <NavItem eventKey={3} href="#" onClick={() => this.memberPage('personal')} style={this.state.isPersonal ? borderActive : noActiveBorder}>
                                    Personal Best
                                </NavItem>
                                <NavItem eventKey={4} href="#" onClick={() => this.memberPage('payment')} style={this.state.isPayment ? borderActive : noActiveBorder}>
                                    Payments
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                    <Col md={3}><br/>
                        <ControlLabel>Next Payment Date : <span className="text-danger">{localStorage.getItem('paymentStartDate')}</span></ControlLabel>
                    </Col>
                </Row>
                <Row style={this.state.isDetails ? show : hide}>
                    <DetailsEdit id="details" subMemberId={this.state.subMemberId}/>
                </Row>
                <Row style={this.state.isMedical ? show : hide}>
                    <MedicalAdd id="medical" subMemberId={this.state.subMemberId}/>
                </Row>
                <Row style={this.state.isPersonal ? show : hide}>
                    <PersonalAdd id="history" subMemberId={this.state.subMemberId}/>
                </Row>
                <Row style={this.state.isPayment ? show : hide}>
                    <PaymentAdd id="payment" subMemberId={this.state.subMemberId}/>
                </Row>
                <br />
                
                <Row>
                    <Col lg={2} sm={6}>
                        <Button bsStyle="info" fill type="button" bsSize="small" onClick={() => this.nevigateToPage()}>
                            Back
                        </Button>
                    </Col>
                </Row>
            </Grid>
        </div>;
    };
}

export default MemberComponent;