import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";

import { Card } from "../../components/Card/Card.jsx";
import { FormInputs } from "../../components/FormInputs/FormInputs.jsx";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';
import swal from 'sweetalert';
import * as url from '../../baseUrl';
import 'react-datepicker/dist/react-datepicker.css';

var moment = require('moment');
var $ = require("jquery");
const axios = require('axios');

class MedicalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issueDate: moment(),
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            subMmeberId : this.props.subMemberId,
            medical_issue: '',
            count : 0,
            errorArea : false,
            medicalList : [],
            isEdit : false,
            currentMedicalId : 0
        };

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillMount() {
        this.loadAllMedical();
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    handleDateChange(date) {
        if(date) {
            this.setState({
                issueDate: date
            });
        } else {
            this.setState({
                issueDate: ''
            });
        }
    }

    fieldValue(event) {
        this.setState({
            medical_issue : event.target.value,
            count : event.target.value.length
        })
    }

    loadAllMedical() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'medical/all/member/' + this.state.subMmeberId,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            this.setState({
                medicalList : response.data
            })
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

    save() {
        if(this.state.count > 0 && this.state.count <= 450) {
            var date = moment(this.state.issueDate).format('YYYY-MM-DD');
            var data = {
                medical_issue_date : (date == "Invalid date" ? null : date),
                issue : this.state.medical_issue,
                sub_member_id : this.state.subMmeberId,
                created_by : this.state.memberInfo.id
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'medical/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                swal("Great!", response.data.message, "success");
                this.loadAllMedical();
                this.cancel();
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

    edit(data) {
        //console.log(data.medical_issue_date == null? moment() : moment(data.medical_issue_date));
        this.setState({
            issueDate : data.medical_issue_date == null? '' : moment(data.medical_issue_date),
            medical_issue : data.issue,
            count : data.issue.length,
            isEdit : true,
            currentMedicalId : data.id
        });
    }

    delete(id) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover medical issue!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) => {
              this.cancel();
            if (willDelete) {
              axios({
                method: 'DELETE',
                url: url.LOCAL_BASE_URL + 'medical/delete/' +id,
                headers: { 'authorization': this.state.authorization }
              }).then((response) => {
                swal("Delete!!", "Medical issue deleted", "success");
                this.loadAllMedical();
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
        if(this.state.count > 0 && this.state.count <= 450) {
            var data = {
                id : this.state.currentMedicalId,
                medical_issue_date : this.state.issueDate ? moment(this.state.issueDate).format('YYYY-MM-DD') : null,
                issue : this.state.medical_issue
            }

            axios({
                method: 'PUT',
                url: url.LOCAL_BASE_URL + 'medical/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                swal("Great!", response.data.message, "success");
                this.loadAllMedical();
                this.cancel();
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
            issueDate : moment(),
            medical_issue : '',
            count : 0
        });
    }

    render() {
        var medicalList = this.state.medicalList.map((data, index) => {
            return <tr key={index}>
                <td>{(index + 1)}</td>
                <td>{data.medical_issue_date == null ? '' : moment(data.medical_issue_date).format('DD-MMM-YYYY')}</td>
                <td>{data.issue}</td>
                <td className="td-actions">
                    <i className="fa fa-pencil-square-o text-info" aria-hidden="true" onClick={()=>this.edit(data)}></i>
                </td>
                <td className="td-actions">
                    <i className="fa fa-trash text-danger" aria-hidden="true" onClick={()=>this.delete(data.id)}></i>
                </td>
            </tr>
        });

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        return <Col md={12}>
            <Card
                title="Medical History"
                content={
                    <div className="content">
                        <Row>
                            <Col md={3}>
                                <FormGroup controlId="formControlsSelectMultiple">
                                    <ControlLabel><b>Medical Issue Date</b></ControlLabel>
                                    <DatePicker
                                        className="form-control"
                                        selected={this.state.issueDate}
                                        onChange={this.handleDateChange}
                                        dateFormat="YYYY-MM-DD"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={1}></Col>
                            <Col md={8}>
                                <ControlLabel><b>Medical Issue Details<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <FormControl componentClass="textarea"  onChange={e=>this.fieldValue(e)} value={this.state.medical_issue} className={this.state.count > 451 ? 'border-color-red' : ''}/>
                                <span className="pull-right cherector-count-color">{this.state.count}/450</span>
                            </Col>
                        </Row><br />
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
                        </Row><hr/>
                        <Row>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <td>Problem Date</td>
                                            <td>Problem Details</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       {medicalList}
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

export default MedicalAdd;