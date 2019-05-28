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

import { employees } from "../../../responses/allUsers";

import "../../css/calendar/calendarSearchEmpModal.css";

class CalendarSearchEmpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      employees: [],
      filterText: "",
      filteredEmployees: [],
      selectedEmployee: null,
      showWarning: false,
      sortingOption: "name",
      totalPages: 0
    };
  }

  /** @abstract Filters and sorts the employees with the given filter text and sorting option.
   * @param {string} filterText String which is going to be used to filter all the employess
   * @param {string} srotingOption String wihch determines how the employees are going to be sorted.
   */
  filterAndSortEmployees = (filterText, sortingOption) => {
    const employeesArr = this.state.employees ? this.state.employees : [];
    const sortedEmployees = employeesArr.sort((emp1, emp2) => {
      switch (sortingOption) {
        case "name":
          if (emp1.employeeName < emp2.employeeName) {
            return -1;
          } else if (emp1.employeeName > emp2.employeeName) {
            return 1;
          }
          return 0;
        case "sapid":
          if (emp1.sapId < emp2.sapId) {
            return -1;
          } else if (emp1.sapId > emp2.sapId) {
            return 1;
          }
          return 0;
        default:
          return 0;
      }
    });
    const lowerFilterText = filterText.toLowerCase();
    const employees = sortedEmployees.filter(
      employee =>
        lowerFilterText === "" ||
        (lowerFilterText !== "" &&
          (employee.employeeName.toLowerCase().includes(lowerFilterText) ||
            employee.sapId.includes(lowerFilterText) ||
            employee.email.toLowerCase().includes(lowerFilterText)))
    );
    if (
      this.state.totalPages !==
      Math.ceil(employees.length / TOTAL_EMPS_PER_PAGE)
    ) {
      this.changeTotalPages(employees.length);
    }
    this.setState({
      filteredEmployees: employees
    });
  };

  /** @abstract Updates states's totalPages field depending on the total of employees.
   * @param {number} totalEmployees Number of employees
   */
  changeTotalPages = totalEmployees => {
    this.setState({
      totalPages: Math.ceil(totalEmployees / TOTAL_EMPS_PER_PAGE),
      currentPage: 1
    });
  };

  /** @abstract Updates states's filterText and calls filterAndSortEmployees method to filter the employees.
   * @param {object} event Event object
   */
  handleFilterTextChange = event => {
    this.filterAndSortEmployees(event.target.value, this.state.sortingOption);
    this.setState({
      filterText: event.target.value
    });
  };

  /** @abstract Updates states's sortingOption and calls filterAndSortEmployees method to sort the employees.
   * @param {object} event Event object
   */
  onSortingOptionChange = event => {
    this.filterAndSortEmployees(this.state.filterText, event.target.value);
    this.setState({
      sortingOption: event.target.value
    });
  };

  /** @abstract Updates states's selectedEmployee
   * @param {object} employee Selected employee
   */
  selectEmployee = employee => {
    this.setState({
      selectedEmployee: employee,
      showWarning: this.state.showWarning ? false : true
    });
  };

  /** @abstract Used to navigate between employee pages.
   * Updates states's currentPage.
   * @param {number} page Page number to navigate to.
   */
  changePage = page => {
    if (page >= 1 && page <= this.state.totalPages) {
      this.setState({
        currentPage: page
      });
    }
  };

  /** @abstract Used to navigate to the next page of employee pages.
   */
  changeNextPage = () => {
    this.changePage(this.state.currentPage + 1);
  };

  /** @abstract Used to navigate to the previoud page of employee pages.
   */
  changePrevPage = () => {
    this.changePage(this.state.currentPage - 1);
  };

  /** @abstract Closes modal if an employee is selected, otherwise shows a warning.
   */
  accept = () => {
    if (this.state.selectedEmployee !== null) {
      this.props.selectEmployee(this.state.selectedEmployee);
      this.props.toggle();
    } else {
      this.setState({ showWarning: true });
    }
  };

  /** @abstract Fetches employees to the server.
   */
  componentWillMount = () => {
    //Do a request to get all the employees
    /*get(GET_EMPLOYEES_URL).then(res => {
      let employees = [];
      if (res && typeof res.data != "undefined") {
        employees = res.data;
      }
      this.changeTotalPages(employees.length);
      this.setState({
        employees: employees
      });
    });*/
    //console.log(employees);
    this.setState({
      employees: employees
    });
  };

  /** @abstract After employees have been fetched, sorts them.
   * NEED TO CHECK WITH REAL DATA FOR ASYNC REQUEST
   */
  componentDidMount = () => {
    this.filterAndSortEmployees(
      this.state.filterText,
      this.state.sortingOption
    );
  };

  render = () => {
    const props = this.props;
    const upperLimit = this.state.currentPage * TOTAL_EMPS_PER_PAGE;
    const lowerLevel =
      upperLimit === TOTAL_EMPS_PER_PAGE ? 0 : upperLimit - TOTAL_EMPS_PER_PAGE;
    const filteredEmployees = this.state.filteredEmployees.filter(
      (employee, index) => index >= lowerLevel && index < upperLimit
    );
    const employeeRows = filteredEmployees.map((employee, index) => {
      return (
        <tr
          className={`calendar-search-emp-row ${
            this.state.selectedEmployee !== null &&
            this.state.selectedEmployee.sapId === employee.sapId
              ? "active"
              : ""
          }`}
          key={index}
          onClick={() => this.selectEmployee(employee)}
        >
          <td>
            {(this.state.currentPage - 1) * TOTAL_EMPS_PER_PAGE + index + 1}
          </td>
          <td>{employee.employeeName}</td>
          <td>{employee.sapId}</td>
          <td>{employee.email}</td>
        </tr>
      );
    });
    const pages = [];
    const initialPage =
      this.state.currentPage === 1
        ? this.state.currentPage
        : this.state.currentPage - 1; //Starts with 1 if initialPage == 1 else currentPage - 1
    const endPage =
      this.state.totalPages - initialPage >= 3
        ? initialPage + 2
        : this.state.totalPages; //Should be initialPage+2 if endPages - initialPage >= 3 else enPages
    for (let i = initialPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem onClick={() => this.changePage(i)} key={i}>
          <PaginationLink
            className={
              this.state.currentPage === i ? "calendar-page-active" : ""
            }
          >
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
            <Col sm="6">
              <input
                type="text"
                name="filterText"
                placeholder="Name, email, or SapID"
                value={this.state.filterText}
                onChange={event => this.handleFilterTextChange(event)}
              />
            </Col>
            <Col sm="5">
              <Row>
                <Col className="calendar-search-panel-sorting-option" sm="2">
                  <span>Sort by:</span>
                </Col>
                <Col className="calendar-search-panel-sorting-option" sm="2">
                  <input
                    type="radio"
                    name="sorting"
                    value="name"
                    checked={this.state.sortingOption === "name"}
                    onChange={this.onSortingOptionChange}
                  />
                </Col>
                <Col className="calendar-search-panel-sorting-option" sm="2">
                  <span>Name</span>
                </Col>
                <Col className="calendar-search-panel-sorting-option" sm="2">
                  <input
                    type="radio"
                    name="sorting"
                    value="sapid"
                    checked={this.state.sortingOption === "sapid"}
                    onChange={this.onSortingOptionChange}
                  />
                </Col>
                <Col className="calendar-search-panel-sorting-option" sm="2">
                  <span>SapID</span>
                </Col>
              </Row>
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
          <Button
            color="success"
            onClick={() => this.accept(this.state.selectedEmployee)}
          >
            Accept
          </Button>{" "}
          <Button color="danger" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
}

CalendarSearchEmpModal.propTypes = {
  isOpen: PropTypes.any,
  selectEmployee: PropTypes.func,
  toggle: PropTypes.func
};

export default CalendarSearchEmpModal;
