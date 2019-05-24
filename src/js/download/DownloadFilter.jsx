import React, { Component } from "react";
import MonthPicker from "react-month-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { ChevronDown, ChevronUp } from "react-feather";
import { formatDate, parseDate } from "react-day-picker/moment";
import { mapDate } from "../util/";
import { MONTHS } from "../../constants/util";

import "react-month-picker/css/month-picker.css";
import "react-day-picker/lib/style.css";

class DownloadFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      department: "",
      uploadBy: "",
      timePeriod: {
        from: null,
        to: null
      },
      uploadDate: null,
      showFromDate: false,
      showToDate: false
    };

    this.handleFilterViewChange = this.handleFilterViewChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.showFromDate = this.showFromDate.bind(this);
    this.hideFromDate = this.hideFromDate.bind(this);
    this.showToDate = this.showToDate.bind(this);
    this.hideToDate = this.hideToDate.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  getFilters(department, from, to, uploadBy, uploadDate) {
    const defaultYear = new Date().getFullYear();
    return {
      department: department !== null ? department : this.state.department,
      timePeriod: {
        from: from === null ? { year: 0, month: 0 } : from,
        to: to === null ? { year: defaultYear, month: 11 } : to
      },
      uploadedBy: uploadBy !== null ? uploadBy : this.state.uploadBy,
      uploadDate: uploadDate === null ? "" : formatDate(uploadDate, "DD/MM/YYYY")
    };
  }

  handleFilterViewChange() {
    var growDiv = document.getElementsByClassName("download-filter-grow")[0];
    if (this.state.showFilters) {
      this.setState(
        {
          showFilters: false,
          uploadBy: "",
          department: "",
          timePeriod: {
            from: null,
            to: null
          },
          uploadDate: null,
          showFromDate: false,
          showToDate: false
        },
        () => this.props.handleFilterDataChange(this.getFilters(null, null, null, null, null))
      );
      growDiv.style.height = 0;
    } else {
      this.setState({
        showFilters: true
      });
      const wrapper = document.querySelector(".download-filter-wrapper");
      growDiv.style.height = wrapper.clientHeight + "px";
    }
  }

  handleTextChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.props.handleFilterDataChange(
      this.getFilters(
        event.target.name === "department" ? event.target.value : null,
        this.state.timePeriod.from,
        this.state.timePeriod.to,
        event.target.name === "uploadBy" ? event.target.value : null,
        this.state.uploadDate
      )
    );
  }

  handleFromDateChange(year, month) {
    this.hideFromDate();
    month--;
    this.setState({
      timePeriod: {
        from: { year: year, month: month },
        to: this.state.timePeriod.to
      }
    });
    this.props.handleFilterDataChange(
      this.getFilters(
        null,
        { year: year, month: month },
        this.state.timePeriod.to,
        null,
        this.state.uploadDate
      )
    );
  }

  handleToDateChange(year, month) {
    this.hideToDate();
    month--;
    this.setState({
      timePeriod: {
        from: this.state.timePeriod.from,
        to: { year: year, month: month }
      }
    });
    this.props.handleFilterDataChange(
      this.getFilters(
        null,
        this.state.timePeriod.from,
        { year: year, month: month },
        null,
        this.state.uploadDate
      )
    );
  }

  handleDateChange(date) {
    this.setState({
      uploadDate: date
    });
    this.props.handleFilterDataChange(
      this.getFilters(null, this.state.timePeriod.from, this.state.timePeriod.to, null, date)
    );
  }

  showFromDate() {
    this.hideToDate();
    this.setState({
      showFromDate: true
    });
  }

  hideFromDate() {
    this.setState({
      showFromDate: false
    });
  }

  showToDate() {
    this.hideFromDate();
    this.setState({
      showToDate: true
    });
  }

  hideToDate() {
    this.setState({
      showToDate: false
    });
  }

  componentDidMount() {
    this.props.handleFilterDataChange(this.getFilters(null, null, null, null, null));
  }

  render() {
    let yearRange = [],
      date = new Date();
    for (let i = 0; i <= 20; i++) {
      yearRange = [...yearRange, date.getFullYear() - 20 + i];
    }
    const fromDate = this.state.timePeriod.from;
    const valueFromDate = fromDate
      ? { year: fromDate.year, month: fromDate.month + 1 }
      : { year: date.getFullYear(), month: date.getMonth() };
    const toDate = this.state.timePeriod.to;
    const valueToDate = toDate
      ? { year: toDate.year, month: toDate.month + 1 }
      : { year: date.getFullYear(), month: date.getMonth() };
    return (
      <div className={this.state.showFilters ? "download-filter active" : "download-filter"}>
        <div className="download-filter-title" onClick={this.handleFilterViewChange}>
          <span>Filters</span>
          {this.state.showFilters ? <ChevronUp /> : <ChevronDown />}
        </div>
        <div className="download-filter-grow">
          <div className="download-filter-wrapper">
            <div className="download-filter-field-container download-filter-uploaded-by-container">
              <label className="download-filter-label">Uploaded by: </label>
              <input
                type="text"
                className="download-filter-input-field"
                placeholder="Username"
                name="uploadBy"
                value={this.state.uploadBy}
                onChange={this.handleTextChange}
              />
            </div>

            <div className="download-filter-field-container download-filter-user-container">
              <label className="download-filter-label">Department: </label>
              <input
                type="text"
                className="download-filter-input-field"
                placeholder="Department"
                name="department"
                value={this.state.department}
                onChange={this.handleTextChange}
              />
            </div>

            <div className="download-filter-field-container download-filter-time-period-container">
              <label className="download-filter-label">Time period: </label>
              <div className="InputFromTo">
                <div className="download-from-date el-inline">
                  <MonthPicker
                    show={this.state.showFromDate}
                    years={yearRange}
                    value={valueFromDate}
                    lang={MONTHS}
                    onChange={this.handleFromDateChange}
                  >
                    <input
                      type="text"
                      placeholder="From"
                      onFocus={this.showFromDate}
                      value={mapDate(this.state.timePeriod.from)}
                      readOnly
                    />
                  </MonthPicker>
                </div>
                <div className="download-to-date el-inline">
                  <MonthPicker
                    show={this.state.showToDate}
                    years={yearRange}
                    value={valueToDate}
                    lang={MONTHS}
                    onChange={this.handleToDateChange}
                  >
                    <input
                      type="text"
                      placeholder="To"
                      onFocus={this.showToDate}
                      value={mapDate(this.state.timePeriod.to)}
                      readOnly
                    />
                  </MonthPicker>
                </div>
              </div>
            </div>

            <div className="download-filter-field-container download-filter-upload-date-container">
              <label className="download-filter-label">Upload date: </label>
              <div>
                <DayPickerInput
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="DD/MM/YYYY"
                  placeholder={formatDate(new Date(), "DD/MM/YYYY")}
                  onDayChange={this.handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadFilter;
