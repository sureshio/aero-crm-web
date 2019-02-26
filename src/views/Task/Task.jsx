import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import CKEditor from "react-ckeditor-component";
import Select from 'react-select';
import { Redirect } from 'react-router';

import { Card } from "../../components/Card/Card.jsx";
import Button from '../../components/CustomButton/CustomButton';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import swal from 'sweetalert';
import * as url from '../../baseUrl';
var moment = require('moment');

var $ = require("jquery");
const axios = require('axios');

class Task extends Component {

    constructor(props) {
        super(props);

        if (!localStorage.getItem('x-token') || !localStorage.getItem('memberInfo')) {
            window.location.href = '/';
        }

        this.updateContent = this.updateContent.bind(this);
        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            subMemberList: [],
            content: '',
            taskListRender : false,
            selectedMembers: null,
            task_date: moment(),
            count : 0
        }

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillMount() {
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

    componentDidMount() {
        $('#sidebar').show();
    }

    handleDateChange(date) {
        this.setState({
            task_date: date
        });
    }

    handleChange = (selectedMembers) => {
        //console.log(selectedMembers);
        this.setState({ selectedMembers });
    }

    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

    onChange(evt) {
        var newContent = evt.editor.getData();
        this.setState({
            content: newContent,
            count : newContent.length
        })
    }

    onBlur(evt) {
        console.log("onBlur event called with event info: ", evt);
    }

    afterPaste(evt) {
        console.log("afterPaste event called with event info: ", evt);
    }

    saveTask() {
        if (this.state.selectedMembers && this.state.selectedMembers.length > 0 && this.state.content && this.state.task_date && this.state.count < 801) {
            
            var arrayId = [];
            for(var i=0; i<this.state.selectedMembers.length; i++) {
                arrayId.push(this.state.selectedMembers[i].value);
                
            }

            var data = {
                assign_to : arrayId,
                assign_by : this.state.memberInfo.id,
                task : this.state.content,
                task_date : moment(this.state.task_date).format('YYYY-MM-DD HH:MM')
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'task/create',
                data : data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => { 
                swal({
                    title: "Great!",
                    text: "Task created",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        this.setState({
                            taskListRender : true
                        });
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
            swal("Oops!", "Please enter all fileds", "error");
        }
    }

    render() {

        if(this.state.taskListRender) {
            return <Redirect push to="/list" />;
        }

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        return <div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Add Task"
                            content={
                                <div className="content">
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <ControlLabel><b>Select Members<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                <Select
                                                    value={this.state.selectedMembers}
                                                    onChange={this.handleChange}
                                                    options={this.state.subMemberList}
                                                    isMulti='true'
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <ControlLabel><b>Task Date<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.task_date}
                                                    onChange={this.handleDateChange}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="YYYY-MM-DD HH:mm"
                                                    timeCaption="time"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <ControlLabel><b>Task Details<span className="text-danger big-font"> *</span></b></ControlLabel>
                                            <CKEditor
                                                activeClass="p10"
                                                content={this.state.content}
                                                events={{
                                                    "blur": ()=>this.onBlur(),
                                                    "afterPaste": ()=>this.afterPaste(),
                                                    "change": e=>this.onChange(e)
                                                }}
                                            />
                                            <span style={this.state.count > 801 ? show : hide} className="pull-left text-danger">Can't exceed 800 characters</span>
                                            <span className="pull-right cherector-count-color">{this.state.count}/800</span>
                                        </Col>
                                    </Row><br />
                                    <Row>
                                        <Col md={12}>
                                            <Button bsStyle="info" fill onClick={() => this.saveTask()}>Save</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>;
    }
}

export default Task;