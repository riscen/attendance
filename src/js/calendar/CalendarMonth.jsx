import React, { Component } from "react";
import { Table } from "reactstrap";
import PropTypes from "prop-types";
import CalendarDay from "./CalendarDay";
import CalendarModal from "./CalendarModal";
import { WEEK_DAYS, DAY_TYPE } from "../../constants/util";

class CalendarMonth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDays: [],
      modalOpen: false,
      keyDown: undefined
    };

    this.selectDay = this.selectDay.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSpecialKeyPress = this.handleSpecialKeyPress.bind(this);
    this.handleSpecialKeyRelease = this.handleSpecialKeyRelease.bind(this);
    this.setDayType = this.setDayType.bind(this);
  }

  selectDay(dayNum) {
    if (this.state.keyDown === "Shift") {
      if (this.state.selectedDays.length > 0) {
        let selectedDays;
        const min = dayNum < this.state.selectedDays[0] ? dayNum : this.state.selectedDays[0];
        const max = (dayNum > this.state.selectedDays[0] ? dayNum : this.state.selectedDays[0]) + 1;
        selectedDays = [...Array(max - min).keys()].map(d => d + min); //Get list of selectedDays
        selectedDays = selectedDays.filter(day => !this.props.isNonWorkableDay(day)); //Filter non workable days
        this.setState({
          selectedDays: selectedDays,
          modalOpen: true
        });
      } else this.setState({ selectedDays: [dayNum] });
    } else if (this.state.keyDown === "Control") {
      if (this.state.selectedDays.length > 0) {
        const idx = this.state.selectedDays.find(d => d === dayNum);
        if (idx !== undefined)
          this.setState({ selectedDays: this.state.selectedDays.filter(d => d !== dayNum) });
        else this.setState({ selectedDays: [...this.state.selectedDays, dayNum] });
      } else {
        this.setState({ selectedDays: [...this.state.selectedDays, dayNum] });
      }
    } else this.setState({ selectedDays: [dayNum], modalOpen: true });
  }

  handleSpecialKeyPress(event) {
    if (
      (event.shiftKey && this.state.keyDown !== "Shift") ||
      (event.ctrlKey && this.state.keyDown !== "Control")
    ) {
      this.setState({
        keyDown: event.key
      });
    }
  }

  handleSpecialKeyRelease() {
    if (this.state.keyDown === "Shift")
      this.setState({
        keyDown: undefined
      });
    if (this.state.keyDown === "Control")
      this.setState({
        modalOpen: this.state.selectedDays.length > 0,
        keyDown: undefined
      });
  }

  toggleModal() {
    this.setState({ modalOpen: false, selectedDays: [] });
  }

  setDayType(type) {
    this.props.setDayType(this.state.selectedDays, type);
    this.toggleModal();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleSpecialKeyPress, false);
    document.addEventListener("keyup", this.handleSpecialKeyRelease, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleSpecialKeyPress, false);
    document.removeEventListener("keyup", this.handleSpecialKeyRelease, false);
  }

  render() {
    const totalDays = new Date(this.props.year, this.props.month + 1, 0).getDate();
    const monthDay = new Date(this.props.year, this.props.month, 1).getDay();
    const headersDays = WEEK_DAYS.map((day, index) => {
      return (
        <th key={`h-${index}`} className="calendar-table-header-cell">
          {day}
        </th>
      );
    });
    const dayRows = [];
    
    // Passing as classname a non-empty string to CalendarDay will be enough
    for (let i = 0, j = 0; i < totalDays + monthDay; i += 7) {
      dayRows.push(
        <tr key={i} className="calendar-table-row">
          {WEEK_DAYS.map((day, index) => {
            if (i + index >= monthDay && i + index < totalDays + monthDay) {
              let className = "";
              if (this.props.isPastMonth) {
                className = "past-month-day";
              }
              else if(this.props.isNonWorkableDay(j + 1)) {
                className = "day-disable";
              }
              return (
                <CalendarDay
                  className={className}
                  key={`d-${index}`}
                  weekDay={
                    i + index >= monthDay && i + index < totalDays + monthDay ? day : WEEK_DAYS[0]
                  }
                  dayNum={j + 1}
                  dayType={this.props.monthTypes[j++]}
                  selected={this.state.selectedDays.find(day => day === j)}
                  handleClick={this.selectDay}
                />
              );
            }
            return <td key={`d-${index}`} className="caledar-table-day-cell day-disable" />;
          })}
        </tr>
      );
    }
    return (
      <React.Fragment>
        <Table bordered responsive style={{ height: "500px", overflow: "hidden" }}>
          <thead>
            <tr>{headersDays}</tr>
          </thead>
          <tbody>{dayRows}</tbody>
        </Table>
        {this.state.modalOpen ? (
          <CalendarModal
            isOpen={this.state.modalOpen}
            days={this.state.selectedDays}
            dayType={this.props.monthTypes[this.state.selectedDays[0] - 1]}
            month={this.props.month}
            year={this.props.year}
            toggle={this.toggleModal}
            accept={this.setDayType}
          />
        ) : (
          <div />
        )}
      </React.Fragment>
    );
  }
}

CalendarMonth.propTypes = {
  holidays: PropTypes.any,
  isNonWorkableDay: PropTypes.func,
  month: PropTypes.any,
  monthTypes: PropTypes.any,
  isPastMonth: PropTypes.any,
  setDayType: PropTypes.func,
  year: PropTypes.any
};

export default CalendarMonth;
