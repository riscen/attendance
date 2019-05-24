import React, {Component} from 'react';
import SingleHoliday from "./SingleHoliday";
import { Alert, Button, DropdownItem, Row, Col, Jumbotron } from "reactstrap";
import DayPicker from 'react-day-picker';
import { Card, CardTitle, CardText, Container } from 'reactstrap';
import { get, post } from "../axios/";
import { GET_HOLIDAYS_URL } from "../../constants/util";

import 'react-day-picker/lib/style.css';

class Holiday extends Component {
    constructor(props){
        super(props)
        this.state ={
            disabled:"false",
            selectedDay: null,
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear(),
            holiday: "",
            holidayType: "",
            holidayDescription: "",
            holidayStatus: "",
            creationDate: "",
            userName: "",
            holidays: null,
            holidayDescriptions: null
        };
        this.renderDay = this.renderDay.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.getDaysOfMonth = this.getDaysOfMonth.bind(this);
        this.handleMonthClick = this.handleMonthClick.bind(this);
        this.handleMonthToNull = this.handleMonthToNull.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }    
    
    handleDayClick(day, { selected }) {
        this.setState({
            selectedDay: selected ? undefined : day
        });
        debugger;
        for(let i=0;i< this.state.holidayDescriptions.length; i++){
            let nDay = this.state.holidayDescriptions[i].holidayDate.split("/")[1];
            let month = this.state.holidayDescriptions[i].holidayDate.split("/")[0];
            month = parseInt(month) + 1;
            let date = new Date(month+"/"+nDay+"/"+ ( "20" + this.state.holidayDescriptions[i].holidayDate.split("/")[2]));
            if( typeof(date) == undefined ){
                date = new Date(nDay + "/" + month + "/" + this.state.holidayDescriptions[i].holidayDate.split("/")[2]);
            }
            if(day.getDate() == date.getDate() && day.getMonth() == date.getMonth() && day.getFullYear() == date.getFullYear()){
                let createdByDate = new Date(this.state.holidayDescriptions[i].createdAt);
                let status = this.state.holidayDescriptions[i].status;
                let today = new Date();
                if(Date.parse(date) < Date.parse(today)) {
                   status = "disable"; 
                   this.setState({
                       disabled: true
                   });
                }else{
                    this.setState({
                       disabled: false
                   });
                }  
                this.setState({
                    holiday: this.state.holidayDescriptions[i].holidayName,
                    holidayType: this.state.holidayDescriptions[i].holidayType,
                    holidayDescription: this.state.holidayDescriptions[i].holidayDescription,
                    holidayStatus: status,
                    creationDate: createdByDate.getDate() + "/" + (parseInt(createdByDate.getMonth()) + 1)+"/"+createdByDate.getFullYear(),
                    userName: this.state.holidayDescriptions[i].createdBy
                });
                return;
            }
        }
        
        this.setState({
           disabled: true
        });
        this.setState({
            holiday: "",
            holidayType: "",
            holidayDescription: "",
            holidayStatus: "",
            creationDate: "",
            userName: ""
        });
    }
    
    g(control) {
        return document.getElementById(control);
    }
    
    handleMonthClick(month) {
        this.setState({
          selectedMonth: month.getMonth(),
          selectedYear: month.getFullYear()
        });
        console.log(month.getFullYear());
    }
    
    paintHolidays(day,holidays){
        const date = day.getDate();
        const holidayStyle = { fontSize: '0.7em', textAlign: 'left' };
        const cellStyle = {
            height: 50,
            width: 60,
            position: 'relative',
         };
        const dateStyle = {
            position: 'absolute',
            color: 'lightgray',
            bottom: 0,
            right: 0,
            fontSize: 20,
        };
        return (
            <div style={cellStyle}>
              <div style={dateStyle}>{date}</div>
              {holidays[date] &&
                holidays[date].map((name, i) => (
                  <div key={i} style={holidayStyle}>
                    ✈️ {name}
                  </div>
                ))}
            </div>
            );
    }
    
    getDaysOfMonth(months) {
        let days = {};
        if(months.length > 0){
            for(let i=0; i<months.length; i++) {
                if(months[i].month == this.state.selectedMonth && months[i].year == this.state.selectedYear) {
                    days = {
                        ...days,
                        ...months[i].days
                    }
                }
            }
        }else if(months.month == this.state.selectedMonth && months.year == this.state.selectedYear){
            days = months.days;
        }
        return days;
    }
    
