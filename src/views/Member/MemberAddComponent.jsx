import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Navbar, NavItem, Nav, Image } from "react-bootstrap";

import { Card } from "../../components/Card/Card.jsx";
import { FormInputs } from "../../components/FormInputs/FormInputs.jsx";
import Button from '../../components/CustomButton/CustomButton';
import { Redirect } from 'react-router';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import avatar from "assets/img/faces/face-0.jpg";

import swal from 'sweetalert';
import * as url from '../../baseUrl';
var moment = require('moment');

var $ = require("jquery");
const axios = require('axios');

class MemberAddComponent extends Component {
    constructor(props) {
        super(props);

        if (!localStorage.getItem('x-token') || !localStorage.getItem('memberInfo')) {
            window.location.href = '/';
        }

        if (localStorage.getItem('dashboard')) {
            localStorage.removeItem('dashboard');
            window.location.reload(true);
        }

        this.state = {
            authorization: 'Basic ' + localStorage.getItem('x-token'),
            memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
            redirect: false,
            redirectToDashboard: false,
            radio: "1",
            age: '10',
            name: 'hai',
            first_name: '',
            last_name: '',
            email: '',
            gender: '',
            payment_plan: '',
            phone_number: '',
            address: '',
            errorFn: false,
            errorLn: false,
            errorEmail: false,
            errorGender: false,
            errorPlan: false,
            errorPhone: false,
            errorAddress: false,
            countFn: 0,
            countLn: 0,
            countAddress : 0,
            isEmailUsed: false,
            isInValidEmail: false,
            viewImage: avatar,
            insertedId: '',
            imageData: null,
            planList: [],
            notValidFn : false,
            notValidLn : false,
            notValidPhone : false,
            phoneCount : 0
        };
    }

    componentWillMount() {
        this.loadAllPlan();
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    nevigateToPage() {
        this.setState({ redirect: true });
    }

    handleRadio = event => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

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

    fieldValue(fildName, event) {

        if (fildName == 'firstName') {
            var isInVlaid = false;
            var value = event.target.value;
            if(!value.match('^[a-zA-Z ]+$')) {
                isInVlaid = true;
               
            }

            this.setState({
                notValidFn : isInVlaid,
                first_name: value,
                countFn : value.length
            });
        }

        if (fildName == 'lastName') {

            var isInVlaid = false;
            var value = event.target.value;
            if(!value.match('^[a-zA-Z ]+$')) {
                isInVlaid = true;
               
            }

            this.setState({
                notValidLn : isInVlaid,
                last_name: value,
                countLn : value.length
            });
        }

        if (fildName == 'email') {
            this.setState({
                email: event.target.value
            });

            this.validateEmail(event.target.value);
            this.checkEmail(event.target.value);
        }

        if (fildName == 'gender') {
            this.setState({
                gender: event.target.value
            });
        }

        if (fildName == 'plan') {
            this.setState({
                payment_plan: event.target.value
            });
        }

        if (fildName == 'phone') {
            var isInVlaid = false;
            var value = event.target.value;
            if(!value.match('^[0-9]+$')) {
                isInVlaid = true;
            }

            this.setState({
                notValidPhone : isInVlaid,
                phone_number: value,
                phoneCount : value.length
            });

            //this.validatePhonenumber(event.target.value);
        }

        if (fildName == 'address') {
            this.setState({
                address: event.target.value,
                countAddress : event.target.value.length
            });
        }
    }

    validateEmail(emailData) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        var isInvalidEmail = false;

        if (emailData.match(mailformat)) {
            isInvalidEmail = false;
        } else {
            isInvalidEmail = true;
        }

        this.setState({
            isInValidEmail: isInvalidEmail
        });
    }

    validatePhonenumber(data) {
        var phoneno = /^(([0-9]{7})|([0-9]{10}))$$/;
        if (data.match(phoneno)) {
            return true;
        }else {
            return false;
        }
    }

