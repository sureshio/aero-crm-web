import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card";
import Button from '../../components/CustomButton/CustomButton';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import swal from 'sweetalert';
import * as url from '../../baseUrl';

var moment = require('moment');

var $ = require("jquery");
const axios = require('axios');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#F5FDFF'
    }
};

class PaymentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            subMemberId: this.props.subMemberId,
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
            isPayment: false,
            reportTitle : ''
        }

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillMount() {
        this.loadMemberData();
        this.loadPaymentData();
        this.loadReportTitle();
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

    loadMemberData() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'submember/get/' + this.state.subMemberId,
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

    loadPaymentData() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'payment/all/payment/' + this.state.subMemberId,
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

    openModal() {
        this.setState({
            modalIsOpen : true
        });
    }

    afterOpenModal() {

    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    paymentField(event) {
        this.setState({
            amount: event.target.value
        });
    }

    pay() {
        if (this.state.amount && !isNaN(this.state.amount)) {

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
                this.closeModal();
                this.loadMemberData();
                this.loadPaymentData();
                swal({
                    title: "Great!",
                    text: "Paid Successfully",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        localStorage.setItem('pay' , 'pay');
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
            swal("Oops!", "Enter a valid amount", "error");
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

        return <Col md={12}>
            <Card
                title="Payment"
                content={
                    <div className="content">
                        <Row>
                            <Col md={12}>
                                <Button bsStyle="info" fill bsSize="small" onClick={this.openModal}>Pay</Button>
                            </Col>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                            >

                                <Row>
                                    <Col md={9} sm={9}>
                                    </Col>
                                    <Col md={1} sm={1}>
                                        <i className="fa fa-times text-info" aria-hidden="true" onClick={this.closeModal}></i>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <FormGroup controlId="formControlsSelectMultiple">
                                            <ControlLabel><b>Amount<span className="text-danger big-font"> *</span></b></ControlLabel>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <input type="number" className="form-control" name="amount" placeholder="Enter amount" required="required" value={this.state.amount} onChange={e => this.paymentField(e)} />
                                            </FormGroup>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <Button bsStyle="info" fill bsSize="small" onClick={() => this.pay()}>Pay</Button>
                                    </Col>
                                </Row>
                            </Modal>
                        </Row><br />
                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Payments"
                                    content={<div>
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
                                    </div>
                                    }
                                />
                            </Col>
                        </Row>
                    </div>
                }
            />
        </Col>;
    };
}

export default PaymentAdd;