import React, { Component } from "react";
import { Link } from "react-router-dom";
import Error from "./Error";
import {get, post } from "./axios/";
import { Redirect } from "react-router";
import { Alert, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from "lodash";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormFeedback,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      newUser: {},
      errors: {},
      saved: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputEditProfileFormChange = this.onInputEditProfileFormChange.bind(
      this
    );
    this.validateInputs = this.validateInputs.bind(this);
    this.validateEmptyField = this.validateEmptyField.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.restoreFields = this.restoreFields.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    
    //this.hasErrors = this.hasErrors.bind(this);
  }
  
  handleOnChange(event) {
    
    let user = this.state.newUser;
    user.employeeStatus = event.currentTarget.innerText;
    this.setState({
        newUser: user
    });
  }

  componentWillMount() {
    this.setState({
      user: this.props.user,
      newUser: {
        ...this.props.user,
        newPassword: "",
        confirmPassword: ""
      }
    });
  }

  validateInputs(name, error) {
    let errorConcat = name + "Error";
    switch (name) {
      case "employeeName": {
        this.validateEmptyField(name, error, errorConcat);

        break;
      }
      case "email": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "password": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "client": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "batchNumber": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "projectCode": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "projectName": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      case "reportingManager": {
        this.validateEmptyField(name, error, errorConcat);
        break;
      }
      default: {
        console.log("NOT WORKS");
      }
    }
  }

  updateInfoBackEnd(that){
   
  }

  onSubmit() {
    let someUser = this.state.newUser;
    if(someUser.newPassword != ""){
      someUser.password = someUser.newPassword;  
    }
    this.setState(
      {
        newUser: someUser,
        user: someUser,
        saved: true 
      },()=>{
         let url = "http://www.react-lalovar.c9users.io/updateUserInfo";
         post(url, this.state.newUser)
        .then(function (response) {
            alert('To update all system is necessary login into atttendance again!');
        });
      }
    );
    
    
  }

  onInputEditProfileFormChange(e) {
    const { name, value } = e.target;
    this.setState(
      prevState => ({
        newUser: {
          ...prevState.newUser,
          [name]: value
        }
      }),
      () => {
        console.log("NEW", this.state.newUser);
        //this.validateInputs(name);
      }
    );
  }

  validatePasswords() {

    if (this.state.newUser.newPassword !== this.state.newUser.confirmPassword) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          confirmPassword: true,
          confirmPasswordError: "Passwords do not match"
        }
      }));
    }else if (this.state.newUser.newPassword.length < 6){
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          confirmPassword: true,
          confirmPasswordError: "Password cannot be less than 6 characters"
        }
      }));

    } else {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          confirmPassword: false,
          confirmPasswordError: ""
        }
      }));
    }
  }

  onInputBlur(e) {
    const { name } = e.target;
    const error = e.target.getAttribute("error");
    // console.log(name);
    if (name == "newPassword" || name == "confirmPassword") {
      this.validatePasswords(name);
    } else {
      this.validateInputs(name, error);
    }
  }

  validateEmptyField(name, error, errorConcat) {
    if (this.state.newUser[name] === "") {
      this.setState(
        prevState => ({
          errors: {
            ...prevState.errors,
            [name]: true,
            [errorConcat]: error,
            saved:false
          }
        }),
        () => {}
      );
    }else if(name == "email" && !this.state.newUser[name].endsWith("@hcl.com")){
      this.setState(
        prevState => ({
          errors: {
            ...prevState.errors,
            [name]: true,
            [errorConcat]: error,
             saved:false
          }
        }),
        () => {}
      );
    }
    else {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          [name]: false,
          [errorConcat]: "",
           saved:false
        }
      }));
    }
  }

  restoreFields() {
    this.setState(
      {
        user: this.props.user,
        newUser: {
          ...this.props.user,
          newPassword: "",
          confirmPassword: ""
        }
      },
      () => {
        console.log("USR", this.state.user);
      }
    );
  }

  render() {
    let errorName = "error name";
    let alerts;
    if(this.state.saved){
      alerts=   <Alert color="success">
                  Saved successfully
              </Alert>
    } else {
      alerts = "";
    }
    return (
      <div>
        <h1 className="h2">Edit profile</h1>
        <br />
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="">Name</Label>
              <Input
                value={this.state.newUser.employeeName}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="employeeName"
                id="editName"
                error={"Error Name"}
                placeholder={""}
                invalid={this.state.errors.employeeName ? true : false}
              />
              {this.state.errors.employeeName ? (
                <FormFeedback>
                  {this.state.errors.employeeNameError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                value={this.state.newUser.email}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="email"
                id="exampleEmail"
                error={"Error Email"}
                placeholder={""}
                invalid={this.state.errors.email ? true : false}
              />
              {this.state.errors.email ? (
                <FormFeedback color="danger">
                  {this.state.errors.emailError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={8}>
          {/*
            <FormGroup>
              <Label for="examplePassword"> Current Password</Label>
              <Input
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="password"
                name="password"
                id="password"
                error={"Error Current Password"}
                placeholder="Please type your old password"
                invalid={this.state.errors.currentPassword ? true : false}
              />
              {this.state.errors.password ? (
                <FormFeedback color="danger">
                  {this.state.errors.passwordError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          */}
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="examplePassword"> New Password</Label>
              <Input
                value={this.state.newUser.newPassword}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="password"
                name="newPassword"
                id="newPassword"
                error={"Error New Password"}
                placeholder="Please type your old password"
                invalid={this.state.errors.newPassword ? true : false}
              />
              {this.state.errors.newPassword ? (
                <FormFeedback color="danger">
                  {this.state.errors.newPasswordError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="examplePassword"> Confirm Password</Label>
              <Input
                value={this.state.newUser.confirmPassword}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                error={"Error Confirm Password"}
                placeholder="Please confirm your password"
                invalid={this.state.errors.confirmPassword ? true : false}
              />
              {this.state.errors.confirmPassword ? (
                <FormFeedback color="danger">
                  {this.state.errors.confirmPasswordError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleClient">Client</Label>
              <Input
                value={this.state.newUser.client}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="client"
                id="client"
                error={"Error client"}
                placeholder={""}
                invalid={this.state.errors.client ? true : false}
              />
              {this.state.errors.client ? (
                <FormFeedback color="danger">
                  {this.state.errors.clientError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleBatch">Batch Number</Label>
              <Input
                value={this.state.newUser.batchNumber}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="batchNumber"
                id="batchNumber"
                error={"Error Batch Number"}
                placeholder={""}
                invalid={this.state.errors.batchNumber}
              />
              {this.state.errors.batchNumber ? (
                <FormFeedback color="danger">
                  {this.state.errors.batchNumberError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="Project">Project Code</Label>
              <Input
                value={this.state.newUser.projectCode}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="projectCode"
                id="Project"
                error={"Error Project Code"}
                placeholder={""}
                invalid={this.state.errors.projectCode ? true : false}
              />
              {this.state.errors.projectCode ? (
                <FormFeedback color="danger">
                  {this.state.errors.projectCodeError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="ProjectName">Project Name</Label>
              <Input
                value={this.state.newUser.projectName}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="projectName"
                id="ProjectName"
                error={"Error Project Name"}
                placeholder={""}
                invalid={this.state.errors.projectName ? true : false}
              />
              {this.state.errors.projectName ? (
                <FormFeedback color="danger">
                  {this.state.errors.projectNameError}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="ReportingManager">Reporting Manager</Label>
              <Input
                value={this.state.newUser.reportingManager}
                onChange={this.onInputEditProfileFormChange}
                onBlur={this.onInputBlur}
                type="text"
                name="reportingManager"
                id="ReportingManager"
                error={"Error Reporting Manager"}
                placeholder={""}
                invalid={this.state.errors.reportingManager ? true : false}
              />
              {this.state.errors.reportingManager ? (
                <FormFeedback color="danger">
                  {this.state.errors.reportingManagerError}
                </FormFeedback>
              ) : null}
              <Label for="SapId">SAP ID</Label>
              <Input
                disabled
                type="text"
                name="sapId"
                id="SapId"
                placeholder={this.state.user.sapId}
              />
            </FormGroup>
          </Col>
          <Col>
            <Label for="status">Employee status</Label>
            <UncontrolledDropdown name="status" >
              <DropdownToggle caret>
                {this.state.newUser.employeeStatus}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.handleOnChange}>LTL-long term</DropdownItem>
                <DropdownItem onClick={this.handleOnChange}>STL-short term</DropdownItem>
                <DropdownItem onClick={this.handleOnChange}>Local-nativo</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row>
        <Button
          outline color="primary"
          onClick={this.onSubmit}
          disabled={this.state.errors.hasError}
        >
          UPDATE
        </Button>{" "}
        <Button outline color="secondary" onClick={this.restoreFields}>
          RESTORE
        </Button>{" "}
        <br/>
        <br/>
        {alerts}
      </div>
    );
  }
}
export default EditProfile;
 