import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card";
import { FormInputs } from "../../components/FormInputs/FormInputs";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import swal from 'sweetalert';
import * as url from '../../baseUrl';
var moment = require('moment');
var $ = require("jquery");
const axios = require('axios');

class ReportTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            categoryName : 'report',
            count : 0,
            isEdit : false,
            title : '',
            isDisable : false,
            currentTitleId : 0,
            letterCount : 0
        };
    }

    componentWillMount() {
        this.loadAllDataByCategory();
    }

    loadAllDataByCategory() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'subject/category/' + this.state.categoryName +'/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            if(response.data.length > 0) {
                this.setState({
                    title : response.data[0].name,
                    isDisable : true,
                    currentTitleId : response.data[0].id
                });
            }
           this.setState({
               count : response.data.length
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

    componentDidMount() {
        $('#sidebar').show();
    }

    save() {
        if(this.state.title && this.state.letterCount < 46) {
            var data = {
                name : this.state.title,
                category : this.state.categoryName,
                created_by : this.state.memberInfo.id
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'subject/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.loadAllDataByCategory();
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

    edit() {
        this.setState({
            isEdit : true,
            isDisable : false
        });
    }

    update() {
        if(this.state.title && this.state.letterCount < 46) {
            var data = {
                id : this.state.currentTitleId,
                name : this.state.title
            }

            axios({
                method: 'PUT',
                url: url.LOCAL_BASE_URL + 'subject/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.loadAllDataByCategory();
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
            isEdit : false,
            isDisable : true
        });
    }

    fieldValue(event) {
        this.setState({
            title : event.target.value,
            letterCount : event.target.value.length
        });
    }

    render() {
        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        return <Col md={12}>
            <Card
                title="Add Report Title"
                content={<div>
                    <Row>
                        <Col md={6}>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel><b>Report Title<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <input type="text" className={this.state.letterCount > 45 ? 'form-control border-color-red' : 'form-control'} name="report" placeholder="Enter report title" required="required" value={this.state.title} onChange={(e)=>this.fieldValue(e)} disabled={this.state.isDisable}/>
                            </FormGroup>
                        </Col>
                        <Col md={2} style={this.state.count == 0 && !this.state.isEdit ? show : hide}><br/>
                            <Button bsStyle="info" fill onClick={() => this.save()}>Save</Button>
                        </Col>
                        <Col md={2} style={this.state.count != 0 && !this.state.isEdit ? show : hide}><br/>
                            <Button bsStyle="info" fill onClick={() => this.edit()}>Edit</Button>
                        </Col>
                        <Col md={2} style={this.state.count != 0 && this.state.isEdit ? show : hide}><br/>
                            <Button bsStyle="info" fill onClick={() => this.update()}>Update</Button>
                        </Col>
                        <Col md={2} style={this.state.count != 0 && this.state.isEdit ? show : hide}><br/>
                            <Button bsStyle="info" fill onClick={() => this.cancel()}>Cancel</Button>
                        </Col>
                    </Row>
                </div>
                }
            />
        </Col>;
    };
}

export default ReportTitle;