    handleMonthToNull() {
        this.setState({
            holidays : null
        });
    }    

    renderDay(day) {
        //Get holidays from database , index or attribute number is the calendar day 
        if(typeof(this) != undefined && this.state != null && this.state.holidays == null) {
            let url = GET_HOLIDAYS_URL;
            get(url,{params: {year: this.state.selectedYear}},).then( (res) =>{
                console.log( this.state.selectedYear);
                if(typeof(res.data) != undefined ){
                    let tHolidays = [];
                    let tMonth ="";
                    let newMonth = {};
                    for(let i =0; i < res.data.length; i++) {
                        let holiday = res.data[i];
                        let day = parseInt(holiday.holidayDate.split("/")[1]);
                        if( tMonth != holiday.holidayDate.split("/")[0] ) {
                            tMonth = holiday.holidayDate.split("/")[0];
                            
                            if(newMonth != {}){
                                tHolidays.push(newMonth);
                            }
                            newMonth = {
                                month: tMonth,
                                year: holiday.year,
                                days: { [day] : Array.of(holiday.holidayName) }
                            };
                        } else {
                            newMonth.days = { ...newMonth.days, [day] : Array.of(holiday.holidayName)}
                        }
                    }
                    tHolidays.push(newMonth);
                    this.setState({
                        holidays : tHolidays,
                        holidayDescriptions: res.data
                    });
                    return this.paintHolidays(day, this.getDaysOfMonth(tHolidays));
                } 
            });
        }else if(this.state.holidays != null) {
            return this.paintHolidays(day, this.getDaysOfMonth(this.state.holidays));
        }
          
    }
    
    handleDelete() {
        let url = "http://www.react-lalovar.c9users.io/deleteHoliday";
        let date = {
            holidayDate: this.state.selectedDay.getMonth()+ "/" + this.state.selectedDay.getDate() +"/"+this.state.selectedDay.getFullYear()
        }
        post(url, date).then((res)=>{
          if(res.data == "ok"){
              alert("Deleted successfully!");
          }
        });
        
        this.handleMonthToNull();
    }

    render(){
        let min={
            minWidth:"360px"
        };
        
        return(
        <div>
            <Row>
                <Col>
                    <h1 className="h2">Register holidays</h1>
                </Col>
            </Row>
            <Row>
                <Col xs="3" style={min}>
                    <SingleHoliday user={this.props.user} handleMonthToNull={this.handleMonthToNull}/>
                </Col>
                <Col>
                    <Card body outline color="warning">
                        <Alert color="warning">
                            <h4 className="col-sm-offset-2">
                                Holiday Calendar
                            </h4>
                        </Alert>
                           <DayPicker
                              canChangeMonth={true}
                              className="Birthdays"
                              renderDay={this.renderDay}
                              selectedDays={this.state.selectedDay}
                              onMonthChange={this.handleMonthClick}
                              onDayClick={this.handleDayClick}
                            />
                        <Row>
                            <Col>
                                <label htmlFor="name"><b>Holiday: </b></label>
                                <input name="name" type="text" value={this.state.holiday} disabled/><br/>
                                <label htmlFor="status"><b>Holiday type:</b></label>
                                <input name="status" type="text" value={this.state.holidayType} disabled />
                            </Col>
                            <Col>
                                <label htmlFor="desc"><b>Holiday description: </b></label>
                                <input name="desc" type="text" value={this.state.holidayDescription} disabled/><br/>
                                <label htmlFor="status"><b>Status:</b></label>
                                <input name="status" type="text" value={this.state.holidayStatus} disabled />
                            </Col>
                              <Col>
                                <label htmlFor="savedAt"><b>Created: </b></label>
                                <input name="savedAt" type="text" value={this.state.creationDate} disabled/><br/>
                                <label htmlFor="user"><b>Created by:</b></label>
                                <input name="user" type="text" value={this.state.userName} disabled />
                            </Col>
                        </Row>
                        <Row>
                             <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button onClick={this.handleDelete} color="danger" id="btnDelete" className="col-sm-12" disabled={this.state.disabled}> Delete </Button>      
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
            );   
    }
}




export default Holiday;