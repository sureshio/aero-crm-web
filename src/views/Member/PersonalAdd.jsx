import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav } from "react-bootstrap";
import { Card } from "../../components/Card/Card";
import Button from '../../components/CustomButton/CustomButton';
import swal from 'sweetalert';
import * as url from '../../baseUrl';
import 'react-datepicker/dist/react-datepicker.css';

var moment = require('moment');
var $ = require("jquery");
const axios = require('axios');

class PersonalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            subMmeberId: this.props.subMemberId,
            count: 0,
            personal_record: '',
            record_time: '',
            reps_count: 0,
            kg_count : 0,
            hourArr: [],
            minuteArr: [],
            secondArr: [],
            hour: '0',
            minute: '0',
            second: '0',
            isEdit: false,
            personalList:[],
            currentPesonalId : 0
        };
    }

    componentWillMount() {
        this.loadAllPersonal();

        var hourArr = [];
        for (var i = 0; i < 13; i++) {
            hourArr.push(i);
        }

        var minuteArr = [];
        for (var i = 0; i < 60; i++) {
            minuteArr.push(i);
        }

        var secondArr = [];
        for (var i = 0; i < 60; i++) {
            secondArr.push(i);
        }

        this.setState({
            hourArr: hourArr,
            minuteArr: minuteArr,
            secondArr: secondArr
        });
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    fieldValue(event, filedName) {
        if (filedName == 'reps') {
            this.setState({
                reps_count: event.target.value
            });
        } if(filedName == 'kg') {
            this.setState({
                kg_count: event.target.value
            });
        } if(filedName == 'area') {
            this.setState({
                personal_record: event.target.value,
                count: event.target.value.length
            })
        }
    }

    loadAllPersonal() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'personal/all/member/' + this.state.subMmeberId,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            console.log(response.data);
            this.setState({
                personalList: response.data
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

    onChange(data, dropName) {
        if (dropName == 'hour') {
            this.setState({
                hour: data.target.value
            });
        }

        if (dropName == 'min') {
            this.setState({
                minute: data.target.value
            });
        }

        if (dropName == 'sec') {
            this.setState({
                second: data.target.value
            });
        }
    }

    save() {
        if (this.state.count > 0 && this.state.count <= 450) {
            var data = {
                reps: this.state.reps_count,
                kg : this.state.kg_count,
                details: this.state.personal_record,
                time: this.state.hour + ':' + this.state.minute + ':' + this.state.second,
                sub_member_id: this.state.subMmeberId,
                created_by: this.state.memberInfo.id
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'personal/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.cancel();
                this.loadAllPersonal();
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

    edit(data) {
        var hour = 0;
        var minute = 0;
        var second = 0;

        if(data.time) {
            var splitStr = data.time.split(':');
            hour = splitStr[0];
            minute = splitStr[1];
            second = splitStr[2];
        }

        this.setState({
            isEdit: true,
            record_time: '',
            reps_count: data.reps,
            kg_count : data.kg,
            personal_record: data.details,
            count: data.details.length,
            hour: hour,
            minute: minute,
            second: second,
            currentPesonalId: data.id
        });
    }

    delete(id) {
        console.log(id)
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover personal record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios({
                    method: 'DELETE',
                    url: url.LOCAL_BASE_URL + 'personal/delete/' + id,
                    headers: { 'authorization': this.state.authorization }
                }).then((response) => {
                    swal("Delete!!", "Personal record deleted", "success");
                    this.loadAllPersonal();
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
            }
        });
    }

    update() {
        if (this.state.count > 0 && this.state.count <= 450) {
            var data = {
                id: this.state.currentPesonalId,
                reps: this.state.reps_count,
                kg : this.state.kg_count,
                details: this.state.personal_record,
                time: this.state.hour + ':' + this.state.minute + ':' + this.state.second,
            }

            axios({
                method: 'PUT',
                url: url.LOCAL_BASE_URL + 'personal/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                this.loadAllPersonal();
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
            isEdit: false,
            record_time: '',
            reps_count: '',
            kg_count : '',
            personal_record: '',
            count: 0,
            hour: '0',
            minute: '0',
            second: '0'
        });
    }

    render() {
        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        var hour = this.state.hourArr.map((data, index) => {
            return <option value={data}>{data}</option>
        });

        var minute = this.state.minuteArr.map((data, index) => {
            return <option value={data}>{data}</option>
        });

        var second = this.state.secondArr.map((data, index) => {
            return <option value={data}>{data}</option>
        });

        var personalList = this.state.personalList.map((data, index) => {
            return <tr key={index}>
                <td>{(index + 1)}</td>
                <td>{data.details}</td>
                <td>{data.reps}</td>
                <td>{data.kg}</td>
                <td>{data.time}</td>
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
                title="Personal Record"
                content={
                    <div className="content">
                        <Row>
                            <Col md={3}>
                                <ControlLabel><b>Reps</b></ControlLabel>
                                <input type="number" className="form-control" name="reps" placeholder="Enter reps" required="required" value={this.state.reps_count} onChange={(e) => this.fieldValue(e, 'reps')} />
                            </Col>
                            <Col md={3}>
                                <ControlLabel><b>Kg</b></ControlLabel>
                                <input type="number" className="form-control" name="kg" placeholder="Enter kilogram" required="required" value={this.state.kg_count} onChange={(e) => this.fieldValue(e, 'kg')} />
                            </Col>
                            <Col md={6}>
                                <FormGroup controlId="formControlsSelectMultiple">
                                    <ControlLabel><b>Time</b></ControlLabel><br />
                                    <Row>
                                        <Col md={4}>
                                            <select className="form-control" value={this.state.hour} onChange={(e) => this.onChange(e, 'hour')}>
                                                <option value="">Hour</option>
                                                {hour}
                                            </select>
                                        </Col>
                                        <Col md={4}>
                                            <select className="form-control" value={this.state.minute} onChange={(e) => this.onChange(e, 'min')}>
                                                <option value="">Minute</option>
                                                {minute}
                                            </select>
                                        </Col>
                                        <Col md={4}>
                                            <select className="form-control" value={this.state.second} onChange={(e) => this.onChange(e, 'sec')}>
                                                <option value="">Second</option>
                                                {second}
                                            </select>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <ControlLabel><b>Personal Record Details<span className="text-danger big-font"> *</span></b></ControlLabel>
                                <FormControl componentClass="textarea" onChange={e => this.fieldValue(e, 'area')} value={this.state.personal_record} className={this.state.count > 450 ? 'border-color-red' : ''} />
                                <span className="pull-right cherector-count-color">{this.state.count}/450</span>
                            </Col>
                        </Row>
                        <br />
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
                        <Row>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <td>Records Details</td>
                                            <td>Reps</td>
                                            <td>Kg</td>
                                            <td>Time</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personalList}
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

export default PersonalAdd;