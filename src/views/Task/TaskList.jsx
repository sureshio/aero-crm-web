import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import CKEditor from "react-ckeditor-component";
import Select from 'react-select';

import { Card } from "../../components/Card/Card.jsx";
import Button from '../../components/CustomButton/CustomButton';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import swal from 'sweetalert';
import * as url from '../../baseUrl';
import Pagination from "react-js-pagination";
var moment = require('moment');

require("bootstrap/less/bootstrap.less");

var $ = require("jquery");
const axios = require('axios');

class TaskList extends Component {

    constructor(props) {
        super(props);

        if (!localStorage.getItem('x-token') || !localStorage.getItem('memberInfo')) {
            window.location.href = '/';
        }

        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            selectedMembers: null,
            subMemberList: [],
            searchDate: '',
            taskList: [],
            originalTaskListLength: 0,
            activePage: 1
        }

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillMount() {
        this.getSubMemberList();
        this.loadAllData();
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

    loadAllData() {
        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'task/all/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            this.setState({
                taskList: response.data,
                originalTaskListLength: response.data.length,
                searchDate: '',
                selectedMembers : null
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
            searchDate: date
        });
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber });
    }

    handleChange = (selectedMembers) => {
        this.setState({ selectedMembers });
        console.log(`Option selected:`, selectedMembers);
    }

    onChange(evt) {
        console.log("onChange fired with event info: ", evt);
        var newContent = evt.editor.getData();
        this.setState({
            content: newContent
        })
    }

    onBlur(evt) {
        console.log("onBlur event called with event info: ", evt);
    }

    afterPaste(evt) {
        console.log("afterPaste event called with event info: ", evt);
    }

    search() {

        var arrayId = [];
        if (this.state.selectedMembers && this.state.selectedMembers.length > 0) {
            for (var i = 0; i < this.state.selectedMembers.length; i++) {
                arrayId.push(this.state.selectedMembers[i].value);
            }
        }

        var date = '';
        if (this.state.searchDate) {
            date = moment(this.state.searchDate).format('YYYY-MM-DD');
        }

        var searchData = {
            assign_to: arrayId,
            task_date: date,
            assign_by: this.state.memberInfo.id
        }

        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'task/search',
            data: searchData,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            console.log(response.data);
            this.setState({
                taskList: response.data,
                originalTaskListLength: response.data.length
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

    render() {

        var indexOfLastTodo = this.state.activePage * url.ITEM_COUNT_PER_PAGE;
        var indexOfFirstTodo = indexOfLastTodo - url.ITEM_COUNT_PER_PAGE;
        var renderedProjects = this.state.taskList.slice(indexOfFirstTodo, indexOfLastTodo);

        var taskData = renderedProjects.map((data, index) => {
            return <tr key={index}>
                <td>{index + 1}</td>
                <td>{moment(data.task_date).format('DD-MMM-YYYY')}</td>
                <td>
                    <div dangerouslySetInnerHTML={{ __html: data.task }} />
                </td>
                <td>{data.first_name} {data.last_name}</td>
            </tr>
        });

        return <div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="View Task"
                            content={
                                <div className="content">
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <ControlLabel><b>Select Members</b></ControlLabel>
                                                <Select
                                                    value={this.state.selectedMembers}
                                                    onChange={this.handleChange}
                                                    options={this.state.subMemberList}
                                                    isMulti='true'
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <ControlLabel><b>Task Date</b></ControlLabel>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={this.state.searchDate}
                                                    onChange={this.handleDateChange}
                                                    dateFormat="YYYY-MM-DD"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={1}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <br />
                                                <Button bsStyle="info" fill bsSize="small" onClick={() => this.search()}>Search</Button>
                                            </FormGroup>
                                        </Col>
                                        <Col md={1}>
                                            <FormGroup controlId="formControlsSelectMultiple">
                                                <br />
                                                <Button bsStyle="info" fill bsSize="small" onClick={() => this.loadAllData()}>Refresh</Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <td>Task Date</td>
                                                            <td>Task</td>
                                                            <td>Assign To</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {taskData}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div>
                                            <Pagination
                                                activePage={this.state.activePage}
                                                itemsCountPerPage={url.ITEM_COUNT_PER_PAGE}
                                                totalItemsCount={this.state.originalTaskListLength}
                                                pageRangeDisplayed={url.ITEM_COUNT_PER_PAGE}
                                                onChange={this.handlePageChange.bind(this)}
                                            />
                                        </div>
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

export default TaskList;