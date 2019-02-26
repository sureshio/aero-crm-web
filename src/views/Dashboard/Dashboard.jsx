import React, { Component } from "react";
import { Grid, Row, Col, Tooltip, OverlayTrigger, Image } from "react-bootstrap";
import { Redirect } from 'react-router';
import Button from "../../components/CustomButton/CustomButton";
import { Card } from "../../components/Card/Card.jsx";

import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "../../variables/Variables";

import swal from 'sweetalert';
import * as url from '../../baseUrl';
import Pagination from "react-js-pagination";
var moment = require('moment');

require("bootstrap/less/bootstrap.less");

var $ = require("jquery");
const axios = require('axios');

class Dashboard extends Component {

  constructor(props) {
    super(props);

    if (!localStorage.getItem('x-token') || !localStorage.getItem('memberInfo')) {
      window.location.href = '/';
    }

    if (localStorage.getItem('login')) {
      localStorage.removeItem('login');
      window.location.reload(true);
    }

    this.state = {
      authorization: 'Basic ' + localStorage.getItem('x-token'),
      memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
      memberRedirect: false,
      redirect: false,
      selectedId: 0,
      subMemberList: [],
      subMemberListLength: 0,
      activePage: 1,
      search : ''
    }
  }

  componentWillMount() {
    this.loadAllData();
  }

  loadAllData() {
    axios({
      method: 'POST',
      url: url.LOCAL_BASE_URL + 'submember/all/member/' + this.state.memberInfo.id,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      this.setState({
        subMemberList: response.data,
        subMemberListLength: response.data.length
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
    });
  }

  componentDidMount() {
    $('#sidebar').show();
  }

  nevigateToPage() {
    localStorage.setItem('dashboard', 'dashboard');
    this.setState({ redirect: true });
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  viewSubMember(id) {
    localStorage.setItem('member', 'member');
    this.setState({
      memberRedirect: true,
      selectedId: id
    });
  }

  deleteSubMember(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover member!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios({
          method: 'DELETE',
          url: url.LOCAL_BASE_URL + 'submember/delete/' + id,
          headers: { 'authorization': this.state.authorization }
        }).then((response) => {
          swal("Delete!!", "Member deleted", "success");
          this.loadAllData();
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

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  }

  fieldValue(fildName, event) {
    if (fildName == 'search') {
      var data = ''
      if(event.target.value) {
        data = event.target.value;
      }

      this.setState({
        search : data
      });
    }
  }

  searchData() {
    var data = this.state.search ? this.state.search : 'NODATA';
    console.log(data);
    axios({
      method: 'GET',
      url: url.LOCAL_BASE_URL + 'submember/search/member/' + data,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      this.setState({
        subMemberList: response.data,
        subMemberListLength: response.data.length
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
    });
  }

  render() {

    var show = {
      'diplay': 'block'
    }

    var hide = {
      'display': 'none'
    }

    const tableHearderBg = {
      'background-color': '#009688'
    }

    if (this.state.memberRedirect) {
      var path = "/member/" + this.state.selectedId;
      return <Redirect push to={path} />;
    }

    if (this.state.redirect) {
      return <Redirect push to="/add/member" />;
    }

    var indexOfLastTodo = this.state.activePage * url.ITEM_COUNT_PER_PAGE;
    var indexOfFirstTodo = indexOfLastTodo - url.ITEM_COUNT_PER_PAGE;
    var renderedProjects = this.state.subMemberList.slice(indexOfFirstTodo, indexOfLastTodo);

    var subMembers = renderedProjects.map((data, index) => {
      var imageUrl = url.IMAGE_URL + data.id + '.jpg';
      return <tr key={index}>
        <td><Image src={imageUrl} height="40px" width="40px" circle /></td>
        <td>{data.first_name} {data.last_name}</td>
        <td><i class="fa fa fa-envelope" aria-hidden="true"></i> {data.email}</td>
        <td><i class="fa fa-phone" aria-hidden="true"></i> {data.phone_number}</td>
        <td>{data.gender == 'male' ? <span><i class="fa fa-male" aria-hidden="true"></i>Male</span> : (data.gender == '' || data.gender == null) ? '' : <span><i class="fa fa-female" aria-hidden="true"></i>Female</span>}</td>
        <td>{data.plan_name}</td>
        {/* <td>{moment(data.last_payment_date).format('DD-MMM-YYYY')}</td> */}
        <td className="td-actions text-right">
          <i className="fa fa-eye fa-2x text-info" aria-hidden="true" onClick={e => this.viewSubMember(data.id)}></i>
        </td>
        <td className="td-actions text-right">
          <i className="fa fa-trash-o fa-2x text-warning" aria-hidden="true" onClick={e => this.deleteSubMember(data.id)}></i>
        </td>
      </tr>
    });

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Sales Contacts"
                actionButton="Add Member"
                routerUrl="/add/member"
                content={
                  <div className="table-responsive">
                    <div className="row text-center">
                      <div className="col-lg-10 col-md-10">
                        <input type="text" name="search" class="form-control" placeholder="Search Gym Member Name" value={this.state.search} onChange={e => this.fieldValue('search', e)} />
                      </div>
                      <div className="col-lg-2 col-md-2">
                        <Button bsStyle="info" fill type="button" bsSize="learge" onClick={() => this.searchData()}>
                          Search
                      </Button>
                      </div>
                    </div><br />
                    <table className="table table-striped" style={this.state.subMemberList.length > 0 ? show : hide}>
                      {/* <thead>
                        <tr>
                          <th></th>
                          <td>Name</td>
                          <td>Email</td>
                          <td>Phone Number</td>
                          <td>Gender</td>
                          <td>Payment Plan</td>
                          <td>Payment Last Date</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </thead> */}
                      <tbody>
                        {subMembers}
                      </tbody>
                    </table>
                    <div style={this.state.subMemberList > 0 ? show : hide}>
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={url.ITEM_COUNT_PER_PAGE}
                        totalItemsCount={this.state.subMemberListLength}
                        pageRangeDisplayed={url.ITEM_COUNT_PER_PAGE}
                        onChange={this.handlePageChange.bind(this)}
                      />
                    </div>
                    <div className="text-center" style={this.state.subMemberList.length == 0 ? show : hide}>
                      <h4 className="text-success">No Gym Member</h4>
                    </div>
                  </div>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col lg={2} sm={6}>
              <Button bsStyle="info" fill type="button" bsSize="small" onClick={() => this.nevigateToPage()}>
                Add Member
                </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
