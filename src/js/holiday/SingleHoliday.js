import React, {Component} from 'react';
import FeatherIcon from 'feather-icons-react';
import { Card, Button,Row, Col } from 'reactstrap';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { post } from "../axios/";

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert, Input, Badge   } from 'reactstrap';


class SingleHoliday extends Component {
    
    constructor(props){
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.validate = this.validate.bind(this);
        this.state = {
          selectedDay: null,
          holidayType: "Non-workable day",
          holidayName: "",
          holidayNameInvalid: false,
          holidayDescription : "",
          holidayDescriptionInvalid: false,
          currentMonth: new Date().getMonth(),
          currentYear: new Date().getFullYear(),
        };
    }
    
    handleDayClick(day, { selected }) {
        this.setState({
          selectedDay: selected ? undefined : day,
        });
    }
    
    handleOnChange(event) {
        this.setState({
            holidayType: event.currentTarget.innerHTML
        });
    }
    
    handleClick() {
        if(this.validate()){
            let date = this.state.selectedDay.getMonth() + "/" + this.state.selectedDay.getDate() + "/" + this.state.selectedDay.getFullYear();
            let holiday = {
                holidayName: this.state.holidayName,
                holidayDescription: this.state.holidayDescription,
                holidayType: this.state.holidayType,
                holidayDate: date,
                year: this.state.selectedDay.getFullYear(),
                createdBy: this.props.user.employeeName,
                createdAt: new Date().getMonth() + "/" + new Date().getDate() + "/" + new Date().getFullYear(),
                status: "active"          
            }
            let url = "http://www.react-lalovar.c9users.io/uploadHoliday";
            post(url, holiday).then(
                (res) => {
                    if(res.data == "ok"){
                        this.props.handleMonthToNull();
                        alert("Holiday saved successfully!");                   
                    } else {
                        alert("Error trying to save holiday!");   
                    }
                }
            );
        }
    }
    
    handleChange(e){
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;     
        this.setState({
            [name]: value
        });
    }
    
    validate() {
        if(this.state.holidayName === ""){
            this.setState({holidayNameInvalid:true});
            return false;
        }
        
        if(this.state.holidayDescription === ""){
            this.setState({holidayDescriptionInvalid:true});
            return false;
        }
        if(this.state.selectedDay == null || this.state.selectedDay == ""){
            this.setState({holidayNameInvalid:true});
            this.setState({holidayDescriptionInvalid:true});
            return false;
        }
        this.setState({holidayNameInvalid:false});
        this.setState({holidayDescriptionInvalid:false})
        return true;
    }
    
    render(){
        let showRequired;
        if(this.state.holidayNameInvalid || this.state.holidayDescriptionInvalid){
            showRequired = <Badge color="danger">*Required</Badge>
        }else{
            showRequired = "";
        }
        
        
        return(
            <Card body outline color="info" className="col-sm-11">
                <Alert color="info">
                    <h4 className="col-sm-offset-2">
                        Create new holiday
                    </h4>
                </Alert>
                <Row>
                    <Col>
                        <label htmlFor="calendar"><b>Select day:</b></label>
                        <DayPicker selectedDays={this.state.selectedDay}
                            fromMonth={new Date(this.state.currentYear, this.state.currentMonth)}
                            onDayClick={this.handleDayClick}/>
                        <label>{showRequired} 
                          {this.state.selectedDay
                            ? " " + this.state.selectedDay.toLocaleDateString()
                            :  ' No day selected yet 👻'}
                        </label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="status"><b>Holiday type:</b></label>
                        <UncontrolledDropdown  name="status" >
                          <DropdownToggle caret>
                            {this.state.holidayType}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={this.handleOnChange}>Non-workable day</DropdownItem>
                            <DropdownItem onClick={this.handleOnChange}>National holiday</DropdownItem>
                            <DropdownItem onClick={this.handleOnChange}>HCL DayOff</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="holidayName"><b>{showRequired} Holiday's name:</b></label>
                        <Input onChange={this.handleChange} className="form-control input-sm" type="text" id="txtName" name="holidayName" placeholder="Enter holiday's name"/>
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="holidayDescription"><b>{showRequired} Holiday description:</b></label>
                        <Input onChange={this.handleChange} className="form-control input-sm" type="text" id="txtDescription" name="holidayDescription" placeholder="Enter holiday's description"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={this.handleClick} color="info" className="col-sm-12"> Save holiday </Button>      
                    </Col>
                </Row>
            </Card>
            );
    }
}

export default SingleHoliday;