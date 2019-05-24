import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Row, Col } from "reactstrap";
import CalendarSearchEmpModal from "./CalendarSearchEmpModal";

import "../../css/calendar/calendarAdminControlPanel.css";

class CalendarAdminControlPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  render() {
    return (
      <div className="calendar-admin-panel-container">
        <Row>
          <Col sm="8">
            <h4>Admin: {this.props.user.employeeName}</h4>
          </Col>
          <Col className="calendar-admin-choose" sm="4">
            <span>Choose an employee</span>{" "}
            <Button color="primary" onClick={this.toggleModal}>
              Choose
            </Button>
          </Col>
        </Row>

        <Row className="calendar-admin-msg">
          <Col sm="12">
            {this.props.calendarUser === null ? (
              <Alert color="warning">Please choose an employee.</Alert>
            ) : (
              <React.Fragment />
            )}
          </Col>
        </Row>

        {this.state.modalOpen ? (
          <CalendarSearchEmpModal
            isOpen={this.state.modalOpen}
            toggle={this.toggleModal}
            selectEmployee={this.props.selectEmployee}
          />
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

CalendarAdminControlPanel.propTypes = {
  calendarUser: PropTypes.any,
  user: PropTypes.any
};

export default CalendarAdminControlPanel;
