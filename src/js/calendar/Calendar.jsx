import React, { Component } from "react";
import PropTypes from "prop-types";
import {get, post } from "../axios/";
import { Alert, Button, DropdownItem, Row, Col } from "reactstrap";
import CalendarAdminControlPanel from "./CalendarAdminControlPanel";
import CalendarUserPanel from "./CalendarUserPanel";
import CalendarMonth from "./CalendarMonth";
import {
  MONTHS_LONG,
  DAYS_IN_MONTH,
  EXTRA_DAY_TYPE,
  DAY_TYPE,
  ADMIN_USER,
  GET_CALENDAR_URL,
  UPLOAD_CALENDAR_URL,
  GET_HOLIDAYS_URL
} from "../../constants/util";
import PopUpLoading from "../util/PopUpLoading";

import "../../css/calendar/calendar.css";

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarEmployee: this.props.user.role === ADMIN_USER ? null : this.props.user,
      month: null, //Days of month CHANGE
      empCalendarsRegistered: null, //Registered calendars by employee
      holidays: {},
      isPastMonth: false,
      //selectedMonth: new Date().getMonth() + 1, //Next month
      selectedMonth: new Date().getMonth(), //Actual month
      selectedYear: new Date().getFullYear(),
      alerts: false,
      typeAlert: "",
      modalAppear: false,
      uploading: false,
      loading: false
    };

    this.isNonWorkableDay = this.isNonWorkableDay.bind(this);
    this.selectYear = this.selectYear.bind(this);
    this.selectMonth = this.selectMonth.bind(this);
    this.setDayType = this.setDayType.bind(this);
    this.saveMonth = this.saveMonth.bind(this);
    this.selectEmployee = this.selectEmployee.bind(this);
    this.submitMonth = this.submitMonth.bind(this);
    //this.openUserCategory = this.openUserCategory.bind(this);
    this.updateCalendars = this.updateCalendars.bind(this);
  }

  isNonWorkableDay(day, month = this.state.selectedMonth, year = this.state.selectedYear) {
    return this.state.holidays.hasOwnProperty(year) &&
      this.state.holidays[year].hasOwnProperty(month) &&
      this.state.holidays[year][month].hasOwnProperty(day) &&
      this.state.holidays[year][month][day].holidaysInfo[0].type === 'Non-workable day';
  }

  checkIfIsPastMonth(month, year) {
    const date = new Date();
    const actualYear = date.getFullYear();
    const actualMonth = date.getMonth();
    return (actualYear === year && actualMonth > month) || actualYear > year;
  }

  /** @abstract Fills state month using the employee's data. If employee's data is empty
   * , fills month with empty values.
   * @param {number} thisMonth The actual month. If not passed, is equal to state's selectedMonth.
   */
  fillMonth(thisMonth = this.state.selectedMonth, year = this.state.selectedYear, holidays = this.state.holidays) {
    const month = [];
    let dayType
    if (this.state.empCalendarsRegistered !== null &&
      this.state.empCalendarsRegistered !== undefined &&
      this.state.empCalendarsRegistered.length > 0) {
      const currentMonth = this.state.empCalendarsRegistered.find(calendar => parseInt(calendar.month) === thisMonth);
      let dayDesc;
      for (let i = 0; i < DAYS_IN_MONTH; i++) {
        dayDesc = null;
        if (this.isNonWorkableDay(i + 1, thisMonth, year)) {
          dayDesc = DAY_TYPE["HOLIDAY"];
        }
        else if (currentMonth !== undefined && currentMonth.days[i].value !== "") {
          //console.log("Register day", i);
          for (let key in DAY_TYPE) {
            if (DAY_TYPE[key].symbol === currentMonth.days[i].value) {
              dayDesc = DAY_TYPE[key];
              break;
            }
          }
        }
        dayType = dayDesc !== null ? {
          symbol: dayDesc.symbol,
          name: dayDesc.name,
          description: dayDesc.description
        } : {
          symbol: "",
          name: "",
          description: ""
        };
        month.push(dayType);
      }
    }
    else {
      for (let i = 1; i <= DAYS_IN_MONTH; i++) {
        if (holidays !== {} && this.isNonWorkableDay(i)) {
          dayType = DAY_TYPE["HOLIDAY"];
        }
        else {
          dayType = { symbol: "", name: "", description: "" };
        }

        month.push(dayType);
      }
    }

    this.setState({
      isPastMonth: this.checkIfIsPastMonth(thisMonth, year),
      month: month
    });
    //console.log(month);
  }

  /** @abstract Validates that state's month is all filled up.
   * @returns {boolean} True if the period of time was filled correctly, false otherwise
   */
  validateMonth() {
    const totalDays = new Date(this.state.selectedYear, this.state.selectedMonth + 1, 0).getDate();
    const month = this.state.month;
    for (let i = 0; i < totalDays; i++) {
      if (month[i].symbol === "") {
        return false;
      }
    }
    return true;
    //return this.state.month.find(dayType => dayType.symbol === "") === undefined;
  }

  /** @abstract Updates state's selectedMonth. 
   * If val is a number, is used to update.
   * Otherwise is an event called from CalendarUserPanel. It takes its innerText to search the actual month index on MONTHS_LONG constant.
   * Then calls component's fillMonth's method to update state's month
   * @param {number or event} val Value which has the necessary information to update state's selectedMonth.
   */
  selectMonth(val) {
    const month = typeof val === "number" ? val : MONTHS_LONG.findIndex(month => val.target.innerText === month);
    if (month !== this.state.selectedMonth) {
      //console.log('Set', month);
      this.setState({
        selectedMonth: month
      });
      this.fillMonth(month);
    }
  }

  /** @abstract Updates state's selectedYear.
   * It's always called from an event on CalendarUserPanel.
   * Then calls component's fillMonth's method to update state's month
   * @param {object} event Default event object which is produced when an event is triggered.
   */
  selectYear(event) {
    const year = parseInt(event.target.innerText);
    if (year !== this.state.selectedYear) {
      const date = new Date();
      let month;
      if (
        year === date.getFullYear() &&
        this.state.selectedMonth > date.getMonth()
      ) {
        month = date.getMonth();
      }
      else if (year !== this.state.selectedYear) {
        if (this.state.empCalendarsRegistered === null) {
          month = 0;
        }
        else {
          const calendars = this.state.empCalendarsRegistered;
          const calendar = calendars.find(calendar => parseInt(calendar.year) === year);
          if (calendar === undefined) {
            month = 0;
          }
          else {
            month = parseInt(calendar.month);
          }
        }
      }
      this.fillMonth(month, year);
  
      this.setState({
        selectedMonth: month,
        selectedYear: year
      }); 
    }
  }

  /** @abstract Updates the type of day to the selected days on state's month and empCalendarsRegistered.
   * @param {array} days Array of numbers, specifying the selected days.
   * @param {object} type Selected day type. Consult DAY_TYPES on constants files. 
   */
  setDayType(days, type) {
    const empCalendarsRegistered = this.state.empCalendarsRegistered;
    const month = this.state.month;
    const calendarIndex = this.searchInEmpCalendars(this.state.selectedMonth, this.state.selectedYear);
    let actualCalendar;
    if (calendarIndex !== -1) {
      //Get calendar month from empRegisteredCalendars
      actualCalendar = this.state.empCalendarsRegistered[calendarIndex];
    }
    else {
      actualCalendar = {
        employeeName: this.state.calendarEmployee.employeeName,
        sapId: this.state.calendarEmployee.sapId,
        year: this.state.selectedYear,
        month: this.state.selectedMonth,
        days: []
      };
      for (let i = 0; i < DAYS_IN_MONTH; i++) {
        //Filling with empty crashes the filling month method
        actualCalendar.days.push({ day: "", value: "" });
      }
    }
    for (let i = 0; i < days.length; i++) {
      month[days[i] - 1] = type;
      actualCalendar.days[days[i] - 1] = {
        day: days[i],
        value: type.symbol
      };
    }
    this.setState({
      month: month,
      empCalendarsRegistered: [
        ...empCalendarsRegistered.slice(0, calendarIndex),
        actualCalendar,
        ...empCalendarsRegistered.slice(calendarIndex + 1)
      ]
    });
  }

  setDefaultType(days, type) {

  }

  saveMonth() {
    //console.log("Save");
  }

  /** @abstract Updates state's calendarEmployee, if employee is different to state's calendarEmployee.
   * It also calls component's updateCalendars method to update the UI with new data.
   * @param {object} employee Represents an employee.
   */
  selectEmployee(employee) {
    //console.log('Select employee');
    if (this.state.calendarEmployee === null || employee.sapId !== this.state.calendarEmployee.sapId) {
      this.updateCalendars(employee);
      this.setState({
        calendarEmployee: employee
      });
    }
  }

  /** @abstract Updates state's empCalendarsRegistered.
   * It retrieves a list of calendars from server.
   * If employee doesn't have calendars, state's month is set to null.
   * @param {object} employee Represents the actual employee. If not given,
   * the app uses state's calendarEmployee
   */
  updateCalendars(employee = this.state.calendarEmployee) {
    if (employee !== null) {
      let calendar = {
        sapId: employee.sapId
      };
      let calendarJson = JSON.stringify((calendar));
      //console.log('Update calendars')
      this.setState({
        loading: true
      });
      get(GET_CALENDAR_URL, { params: { calendar: calendarJson } })
        .then(res => {
          let registeredCalendars = null;
          if (res && typeof(res.data) != "undefined") {
            registeredCalendars = [];
            if (res.data.length > 0) {
              for (let index = 0; index < res.data.length; index++) {
                registeredCalendars.push(JSON.parse(res.data[index]));
              }
            }
            else {
              //console.log(employee.sapId, 'Calendar', res.data);
              //savedMonths = JSON.parse(res.data);
            }
            this.setState({
              empCalendarsRegistered: registeredCalendars, //Array
              selectedMonth: new Date().getMonth(), //Actual month
              selectedYear: new Date().getFullYear(),
              loading: false
            });
            //this.fillMonth(new Date().getMonth() + 1); //Fill with next month data
            this.fillMonth(new Date().getMonth()); //Fill with actual month data
          }
        });
    }
  }

  searchInEmpCalendars(month, year) {
    return this.state.empCalendarsRegistered.findIndex(currentCalendar =>
      currentCalendar.month.toString() === month.toString() &&
      currentCalendar.year.toString() === year.toString());
  }

  /** @abstract Updates state's empCalendarRegistered in order to keep the data
   * on an actual state, without making a request to the server.
   * If the given calendar isn't in the employee's registered calendars, is appended,
   * otherwise, is overwrited.
   * @param {object} calendar The calendar that is going to be submitted.
   * @returns {array} The updated list of calendars.
   */
  updateEmployeeCalendars(calendar) {
    const empCalendarsRegistered = this.state.empCalendarsRegistered;
    const calendarIndex = this.searchInEmpCalendars(calendar.month, calendar.year);
    //If calendar exists, overwrite it
    if (calendarIndex !== -1) {
      return [...empCalendarsRegistered.slice(0, calendarIndex),
        calendar,
        ...empCalendarsRegistered.slice(calendarIndex + 1)
      ];
    }
    //Otherwise, append it
    return [...empCalendarsRegistered, calendar]
  }

  submitMonth() {
    if (this.validateMonth() && !this.state.isPastMonth) {
      const totalDays = new Date(this.state.selectedYear, this.state.selectedMonth + 1, 0).getDate(); //Actual month's total days
      const days = [];
      for (let i = 0; i < DAYS_IN_MONTH; i++) {
        days.push({
          day: i + 1,
          value: i < totalDays ? this.state.month[i].symbol : EXTRA_DAY_TYPE
        });
      }
      const calendarPayload = {
        employeeName: this.state.calendarEmployee.employeeName,
        sapId: this.state.calendarEmployee.sapId,
        year: this.state.selectedYear,
        month: this.state.selectedMonth,
        days: days
      };
      this.setState({
        uploading: true
      });
      post(UPLOAD_CALENDAR_URL, calendarPayload)
        .then(res => {
          if (res.data == "ok") {
            this.setState({
              alerts: true,
              typeAlert: "success",
              uploading: false,
              empCalendarsRegistered: this.updateEmployeeCalendars(calendarPayload)
            });

          }
          else {
            this.setState({
              alerts: true,
              typeAlert: "error",
              uploading: false
            });
          }
          //An calendarEmployee should be already in the state for this
          //this.updateCalendars();
        })
        .catch(error => {
          this.setState({
            alerts: true,
            typeAlert: "warning",
            uploading: false
          });
        });
    }
    else {
      alert('You have to fill all days');
    }
  }

  employeeHasCalendar(calendar) {

  }

  /** @abstract Calls component's fillMonth method, before the component is mounted.
   */
  componentWillMount() {
    this.fillMonth();

    get(GET_HOLIDAYS_URL, { params: { year: this.state.selectedYear } }, ).then((res) => {
      const holidays = {};
      if (typeof(res.data) != undefined) {
        let day, month, year;
        //console.log('Data', res.data); //Get all holidays
        for (let i = 0; i < res.data.length; i++) { //Roam holidays
          let holiday = res.data[i];
          [month, day, ] = holiday.holidayDate.split("/"); //Has format mm/dd/yy and they start from 0
          year = parseInt(holiday.year);
          month = parseInt(month);
          day = parseInt(day);
          if (!holidays.hasOwnProperty(year)) { //Create year object
            holidays[year] = {};
          }
          if (!holidays[year].hasOwnProperty(month)) { //Create month object
            holidays[year][month] = {};
          }
          if (!holidays[year][month].hasOwnProperty(day)) { //Create day object
            holidays[year][month][day] = {
              holidaysInfo: []
            };
          }
          holidays[year][month][day].holidaysInfo.push({
            name: holiday.holidayName,
            type: holiday.holidayType,
            description: holiday.holidayDescription
          });
        }
        //console.log('Holidays: ', holidays);
        this.setState({
          holidays: holidays
        });

      }
      this.fillMonth(this.state.selectedMonth, holidays);
    });
  }

  /** @abstract Calls component's updateCalendars method
   */
  componentDidMount() {
    if (this.props.user === undefined) {
      //console.log('undefined user', this.props);
      return;
    }
    this.updateCalendars();
  }

  /*openUserCategory(event) {
    event.preventDefault();
    if(event.currentTarget.id == "openModal") {
       this.setState({
        modalAppear: true
      });
    } else {
      this.setState({
        modalAppear: false
      });
    }
  }*/

  render() {
    let alerts;
    if (this.state.alerts == true) {
      if (this.state.typeAlert == "success") {
        alerts = <Alert color="success"> Shift calendar saved successfully! </Alert>;
      }
      else if (this.state.typeAlert == "error") {
        alerts = <Alert color="danger"> Error trying to save your calendar, please try again! </Alert>;
      }
      else if (this.state.typeAlert == "warning") {
        alerts = <Alert color="warning"> Warning, we cannot connect to Server! </Alert>;
      }
    }

    return (
      <div className="calendar-container">
        <Row>
          <Col sm="12">
            <h1 className="h2">Calendar</h1>
          </Col>
        </Row>

        {this.props.user.role === ADMIN_USER ? (
          <CalendarAdminControlPanel
            user={this.props.user}
            calendarUser={this.state.calendarEmployee}
            selectEmployee={this.selectEmployee}
          />
        ) : (
          <React.Fragment />
        )}

        {this.state.calendarEmployee !== null && this.state.empCalendarsRegistered !== null ? (
          <React.Fragment>
            <CalendarUserPanel
              registeredCalendars={this.state.empCalendarsRegistered}
              selectedMonth={this.state.selectedMonth}
              selectedYear={this.state.selectedYear}
              selectMonth={this.selectMonth}
              selectYear={this.selectYear}
              user={this.state.calendarEmployee}
            />
    
            <Row className="calendar-month-container">
              <Col sm="12">
                <CalendarMonth
                  holidays={this.state.holidays}
                  isNonWorkableDay={this.isNonWorkableDay}
                  month={this.state.selectedMonth}
                  monthTypes={this.state.month}
                  isPastMonth={this.state.isPastMonth}
                  setDayType={this.setDayType}
                  year={this.state.selectedYear}
                />
              </Col>
            </Row>
    
            <Row className="calendar-button-group">
              <Col sm="12">
                <Button color="primary" size="lg" onClick={this.saveMonth} disabled={this.state.isPastMonth}>
                  Save
                </Button>{" "}
                <Button color="success" size="lg" onClick={this.submitMonth} disabled={this.state.isPastMonth}>
                  Submit
                </Button>{" "}
              </Col>
            </Row>
            
            
            {this.state.uploading || this.state.loading ? (
              <PopUpLoading
                className="uploading-modal"
                isOpen={this.state.uploading || this.state.loading}
                modalTitle={`${this.state.loading ? "Loading" : "Submitting"} calendar`}
              >
                <div className="calendar-loading">
                  <img
                    className="calendar-loading"
                    src={require("../../imgs/hourglass.gif")}
                    alt="Loading"
                    style={{ width: "30%", height: "auto" }}
                  />
                </div>
              </PopUpLoading>
            ) : (
              <React.Fragment />
            )}
          </React.Fragment>
          ) : (
            <React.Fragment />
          )}
        
        <br/>
        {alerts}
      </div>
    );
  }
}

Calendar.propTypes = {
  user: PropTypes.any
};

export default Calendar;