    checkEmail(value) {
        var error = false;

        if (!value) {
            value = null
        }

        axios({
            method: 'POST',
            url: url.LOCAL_BASE_URL + 'submember/email/' + value + '/member/' + this.state.memberInfo.id,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
            error = false;
            this.setState({
                isEmailUsed: error
            });
        }).catch((error) => {
            if (error.response.status == '403') {
                swal({
                    title: "Error",
                    text: "You should login",
                    icon: "error",
                    dangerMode: true,
                })
                    .then(willDelete => {
                        if (willDelete) {
                            window.location.href = '/';
                        }
                    });
            }

            error = true;
            this.setState({
                isEmailUsed: error
            });
        });
    }

    saveMember() {
        this.saveData();
    }

    uploadPicture(id) {

        if (this.state.imageData) {

            var data = this.state.imageData;

            var formData = new FormData();
            var imagefile = data;
            formData.append('profile_image', imagefile);
            axios.post(url.LOCAL_BASE_URL + 'image/upload/image/' + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': this.state.authorization
                }
            })
        }
    }

    saveData() {
        var errorFn = false;
        var errorLn = false;
        var errorEmail = false;
        var errorGender = false;
        var errorPlan = false;
        var errorPhone = false;
        var errorAddress = false;

        if (!this.state.first_name) {
            errorFn = true;
        }

        if (!this.state.last_name) {
            errorLn = true;
        }

        if (!this.state.email) {
            errorEmail = true;
        }

        if (!this.state.gender) {
            errorGender = true;
        }

        if (!this.state.payment_plan) {
            errorPlan = true;
        }

        if (!this.state.phone_number) {
            errorPhone = true;
        }

        if (!this.state.address) {
            errorAddress = true;
        }

        this.setState({
            errorFn: errorFn,
            errorLn: errorLn,
            errorEmail: errorEmail,
            errorGender: errorGender,
            errorPlan: errorPlan,
            errorPhone: errorPhone,
            errorAddress: errorAddress
        });

        if (!errorFn && !errorLn && !errorEmail && !errorGender && !errorPlan && !errorPhone && !errorPhone && this.state.countFn < 46 && this.state.countLn < 46 && this.state.countAddress < 121 && !this.state.notValidFn && !this.state.notValidLn && !this.state.notValidPhone) {

            // var last_payment_date = '';
            // if (this.state.payment_plan == 'Drop In') {
            //     last_payment_date = moment().add(1, 'day').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == 'Monthly') {
            //     last_payment_date = moment().add(1, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == '3 Months') {
            //     last_payment_date = moment().add(3, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == '6 Months') {
            //     last_payment_date = moment().add(6, 'months').format('YYYY-MM-DD');
            // } else if (this.state.payment_plan == 'Year') {
            //     last_payment_date = moment().add(1, 'years').format('YYYY-MM-DD');
            // }

            var strPlan = this.state.payment_plan.split('_');
            var last_payment_date = moment().add(strPlan[0], strPlan[1]).format('YYYY-MM-DD');
            var paymentPlanId = this.state.payment_plan.split('_');

            var data = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                gender: this.state.gender,
                created_by: this.state.memberInfo.id,
                payment_plan: this.state.payment_plan,
                payment_start_date: moment().format('YYYY-MM-DD'),
                last_payment_date: last_payment_date,
                phone_number: this.state.phone_number,
                address: this.state.address,
                payment_plan_id: paymentPlanId[2]
            }

            axios({
                method: 'POST',
                url: url.LOCAL_BASE_URL + 'submember/create',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {
                console.log(response.data);
                this.uploadPicture(response.data.id);
                swal({
                    title: "Great!",
                    text: "New profile created",
                    icon: "success",
                    dangerMode: true,
                }).then(willDelete => {
                    if (willDelete) {
                        this.setState({
                            redirectToDashboard: true
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
            swal("Oops!", "Please enter all fileds and make valid entry", "error");
        }
    }

    fileChange(event) {
        var image = event.target.files[0];
        console.log(image.width);
        // var _size = image.size;
        // var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        // i=0;while(_size>900){_size/=1024;i++;}
        // var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
        // alert(exactSize);

        if(image.name.indexOf('.png') != -1 || image.name.indexOf('.jpg') != -1 || image.name.indexOf('.jpeg') != -1 || image.name.indexOf('.PNG') != -1 || image.name.indexOf('.JPG') != -1 || image.name.indexOf('.JPEG') != -1) { 
            this.setState({
                viewImage: URL.createObjectURL(image),
                imageData: image
            });
        } else {
            swal("Oops!", "Select .png, .jpg or .jpeg file only", "error");
        }
    }


    render() {

        if (this.state.redirect) {
            return <Redirect push to="/dashboard" />;
        }

        if (this.state.redirectToDashboard) {
            return <Redirect push to="/dashboard" />;
        }

        const show = {
            'display': 'block'
        }

        const hide = {
            'display': 'none'
        }

        var planList = this.state.planList.map((data, index) => {
            var value = data.no_of_time + '_' + data.time_unit + '_' + data.id;
            return <option key={index} value={value}>{data.plan_name}</option>
        });

        return <div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="Add Member"
                            content={<div>
                                <Row>
                                    <Col md={2}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Image src={this.state.viewImage} height="120px" width="120px" circle />
                                            </Col>
                                        </Row><br />
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <div className="upload-btn-wrapper">
                                                    <button className="btn-upload">Select Image</button>
                                                    <input type="file" name="myfile" onChange={(e) => this.fileChange(e)} />
                                                </div>
                                            </Col>
                                        </Row><br />
                                    </Col>
                                    <Col md={10}>
                                        <Row>
                                            <Col md={12}>
                                                <Row>

                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>First Name<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="text" className={this.state.countFn > 45 ? 'form-control border-color-red' : 'form-control'} placeholder="Enter first name" required="required" value={this.state.first_name} onChange={e => this.fieldValue('firstName', e)} />
                                                            <span className="text-danger" style={this.state.notValidFn && this.state.first_name.length > 0 ? show : hide}>Enter only letters.</span>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Last Name<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="text" className={this.state.countLn > 45 ? 'form-control border-color-red' : 'form-control'} name="lastName" placeholder="Enter last name" required="required" value={this.state.last_name} onChange={e => this.fieldValue('lastName', e)} />
                                                            <span className="text-danger" style={this.state.notValidLn && this.state.last_name.length > 0 ? show : hide}>Enter only letters.</span>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Email address<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="email" className="form-control" name="email" placeholder="Enter email" required="required" value={this.state.email} onChange={e => this.fieldValue('email', e)} />
                                                            <span className="text-danger" style={this.state.isEmailUsed && this.state.email.length > 0? show : hide}>Already created</span>
                                                            <span className="text-danger" style={this.state.isInValidEmail == true && this.state.email.length > 0 ? show : hide}>Not a valid email</span>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Gender<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <select className="form-control" value={this.state.gender} onChange={e => this.fieldValue('gender', e)}>
                                                                <option value="">Select</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Phone Number<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="number" className="form-control" name="phone" placeholder="Enter phone number" required="required" value={this.state.phone_number} onChange={e => this.fieldValue('phone', e)} />
                                                            <span className="text-danger" style={this.state.notValidPhone && this.state.phone_number.length > 0 &&  this.state.phoneCount != 10 ? show : hide}>Enter number only.</span>
                                                            {/* <span className="text-danger" style={this.state.phoneCount > 0 && this.state.phoneCount != 10 ? show : hide}>Enter 10 digit number only.</span> */}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Payment Plan<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <select className="form-control" value={this.state.payment_plan} onChange={e => this.fieldValue('plan', e)}>
                                                                <option value="">Select</option>
                                                                {planList}
                                                            </select>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Address<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <FormGroup controlId="formControlsSelectMultiple">
                                                                <input type="text" className={this.state.countAddress > 120 ? 'form-control border-color-red' : 'form-control'} name="address" placeholder="Enter address" value={this.state.address} onChange={e => this.fieldValue('address', e)} required="required" />
                                                            </FormGroup>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Button bsStyle="info" fill onClick={() => this.saveMember()}>Save</Button>
                                    </Col>
                                </Row>
                            </div>
                            }
                        />
                    </Col>
                </Row>
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

export default MemberAddComponent;