import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { Redirect } from 'react-router';
import * as url from '../../baseUrl';
import swal from 'sweetalert';
const axios = require('axios');
var moment = require('moment');

class HeaderLinks extends Component {

  constructor(props) {
    super(props);
    console.log(JSON.parse(localStorage.getItem('memberInfo')));
    this.state = {
      render: false,
      authorization: 'Basic ' + localStorage.getItem('x-token'),
      memberInfo: JSON.parse(localStorage.getItem('memberInfo')),
      notificationList: [],
      notificationCount: 0,
      redirectToMemberPage: false,
      subMemberId: 0
    }
  }

  componentWillMount() {
    this.loadNotification();
    this.countUnreadNotification();
  }

  loadNotification() {
    var id = 0;
    if (this.state.memberInfo) {
      id = this.state.memberInfo.id;
    }

    axios({
      method: 'POST',
      url: url.LOCAL_BASE_URL + 'notification/all/' + id,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      this.setState({
        notificationList: response.data
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

  countUnreadNotification() {
    var id = 0;
    if (this.state.memberInfo) {
      id = this.state.memberInfo.id;
    }

    axios({
      method: 'POST',
      url: url.LOCAL_BASE_URL + 'notification/count/' + id,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      console.log(response.data[0].count);
      this.setState({
        notificationCount: response.data[0].count
      });
    }).catch((error) => {
      console.log(error);
      // if (error.response.status && error.response.status == '403') {
      //   swal({
      //     title: "Error",
      //     text: "You should login",
      //     icon: "error",
      //     dangerMode: true,
      //   }).then(willDelete => {
      //     if (willDelete) {
      //       window.location.href = '/';
      //     }
      //   });
      // }
    });
  }

  logout() {
    this.setState({
      render: true
    });
  }

  notificationAction(actionType, data) {
    if (actionType == 'delete') {
      this.deleteNotification(data.id);
    }

    if (actionType == 'readAndGo') {
      localStorage.setItem('member', 'member');
      this.markAsReadAndGoToMmeber(data.id);
    }
  }

  markAsReadAndGoToMmeber(id) {
    axios({
      method: 'POST',
      url: url.LOCAL_BASE_URL + 'notification/marked/read/' + id,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      this.loadNotification();
      this.countUnreadNotification();

      this.setState({
        redirectToMemberPage: true,
        subMemberId: id
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

  deleteNotification(id) {
    axios({
      method: 'DELETE',
      url: url.LOCAL_BASE_URL + 'notification/delete/' + id,
      headers: { 'authorization': this.state.authorization }
    }).then((response) => {
      this.loadNotification();
      this.countUnreadNotification();
    }).catch((error) => {
      if (error.response &&  error.response.status && error.response.status == '403') {
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
    if (this.state.render) {
      localStorage.removeItem('memberInfo');
      localStorage.removeItem('x-token');
      window.location.href = '/';
    }

    if (this.state.redirectToMemberPage) {
      var url = '/member/' + this.state.subMemberId;
      return <Redirect push to={url} />;
    }

    const show = {
      'display': 'block'
    }

    const hide = {
      'display': 'none'
    }

    const notification = (
      <div>
        <i className="fa fa-bell" />
        <b className="caret" />
        <span className="notification" style={this.state.notificationCount == 0 ? hide : show}>{this.state.notificationCount}</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );

    const unread = {
      'background-color': '#FEC9BA'
    }

    const read = {
      'background-color': '#FBF8F7'
    }

    const notificationList = this.state.notificationList.map((data, index) => {
      return <MenuItem key={index}><span onClick={() => this.notificationAction('readAndGo', data)}>Last payment for {data.first_name} {data.last_name} was {moment(data.last_payment_date).format('DD-MMM-YYYY')} </span><i class="fa fa-times-circle fa-1 text-info" onClick={() => this.notificationAction('delete', data)}></i></MenuItem>
    });

    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={3}>
            <NavDropdown
              eventKey={2}
              title={notification}
              noCaret
              id="basic-nav-dropdown"
            >
              {notificationList}
            </NavDropdown>
          </NavItem>
          <NavItem eventKey={3} onClick={() => this.logout()}>
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default HeaderLinks;
