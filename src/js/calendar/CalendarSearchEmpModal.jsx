import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
  Table
} from "reactstrap";
import { get } from "../axios/";
import { TOTAL_EMPS_PER_PAGE, GET_EMPLOYEES_URL } from "../../constants/util";

import "../../css/calendar/calendarSearchEmpModal.css";

class CalendarSearchEmpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      employees: [],
      filterText: "",
      selectedEmployee: null,
      showWarning: false,
      totalPages: 0
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.selectEmployee = this.selectEmployee.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeNextPage = this.changeNextPage.bind(this);
    this.changePrevPage = this.changePrevPage.bind(this);
    this.accept = this.accept.bind(this);
  }

  changeTotalPages(totalEmployees) {
    this.setState({
      totalPages: Math.ceil(totalEmployees / TOTAL_EMPS_PER_PAGE),
      currentPage: 1
    });
  }

  handleFilterTextChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  selectEmployee(employee) {
    this.setState({
      selectedEmployee: employee
    });
  }

  changePage(page) {
    if (page >= 1 && page <= this.state.totalPages) {
      this.setState({
        currentPage: page
      });
    }
  }

  changeNextPage() {
    this.changePage(this.state.currentPage + 1);
  }

  changePrevPage() {
    this.changePage(this.state.currentPage - 1);
  }

  accept() {
    if (this.state.selectedEmployee !== null) {
      this.props.toggle();
      this.props.selectEmployee(this.state.selectedEmployee);
    } else {
      this.setState({ showWarning: true });
    }
  }

  componentWillMount() {
    //Do a request to get all the employees
    get(GET_EMPLOYEES_URL)
        .then(res =>{
          let employees = [];
          if(res && typeof(res.data) != "undefined"){
            employees = res.data;
          } 
          this.changeTotalPages(employees.length);
          this.setState({
            employees: employees
          });
      });
  }

  render() {
    const props = this.props;
    const filterText = this.state.filterText;
    const employees = this.state.employees.filter(
      employee =>
        filterText === "" ||
        (filterText !== "" &&
          (employee.name.includes(filterText) ||
            employee.sapId.includes(filterText) ||
            employee.email.includes(filterText)))
    );
    if (this.state.totalPages !== Math.ceil(employees.length / TOTAL_EMPS_PER_PAGE)) {
      this.changeTotalPages(employees.length);
    }
    const upperLimit = this.state.currentPage * TOTAL_EMPS_PER_PAGE;
    const lowerLevel = upperLimit === TOTAL_EMPS_PER_PAGE ? 0 : upperLimit - TOTAL_EMPS_PER_PAGE;
    const filteredEmployees = employees.filter(
      (employee, index) => index >= lowerLevel && index < upperLimit
    );
    const employeeRows = filteredEmployees.map((employee, index) => {
      return (
        <tr
          className={
            `calendar-search-emp-row ${ this.state.selectedEmployee !== null &&
            this.state.selectedEmployee.sapId === employee.sapId ? "active" : ""
          }`}
          key={index}
          onClick={() => this.selectEmployee(employee)}
        >
          <td>{(this.state.currentPage - 1) * TOTAL_EMPS_PER_PAGE + index + 1}</td>
          <td>{employee.employeeName}</td>
          <td>{employee.sapId}</td>
          <td>{employee.email}</td>
        </tr>
      );
    });
    const pages = [];
    const initialPage =
      this.state.currentPage === 1 ? this.state.currentPage : this.state.currentPage - 1; //Starts with 1 if initialPage == 1 else currentPage - 1
    const endPage =
      this.state.totalPages - initialPage >= 3 ? initialPage + 2 : this.state.totalPages; //Should be initialPage+2 if endPages - initialPage >= 3 else enPages
    for (let i = initialPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem onClick={() => this.changePage(i)} key={i}>
          <PaginationLink className={this.state.currentPage === i ? "calendar-page-active" : ""}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Modal
        isOpen={props.isOpen}
        toggle={props.toggle}
        className="calendar-modal"
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={props.toggle}>
          <Row>
            <Col sm="12">Choose an employee</Col>
            {this.state.showWarning ? (
              <Col sm="12">
                <Alert color="warning">You have to select an employee</Alert>
              </Col>
            ) : (
              <React.Fragment />
            )}
          </Row>
        </ModalHeader>

        <ModalBody className="calendar-search-container">
          <Row className="calendar-search-panel-container">
            <Col sm="1">
              <span>Search</span>
            </Col>
            <Col sm="11">
              <input
                type="text"
                name="filterText"
                placeholder="Name, email, or SapID"
                value={this.state.filterText}
                onChange={event => this.handleFilterTextChange(event)}
              />
            </Col>
          </Row>

          <Row>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th className="calendar-search-no-cell">No.</th>
                  <th className="calendar-search-name-cell">Name</th>
                  <th className="calendar-search-sapid-cell">SapId</th>
                  <th className="calendar-search-email-cell">Email</th>
                </tr>
              </thead>
              <tbody>{employeeRows}</tbody>
            </Table>
          </Row>

          <Row className="calendar-search-pagination-container">
            <Pagination className="calendar-search-pagination">
              <PaginationItem onClick={() => this.changePrevPage()}>
                <PaginationLink previous />
              </PaginationItem>
              {pages}
              <PaginationItem onClick={() => this.changeNextPage()}>
                <PaginationLink next />
              </PaginationItem>
            </Pagination>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="success" onClick={() => this.accept(this.state.selectedEmployee)}>
            Accept
          </Button>{" "}
          <Button color="danger" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CalendarSearchEmpModal.propTypes = {
  isOpen: PropTypes.any,
  selectEmployee: PropTypes.func,
  toggle: PropTypes.func
};

export default CalendarSearchEmpModal;
