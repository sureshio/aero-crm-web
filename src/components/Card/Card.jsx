import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Redirect } from 'react-router';

export class Card extends Component {

  constructor(props) {
    super(props);

  }
  
  render() {
    const headingColor = {
      color : '#3F51B5'
    }

    const buttonColor = {
      'background-color' : '#3F51B5'
    }

    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
        <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
          <Grid fluid>
            <Row>
              <Col lg={10} sm={6}>
                <h4 className="title" style={headingColor}><b>{this.props.title}</b></h4>
              </Col>
            </Row>
          </Grid>
        </div>
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
          {this.props.content}

          <div className="footer">
            {this.props.legend}
            {this.props.stats != null ? <hr /> : ""}
            <div className="stats">
              <i className={this.props.statsIcon} /> {this.props.stats}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
