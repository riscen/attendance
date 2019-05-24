import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Row, Col } from "reactstrap";
import { ChevronDown, ChevronUp } from "react-feather";
import { MONTHS_LONG } from "../../constants/util";

class CalendarUserPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      monthDropDownOpen: false,
      registeredCalendars: [],
      registeredYears: [],
      yearDropDownOpen: false
    };

    this.toggleMonth = this.toggleMonth.bind(this);
    this.toggleYear = this.toggleYear.bind(this);
  }

  getCalendarsObj() {
    const date = new Date();
    const registeredCalendars = [];
    const registeredYears = [];
    let hasLastMonthRegistered = false;
          
    this.props.registeredCalendars.forEach((monthData, index) => {
      let year;
      let month;
      //Get months and years registered
      //Year and month come as strings
      year = parseInt(monthData.year);
      month = parseInt(monthData.month);
      registeredCalendars.push({
        year: year,
        month: month
      });
      //Ensures that year is unique
      if (!registeredYears.includes(year)) {
        registeredYears.push(year);
      }
      //If actual month is in calendars, then last one is already submited
      if (date.getFullYear() === year &&
        date.getMonth() === month) {
        hasLastMonthRegistered = true;
      }
    });
    //If actual month isn't registered, add it (next month)
    if (!hasLastMonthRegistered) {
      registeredCalendars.push({
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }
    return {
      registeredCalendars,
      registeredYears
    };
  }

  /**@abstract Toggles the dropdown for year
   */
  toggleYear() {
    this.setState({
      yearDropDownOpen: !this.state.yearDropDownOpen
    });
  }

  /**@abstract Toggles the dropdown for month
   */
  toggleMonth() {
    this.setState({
      monthDropDownOpen: !this.state.monthDropDownOpen
    });
  }

  /**@abstract Settles component's state with proper values, using props.
   */ 
  componentWillMount() {
    const {registeredCalendars, registeredYears} = this.getCalendarsObj();
    const actualYearIsRegistered = registeredYears.find(year => 
          year === this.props.selectedYear) !== undefined;
          
    if (this.props.selectedMonth === 11) { 
      const nextYear = this.props.selectedYear + 1;
      const newYears = actualYearIsRegistered ? 
          [this.props.selectedYear, nextYear] : 
          [nextYear];
      this.setState({
        registeredCalendars: [
            ...registeredCalendars, 
            {month: 0, year: nextYear}
            ],
        registeredYears: [...registeredYears, ...newYears]
      });
    }
    else {
      this.setState({
        registeredCalendars: [
            ...registeredCalendars, 
            {month: this.props.selectedMonth + 1, year: this.props.selectedYear} 
            ],
        registeredYears: actualYearIsRegistered ? 
            registeredYears : 
            [...registeredYears, this.props.selectedYear] 
      });
    }
  }

  render() {
    const filteredCalendars = this.state.registeredCalendars.filter(
      calendar => this.props.selectedYear === calendar.year);
    const monthItems = filteredCalendars.map((calendar, index) => {
      return (
        <DropdownItem key={index} onClick={this.props.selectMonth}>
          {MONTHS_LONG[calendar.month]}
        </DropdownItem>
      );
    });
    
    const yearItems = this.state.registeredYears.map((year, index) => {
      return (
        <DropdownItem key={index} onClick={this.props.selectYear}>
          {year}
        </DropdownItem>
      );
    });
    
    return (
      <Row className="calendar-employee-panel">
        <Col className="calendar-user-data" sm="6">
          <h3>{this.props.user.sapId}</h3>
          <h4>{this.props.user.employeeName}</h4>
        </Col>

        <Col className="calendar-time" sm="6">
          <div className="calendar-year">
            <Dropdown isOpen={this.state.yearDropDownOpen} toggle={this.toggleYear}>
              <DropdownToggle
                tag="span"
                onClick={this.toggleYear}
                data-toggle="dropdown"
                aria-expanded={this.state.yearDropDownOpen}
              >
                <h4>
                  {this.props.selectedYear}{" "}
                  {!this.state.yearDropDownOpen ? <ChevronDown /> : <ChevronUp />}
                </h4>
              </DropdownToggle>
              <DropdownMenu right>{yearItems}</DropdownMenu>
            </Dropdown>
          </div>
          <div className="calendar-month">
            <Dropdown isOpen={this.state.monthDropDownOpen} toggle={this.toggleMonth}>
              <DropdownToggle
                tag="span"
                onClick={this.toggleMonth}
                data-toggle="dropdown"
                aria-expanded={this.state.monthDropDownOpen}
              >
                <h4>
                  {MONTHS_LONG[this.props.selectedMonth]}{" "}
                  {!this.state.monthDropDownOpen ? <ChevronDown /> : <ChevronUp />}
                </h4>
              </DropdownToggle>
              <DropdownMenu right>{monthItems}</DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    );
  }
}

CalendarUserPanel.propTypes = {
  registeredCalendars: PropTypes.any,
  selectedMonth: PropTypes.any,
  selectedYear: PropTypes.any,
  selectMonth: PropTypes.func,
  selectYear: PropTypes.func,
  user: PropTypes.any
};

export default CalendarUserPanel;
