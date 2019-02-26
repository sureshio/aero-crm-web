import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card";
import { FormInputs } from "../../components/FormInputs/FormInputs";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import 'react-datepicker/dist/react-datepicker.css';
import swal from 'sweetalert';
import * as url from '../../baseUrl';
var moment = require('moment');
var $ = require("jquery");
const axios = require('axios');

class PaymentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            selectedOption: null,
            subMemberList : [],
            currentMemberId : 0,
            amount : '',
            first_name: '',
            last_name: '',
            email: '',
            gender: '',
            payment_plan: '',
            payment_start_date: '',
            last_payment_date: '',
            phone_number: '',
            address: '',
            paymentList: [],
            reportTitle : ''
        };
    }

    componentWillMount() {
        this.getSubMemberList();
        this.loadReportTitle();
        this.loadAllPaymentByMember();
    }

    loadReportTitle() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'subject/category/report/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            if(response.data.length > 0) {
                this.setState({
                    reportTitle : response.data[0].name,
                });
            }
        }).catch((error) => {
            if (error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }
        });
    }

    getSubMemberList() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'submember/all/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            var array = [];
            for (var i = 0; i < response.data.length; i++) {
                var data = { value: response.data[i].id, label: response.data[i].first_name + ' ' + response.data[i].last_name }
                array.push(data);
            }
            this.setState({
                subMemberList: array
            });

        }).catch((error) => {
            if (error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }
        });
    }

    loadMemberData(subMemberId) {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'submember/get/' + subMemberId,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            var data = response.data[0];

            localStorage.setItem('paymentStartDate', moment(data.payment_start_date).format('DD-MMM-YYYY'));
            this.setState({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                gender: data.gender,
                payment_plan: data.payment_plan,
                payment_start_date: moment(data.payment_start_date).format('YYYY-MM-DD'),
                last_payment_date: moment(data.last_payment_date).format('DD-MMM-YYYY'),
                phone_number: data.phone_number,
                address: data.address
            });

        }).catch((error) => {
            if (error.response.status && error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }
        });
    }

    loadPaymentData(subMemberId) {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'payment/all/payment/' + subMemberId,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            this.setState({
                paymentList: response.data
            });
        }).catch((error) => {
            if (error.response.status && error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }
        });
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption : selectedOption, subMemberId :  selectedOption.value});
        console.log(`Option selected:`, selectedOption.value);
        if(selectedOption.value) {
            this.loadMemberData(selectedOption.value);
            this.loadPaymentData(selectedOption.value);
        }
    }

    paymentField(event) {
        this.setState({
            amount: event.target.value
        });
    }

    loadAllPaymentByMember() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'payment/all/member/payment/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            this.setState({
                paymentList: response.data
            });
        }).catch((error) => {
            if (error.response.status && error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.href = '/';
                    }
                });
            }
        });
    }

    pay() {
        if (this.state.amount && !isNaN(this.state.amount) && this.state.subMemberId) {

            var next_payment_start_date = moment(this.state.last_payment_date).add(1, 'day').format('YYYY-MM-DD')
            // var next_payment_end_date = '';
            // if (this.state.payment_plan == 'Drop In') {
            //     next_payment_end_date = moment(next_payment_start_date).add(1, 'day').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == 'Monthly') {
            //     next_payment_end_date = moment(next_payment_start_date).add(1, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == '3 Months') {
            //     next_payment_end_date = moment(next_payment_start_date).add(3, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == '6 Months') {
            //     next_payment_end_date = moment(next_payment_start_date).add(6, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == 'Year') {
            //     next_payment_end_date = moment(next_payment_start_date).add(1, 'years').format('YYYY-MM-DD');
            // }

            var strPlan = this.state.payment_plan.split('_');
            var next_payment_end_date = moment(next_payment_start_date).add(strPlan[0], strPlan[1]).format('YYYY-MM-DD');

            var data = {
                amount: this.state.amount,
                paid_by: this.state.subMemberId,
                payment_date: moment().format('YYYY-MM-DD HH:MM'),
                payment_period_start: this.state.payment_start_date,
                payment_period_end: moment(this.state.last_payment_date).format('YYYY-MM-DD'),
                next_payment_start_date: next_payment_start_date,
                next_payment_end_date: next_payment_end_date,
                created_by : this.state.memberInfo.id
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'payment/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.loadPaymentData(this.state.subMemberId);
                swal({
                    title: "Great!",
                    text: "Paid Successfully",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        window.location.reload(true);
                    }
                });
            }).catch((error) => {
                if (error.response.status == '403') {
                    swal({
                        title: "Error",
                        text: "You should login",
                        icon: "error",
                        dangerMode: true,
                    }).then(willDelete => {
                        if (willDelete) {
                            window.location.href = '/';
                        }
                    });
                }
            });

        } else {
            swal("Oops!", "Please enter all fileds and make valid entry", "error");
        }
    }

    print(data) {
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        var html = `<div>
                        <h1>` + this.state.reportTitle + `</h1><br/>
                        <table>
                            <tr>
                                <th align='left'>Name </th>
                                <td>` + data.first_name + ' ' + data.last_name + `</td>
                            </tr>
                            <tr>
                                <th align='left'>Email </th>
                                <td>` + data.email + `</td>
                            </tr>
                            <tr>
                                <th align='left'>Payment period </th>
                                <td>` + moment(data.payment_period_start).format('DD-MMM-YYYY') + ` To ` + moment(data.payment_period_end).format('DD-MMM-YYYY') + `</td>
                            </tr>
                            <tr>
                                <th align='left'>Date of pay </th>
                                <td>` + moment(data.payment_date).format('DD-MMM-YYYY') + `</td>
                            </tr>
                                <th align='left'>Amount Paid </th>
                                <td>` + data.amount + `</td>
                            </tr>
                        <table>
                    </div>`;
        WinPrint.document.write(html);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

    paymentField(event) {
        this.setState({
            amount: event.target.value
        });
    }


    render() {
        var paymentList = this.state.paymentList.map((data, index) => {
            return <tr key={index}>
                <td>{(index + 1)}</td>
                <td>{data.amount}</td>
                <td>{moment(data.payment_date).format('DD-MMM-YYYY')}</td>
                <td>{moment(data.payment_period_start).format('DD-MMM-YYYY')} - {moment(data.payment_period_end).format('DD-MMM-YYYY')}</td>
                <td className="td-actions">
                    <i className="fa fa-print text-info" aria-hidden="true" onClick={e => this.print(data)}></i>
                </td>
            </tr>
        });

        return <div className="content">
            <Grid fluid><Col md={12}>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Payments"
                            content={<div>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup controlId="formControlsSelectMultiple">
                                            <ControlLabel><b>Select Member<span className="text-danger big-font"> *</span></b></ControlLabel>
                                            <Select
                                                value={this.state.selectedOption}
                                                onChange={this.handleChange}
                                                options={this.state.subMemberList}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup controlId="formControlsSelectMultiple">
                                            <ControlLabel><b>Amount<span className="text-danger big-font"> *</span></b></ControlLabel>
                                            <input type="number" className="form-control" name="phone" placeholder="Enter price" required="required" value={this.state.amount} onChange={e => this.paymentField(e)}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}><br />
                                        <Button bsStyle="info" type="button" bsSize="small" fill onClick={() => this.pay()}>
                                            Pay
                                        </Button>
                                    </Col>
                                </Row><hr />
                                <Row>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <td>Paid Amount</td>
                                                    <td>Paid Date</td>
                                                    <td>Payment Period</td>
                                                    <td>Print</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentList}
                                            </tbody>
                                        </table>
                                    </div>
                                </Row>
                            </div>
                            }
                        />
                    </Col>
                </Row>
            </Col>
            </Grid>
        </div>;
    };
}

export default PaymentList;