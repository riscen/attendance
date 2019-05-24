import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { MONTHS_LONG, DAYS_IN_MONTH, DAY_TYPE } from "../../constants/util";

const CalendarDay = props => {
  const canBeSelected = props.className === "";
  let className = !canBeSelected ? `${props.className} caledar-table-day-cell` : 
          `${props.className} ${props.selected
          ? "caledar-table-day-cell clickable-cell selected-cell"
          : "caledar-table-day-cell clickable-cell"}`; 
  className = `${className} ${props.dayType.symbol}`;
  return (
      <td
        className={className}
        onClick={canBeSelected ? dayNum => props.handleClick(props.dayNum) : () => {}}
      >
      <Row>
        <Col>
          <div className="non-selectable-text">{props.dayNum}</div>
        </Col>
        <Col>
          <div className="calendar-day-type non-selectable-text">{props.dayType.symbol}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="calendar-day-name non-selectable-text">{props.dayType.name}</div>
        </Col>
      </Row>
    </td>
  );
};

CalendarDay.propTypes = {
  className: PropTypes.any,
  dayNum: PropTypes.any,
  dayType: PropTypes.object,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  weekDay: PropTypes.any
};

export default CalendarDay;
