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

class DetailsEdit extends Component {
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
            countFn: 0,
            countLn: 0,
            countAddress : 0,
            isEmailUsed: false,
            isInValidEmail: false,
            isUpdate: false,
            modalIsOpen: false,
            amount: '',
            paymentList: [],
            viewImage : avatar,
            planList : [],
            isImageDelete : false,
            imageData : null,
            onErrorImage : null,
            notValidFn : false,
            notValidLn : false,
            notValidPhone : false,
            phoneCount : 0
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        $('#sidebar').show();
    }

    handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    fieldChange(event) {
        this.setState({
            email: event.target.value
        });

        this.validateEmail(event.target.value);
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

    handleRadio = event => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentWillMount() {
        this.loadMemberData();
        this.loadProfileImage();
        this.loadPaymentData();
        this.loadAllPlan();
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

    loadProfileImage() {
        this.setState({
            viewImage : url.IMAGE_URL + this.state.subMemberId + '.jpg'
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
                payment_plan: data.no_of_time + '_' + data.time_unit + '_' + data.plan_id,
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

    handleDateChange(date) {
        this.setState({
            last_payment_date: date
        });
    }

    nevigateToPage() {
        this.setState({ redirect: true });
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {

    }

    closeModal() {
        this.setState({ modalIsOpen: false });
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
            // var last_payment_date = '';
            // if (event.target.value == 'Drop In') {
            //     last_payment_date = moment(this.state.payment_start_date).add(1, 'day').format('YYYY-MM-DD');
            // } else if (event.target.value == 'Monthly') {
            //     last_payment_date = moment(this.state.payment_start_date).add(1, 'months').format('YYYY-MM-DD');
            // } else if (event.target.value == '3 Months') {
            //     last_payment_date = moment(this.state.payment_start_date).add(3, 'months').format('YYYY-MM-DD');
            // } else if (event.target.value == '6 Months') {
            //     last_payment_date = moment(this.state.payment_start_date).add(6, 'months').format('YYYY-MM-DD');
            // } else if (event.target.value == 'Year') {
            //     last_payment_date = moment(this.state.payment_start_date).add(1, 'years').format('YYYY-MM-DD');
            // }

            var strPlan = event.target.value.split('_');
            var last_payment_date = moment(this.state.payment_start_date).add(strPlan[0], strPlan[1]).format('YYYY-MM-DD');

            this.setState({
                payment_plan: event.target.value,
                last_payment_date: last_payment_date
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

    editMember() {
        this.setState(
            { isUpdate: true }
        );
    }

    fileChange(event) {
        var image = event.target.files[0];
        if(image.name.indexOf('.png') != -1 || image.name.indexOf('.jpg') != -1 || image.name.indexOf('.jpeg') != -1 || image.name.indexOf('.PNG') != -1 || image.name.indexOf('.JPG') != -1 || image.name.indexOf('.JPEG') != -1) { 
            this.setState({
                viewImage: URL.createObjectURL(image),
                imageData: image
            });
        } else {
            swal("Oops!", "Select .png, .jpg or .jpeg file only", "error");
        }
    }

    uploadPicture() {

        if (this.state.imageData) {

            var data = this.state.imageData;

            var formData = new FormData();
            var imagefile = data;
            formData.append('profile_image', imagefile);
            axios.post(url.LOCAL_BASE_URL + 'image/upload/image/' + this.state.subMemberId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': this.state.authorization
                }
            })
        }
    }

    updateMember() {

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

        if (!errorFn && !errorLn && !errorEmail && !errorGender && !errorPlan && !errorPhone && !errorAddress && this.state.countFn < 46 && this.state.countLn < 46 && this.state.countAddress < 121 && !this.state.notValidFn && !this.state.notValidLn && !this.state.notValidPhone) {

            var paymentPlanId = this.state.payment_plan.split('_');

            var data = {
                id: this.state.subMemberId,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                gender: this.state.gender,
                payment_plan: this.state.payment_plan,
                payment_start_date: this.state.payment_start_date,
                last_payment_date: moment(this.state.last_payment_date).format('YYYY-MM-DD'),
                phone_number: this.state.phone_number,
                address: this.state.address,
                payment_plan_id : paymentPlanId[2]
            }

            axios({
                method: 'PUT',
                url: url.LOCAL_BASE_URL + 'submember/update',
                data: data,
                headers: { 'authorization': this.state.authorization }
            }).then((response) => {

                this.uploadPicture();
                swal({
                    title: "Great!",
                    text: "Update Success",
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

    uploadPicture() {
    
        if(this.state.imageData) {
           
            var data = this.state.imageData;
            
            var formData = new FormData();
            var imagefile = data;
            formData.append('profile_image', imagefile);
            axios.post(url.LOCAL_BASE_URL + 'image/upload/image/' + this.state.subMemberId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': this.state.authorization
                }
            })
        }
    }

    cancel() {
        window.location.reload(true);
    }

    removeImage() {
        axios({
            method: 'DELETE',
            url: url.LOCAL_BASE_URL + 'image/delete/image/' + this.state.subMemberId,
            headers: { 'authorization': this.state.authorization }
        }).then((response) => {
           this.setState({
               viewImage : avatar,
               isImageDelete : true
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

    onErrorImage() {
        this.setState({
            viewImage : avatar
        });
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

        var planList = this.state.planList.map((data, index) => {
            var value = data.no_of_time + '_' + data.time_unit + '_' + data.id;
            return <option key={index} value={value}>{data.plan_name}</option>
        });

        return <div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title="View Member"
                            content={<div>
                                <Row>
                                    <Col md={2}>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Image src={this.state.viewImage} onError={()=>this.onErrorImage()} height="120px" width="120px" circle />
                                            </Col>
                                        </Row><br />
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <div className="upload-btn-wrapper" style={this.state.isUpdate == true ? show : hide}>
                                                    <button className="btn-upload">Change Image</button>
                                                    <input type="file" name="myfile" onChange={(e) => this.fileChange(e)} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={10}>
                                        <Row>
                                            <Col md={12}>
                                                <Row>

                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>First Name<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="text" className={this.state.countFn > 45 ? 'form-control border-color-red' : 'form-control'} name="firstName" placeholder="Enter first name" required="required" value={this.state.first_name} onChange={e => this.fieldValue('firstName', e)} disabled={!this.state.isUpdate} />
                                                            <span className="text-danger" style={this.state.notValidFn && this.state.first_name.length > 0 ? show : hide}>Enter only letters.</span>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Last Name<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="text" className={this.state.countLn > 45 ? 'form-control border-color-red' : 'form-control'} name="lastName" placeholder="Enter last name" required="required" value={this.state.last_name} onChange={e => this.fieldValue('lastName', e)} disabled={!this.state.isUpdate} />
                                                            <span className="text-danger" style={this.state.notValidLn && this.state.last_name.length > 0 ? show : hide}>Enter only letters.</span>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4} sm={12}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Email address<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="email" className="form-control" name="email" placeholder="Enter email" required="required" value={this.state.email} onChange={e => this.fieldValue('email', e)} disabled="true" />
                                                            <span className="text-danger" style={this.state.isInValidEmail == true && this.state.email.length > 0 ? show : hide}>Not a valid email</span>
                                                            <span className="text-danger" style={this.state.isEmailUsed && this.state.email.length > 0 ? show : hide}>Already created</span>
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
                                                            <select className="form-control" value={this.state.gender} onChange={e => this.fieldValue('gender', e)} disabled={!this.state.isUpdate}>
                                                                <option value="">Select</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Phone Number<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <input type="number" className="form-control" name="phone" placeholder="Enter phone number" required="required" value={this.state.phone_number} onChange={e => this.fieldValue('phone', e)} disabled={!this.state.isUpdate} />
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
                                                            <select className="form-control" value={this.state.payment_plan} onChange={e => this.fieldValue('plan', e)} disabled={!this.state.isUpdate}>
                                                                <option value="">Select</option>
                                                               {planList}
                                                            </select>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup controlId="formControlsSelectMultiple">
                                                            <ControlLabel><b>Address<span className="text-danger big-font"> *</span></b></ControlLabel>
                                                            <FormGroup controlId="formControlsSelectMultiple">
                                                                <input type="text" className={this.state.countAddress > 120 ? 'form-control border-color-red' : 'form-control'} name="address" placeholder="Enter address" value={this.state.address} onChange={e => this.fieldValue('address', e)} required="required" disabled={!this.state.isUpdate} />
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
                                        <Row>
                                            <Col md={1} sm={2} style={this.state.isUpdate ? hide : show}>
                                                <Button bsStyle="info" fill bsSize="small" onClick={() => this.editMember()}>Edit</Button>
                                            </Col>
                                            <Col md={1} sm={2} style={!this.state.isUpdate ? hide : show}>
                                                <Button bsStyle="info" fill bsSize="small" onClick={() => this.updateMember()} >Update</Button>
                                            </Col>
                                            <Col md={1} sm={2} style={!this.state.isUpdate ? hide : show}>
                                                <Button bsStyle="info" fill bsSize="small" onClick={() => this.cancel()}>Cancel</Button>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </div>
                            }
                        />
                    </Col>
                </Row>
            </Grid>
        </div>;
    };
}

export default DetailsEdit;