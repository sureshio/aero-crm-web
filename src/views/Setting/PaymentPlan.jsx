import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card";
import { FormInputs } from "../../components/FormInputs/FormInputs";
import Button from '../../components/CustomButton/CustomButton';
import 'react-datepicker/dist/react-datepicker.css';
import swal from 'sweetalert';
import * as url from '../../baseUrl';

var $ = require("jquery");
const axios = require('axios');

class PaymentPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            no_of_time: '',
            time_unit: 'day',
            plan_name: '',
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            planList: [],
            currentPlanId : '',
            isEdit : false,
            letterCount : 0
        };
    }

    componentWillMount() {
        this.loadAllPlan();
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    fieldValue(event, fieldType) {
        if (fieldType == 'number') {
            this.setState({
                no_of_time: event.target.value
            });
        }

        if (fieldType == 'unit') {
            this.setState({
                time_unit: event.target.value
            });
        }

        if (fieldType == 'name') {
            this.setState({
                plan_name: event.target.value,
                letterCount : event.target.value.length
            });
        }
    }

    loadAllPlan() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'plan/all/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            this.setState({
                planList: response.data
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

    edit(data) {
        console.log(data);
        this.setState({
            no_of_time: data.no_of_time,
            time_unit: data.time_unit,
            plan_name: data.plan_name,
            currentPlanId : data.id,
            isEdit : true
        })
    }

    delete(id) {
        console.log(id)
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover plan!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                this.cancel();
                axios({
                    method: 'DELETE',
                    url: url.LOCAL_BASE_URL + 'plan/delete/' + id,
                    headers: { 'authorization': this.state.authorization }
                }).then((response) => {
                    swal("Delete!!", "Plan deleted", "success");
                    this.loadAllPlan();
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
        });
    }

    update() {
        if (this.state.no_of_time && this.state.time_unit && this.state.plan_name && this.state.letterCount < 46) {
            var data = {
                id: this.state.currentPlanId,
                no_of_time: this.state.no_of_time,
                time_unit: this.state.time_unit,
                plan_name: this.state.plan_name
            }

            axios({
                method: 'PUT',
                url: url.LOCAL_BASE_URL + 'plan/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.loadAllPlan();
                this.cancel();
                swal("Great!", response.data.message, "success");
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
            swal("Oops!", "Please enter mandatory filed", "error");
        }
    }

    cancel() {
        this.setState({
            no_of_time: '',
            time_unit: 'day',
            plan_name: '',
            isEdit : false
        })
    }

    save() {
        if (this.state.no_of_time && this.state.time_unit && this.state.plan_name && this.state.letterCount < 46) {
            var data = {
                no_of_time: this.state.no_of_time,
                time_unit: this.state.time_unit,
                plan_name: this.state.plan_name,
                created_by: this.state.memberInfo.id
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'plan/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.cancel();
                this.loadAllPlan();
                swal("Great!", response.data.message, "success");
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
            swal("Oops!", "Please enter all fileds", "error");
        }
    }

    render() {

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        var planList = this.state.planList.map((data, index) => {
            return <tr key={index}>
                <th>{(index + 1)}</th>
                <td>{data.plan_name}</td>
                <td>{data.no_of_time}</td>
                <td>{data.time_unit}</td>
                <td className="td-actions">
                    <i className="fa fa-pencil-square-o text-info" aria-hidden="true" onClick={() => this.edit(data)}></i>
                </td>
                <td className="td-actions">
                    <i className="fa fa-trash text-danger" aria-hidden="true" onClick={() => this.delete(data.id)}></i>
                </td>
            </tr>
        });

        return <Col md={12}>
            <Card
                title="Add Payment Plan"
                content={<div>
                    <Row>
                        <Col md={4}>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel><b>Enter No. Of Day/Month/Year<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <input type="number" className="form-control" name="number" placeholder="Enter a number" required="required" value={this.state.no_of_time} onChange={(e) => this.fieldValue(e, 'number')} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel><b>Select Day/Month/Year<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <FormControl componentClass="select" value={this.state.time_unit} onChange={(e) => this.fieldValue(e, 'unit')}>
                                    <option value="day">Day</option>
                                    <option value="months">Month</option>
                                    <option value="years">Year</option>
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel><b>Plan Name<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <input type="text" className={this.state.letterCount > 45 ? 'form-control border-color-red' : 'form-control'} name="planName" placeholder="Enter plan name" required="required" value={this.state.plan_name} onChange={(e) => this.fieldValue(e, 'name')} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row style={!this.state.isEdit ? show : hide}>
                        <Col md={12}>
                            <Button bsStyle="info" fill onClick={() => this.save()} bsSize="small">Save</Button>
                        </Col>
                    </Row>
                    <Row style={this.state.isEdit ? show : hide}>
                        <Col md={2}>
                            <Button bsStyle="info" fill onClick={() => this.update()} bsSize="small">Update</Button>
                        </Col>
                        <Col md={3}>
                            <Button bsStyle="info" fill onClick={() => this.cancel()} bsSize="small">Cancel</Button>
                        </Col>
                    </Row><hr />
                    <hr />
                    <Row>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <td>Plan Name</td>
                                        <td>Time</td>
                                        <td>Unit</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planList}
                                </tbody>
                            </table>
                        </div>
                    </Row>
                </div>
                }
            />
        </Col>;
    };
}

export default PaymentPlan;