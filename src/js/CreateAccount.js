import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Error from './Error';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Button, Modal, FormGroup, ModalBody, ModalFooter, Label, Input, } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class CreateAccount extends Component {
  
  constructor(){
    super();
      this.state = {
            name: '',
            nameError: '',
            email: '',
            emailError: '',
            reportingManager: '',
            reportingManagerError: '',
            sapID: '',
            sapIDError: '',
            batch: '',
            batchError: '',
            projectName: '',
            projectNameError: '',
            projectKey: '',
            projectKeyError: '',
            /**/
            employeeStatus: "LTL-long term",
            employeeStatusErr: "",
            workLocation:"",
            workLocationErr:"",
            client: "",
            clientErr: "",
            /**/
            password: '',
            passwordError: '',
            errorDescription : '',
            error: '',
            redirect: false,
            users: {},
            modal: true,
            modalAppear : false,
            securyQestionArr: [
                {"id" : 0, "question" : "What is the first name of the person you first kissed?" },
                {"id" : 1, "question" : "What was the name of your elementary / primary school?"},
                {"id" : 2, "question" : "What time of the day were you born? (hh:mm)"},
                {"id" : 3, "question" : "In what year was your father born?"},
                {"id" : 4, "question" : "What is your favorite movie?"},
              
                {"id" : 5, "question" : "What is your pet’s name?"},
                {"id" : 6, "question" : "What was your childhood nickname?"},
                {"id" : 7, "question" : "What is the name of your favorite childhood friend?"},
                {"id" : 8, "question" : "In what city or town did your mother and father meet?"},
                {"id" : 9, "question" : "What was your favorite sport in high school?"}],
            secureQuestions : ["What is the first name of the person you first kissed?","What is your pet’s name?"],
            securyQestionError: '',
            securyAnswer: ["",""],
            securyAnswerError: '',
            securyAnswerError2: ''
        }; 

        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAnswers1 = this.handleChangeAnswers1.bind(this);
        this.handleChangeAnswers2 = this.handleChangeAnswers2.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.toggle = this.toggle.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
  }
  

  toggle() {
    this.setState({
      modal: true
    });
  }
  
  handleChange(e) {
      let target = e.target;
      let value = target.type === 'checkbox' ? target.checked : target.value;
      let name = target.name;     
      this.setState({
        [name]: value
      });
  }
  
  handleChangeAnswers1(e) {
    const target = e.target.value;
    let arrTemp = this.state.securyAnswer;
    arrTemp[0] = target;
    this.setState({
      securyAnswer : arrTemp
    });
  }
  
  handleChangeAnswers2(e) {
    const target = e.target.value;
    let arrTemp = this.state.securyAnswer;
    arrTemp[1] = target;
    this.setState({
      securyAnswer : arrTemp
    });
  }
  
  handleSelect(e) {
    const target = e.target.value ;
    let arrTemp = this.state.secureQuestions;
    if(target < 5){
      arrTemp[0] = this.state.securyQestionArr[target].question;
    }else{
      arrTemp[1] = this.state.securyQestionArr[target].question;
    }
    this.setState({
      secureQuestions : arrTemp
    });
  }
  
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  handleRedirect(){
    this.setState({
      redirect : true
    });
    this.clearForm();
  }

  validateNumbers(e) {
    const re = /^[a-zA-Z\s]*$/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };
  
  clearForm(){
     this.setState({
            name: '',
            nameError: '',
            email: '',
            emailError: '',
            reportingManager: '',
            reportingManagerError: '',
            sapID: '',
            sapIDError: '',
            batch: '',
            batchError: '',
            projectName: '',
            projectNameError: '',
            projectKey: '',
            projectKeyError: '',
            employeeStatus: "LTL-long term",
            employeeStatusErr: "",
            workLocation:"",
            workLocationErr:"",
            client: "",
            clientErr: "",
            password: '',
            passwordError: '',
            secureQuestions : ["",""],
            securyQestionError: '',
            securyAnswer: ["",""],
            securyAnswerError: '',
            securyAnswerError2: ''
           })
  }
  
  validate =()=>{
    let isError = false;
    const errors ={};
    if (this.state.name === "") {
      isError = true;
      errors.nameError = "Please write your Name";
    }
    if (this.state.email.indexOf("@") === -1) {
      isError = true;
      errors.emailError = "Required valid Email";
    }
    if(!this.state.email.endsWith("@hcl.com")) {
      isError = true;
      errors.emailError = "Only HCL emails are allowed";
    }
    if (this.state.reportingManager === "") {
      isError = true;
      errors.reportingManagerError = "Please write your Reporting Manager's ID";
    }
    if ( this.state.reportingManager.length < 8) {
      isError = true;
      errors.reportingManagerError = "Sap id must have 8 characters";
    }
    if (this.state.sapID === "" ) {
      isError = true;
      errors.sapIDError = "Please enter your SapID";
    }
    if ( this.state.sapID.length < 8) {
      isError = true;
      errors.sapIDError = "Sap id must have 8 characters";
    }
    if (this.state.batch === "") {
      isError = true;
      errors.batchError = "Please write your Batch";
    }
    if (this.state.projectName === "") {
      isError = true;
      errors.projectNameError = "Please write your Project Name";
    }
    if (this.state.projectKey === "") {
      isError = true;
      errors.projectKeyError = "Please write your Project Key";
    }
    if (this.state.password ==="") {
      isError = true;
      errors.passwordError = "Please write your Password";
    }
    if (this.state.client ==="") {
      isError = true;
      errors.clientErr = "Please write your Client";
    }
    if (this.state.workLocation ==="") {
      isError = true;
      errors.workLocationErr = "Please write your Work Location";
    }
    
    if (this.state.securyQestion ==="") {
      isError = true;
      errors.securyQestionError = "Please write your Security Question";
    }
    if (this.state.securyAnswer[0].length < 4 ) {
      isError = true;
      errors.securyAnswerError = "Please write your Security Answer properly, must be at least 4 digit long.";
    }
    if (this.state.securyAnswer[1].length < 4 ) {
      isError = true;
      errors.securyAnswerError2 = "Please write your Security Answer properly, must be at least 4 digit long.";
    }
    this.setState({
      ...this.state,
      ...errors
    });
    return isError
  }
  
   handleOnChange(event) {
    this.setState({
      employeeStatus : event.currentTarget.innerText
    });
  }
  
    onSubmit = e=>  {
        e.preventDefault();
        const err = this.validate();
        console.log(err);
         if(!err)
         {
            let user = {
                batchNumber: this.state.batch ,
                email: this.state.email,
                password: this.state.password,
                employeeName: this.state.name,
                projectCode: this.state.projectKey,
                projectName: this.state.projectName,
                reportingManager: this.state.reportingManager,
                client: this.state.client,
                workLocation: this.state.workLocation,
                employeeStatus: this.state.employeeStatus,
                role: '2',
                sapId: this.state.sapID,
                secureQuestions: this.state.secureQuestions,
                secureAnswers: this.state.securyAnswer
            }
             
             axios.post("http://www.react-lalovar.c9users.io/uploadUser",  user)
                .then(res => {
                    if(res.data  == "ok") {
                        this.setState({
                          modalAppear : true,
                        });
                    }
                    else{
                        this.setState ({
                        error: true,
                        errorDescription: res.data + ", check your information and try it again!"
                        }); 
                        this.clearForm();
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    this.setState ({
                        error: true,
                        errorDescription: "Verify your internet connection!"
                    });
                });
            
         }

    }

  render(){ 
    const error = this.state.error;
    let resultado;
    if (this.state.redirect) {
         return <Redirect push to="/" />;
    }
    if(error) {
        resultado = <Error mensaje ={this.state.errorDescription}/>
    }
    let margin = {
      marginLeft : "5%"
    }
    
    let textW = {
      width:"50%"
    }
    
     let textW45 = {
      width:"45%",
      marginLeft : "5%"
    }
    
    const padding = {
      paddingLeft: "51%"
    }
    
    let questionArr = [], questionArr2 = [];
     this.state.securyQestionArr.forEach(element =>{
        element.id < 5 ?
          questionArr.push(<option value={element.id}>{element.question}</option>):
          questionArr2.push(<option value={element.id}>{element.question}</option>);
    });
    
    
    
    
    

    return (
      <div >
        <Modal isOpen={this.state.modalAppear} toggle={this.toggle}>
          <ModalBody>
            <h4>Welcome !</h4>
            <p>Hi <b>{this.state.name} ! </b></p>
            <p>Use your mail: <i>{this.state.email}</i> and your password to enter the system. </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleRedirect}>Continue</Button>
          </ModalFooter>
        </Modal>
      <form>
        <h2 className ="CreateAccount">Sign Up</h2>
        <div className="container">
            <p>Please fill in this form to create an account.</p>
            
            <label htmlFor="name"><b>Name</b></label>
            <div className="MessageError">{this.state.nameError}</div>
            <input type="text" placeholder="Enter your Name" value={this.state.name} onChange={this.handleChange}name="name" onKeyPress={(e) => this.validateNumbers(e)} />
            
            <label htmlFor="email"><b>Email</b></label>
            <div className="MessageError">{this.state.emailError}</div>
            <input type="text" placeholder="Enter your Email" value={this.state.email} onChange={this.handleChange} name="email" />

            <label htmlFor="reportingManager"><b>Reporting Manager</b></label>
            <div className="MessageError">{this.state.reportingManagerError}</div>
            <input type="number" placeholder="Enter your RM ID" value={this.state.reportingManager} onChange={this.handleChange} name="reportingManager"/>
            
            
            <label htmlFor="sapID"><b>SAPID</b></label>
            <label id="batch" htmlFor="bacth"><b>Batch Number</b></label>
            <div className="MessageError">{this.state.sapIDError}</div>
            <div className="MessageErrors">{this.state.batchError}</div>
            <div className="clearfix">
              <input type="number" id="sapid" placeholder="Enter your SAPID" value={this.state.sapID} onChange={this.handleChange} name="sapID" />
              <input type="number" id="batchs"placeholder="Enter your Batch" value={this.state.batch} onChange={this.handleChange} name="batch" style={margin}/>
            </div>
            
            <label htmlFor="client"><b>Client</b></label>
            <label style={padding} htmlFor="workLocation" id="lblworkLocation"><b>Work Location</b></label>
            <div className="MessageError">{this.state.clientErr}</div>
            <div className="MessageErrors">{this.state.employeeStatusErr}</div>
            <div className="clearfix">
              <input style={textW} type="text" id="client" placeholder="Enter your Client" value={this.state.client} onChange={this.handleChange} name="client" />
              <input style={textW45} type="text" id="workLocation" placeholder="Enter your work location" value={this.state.workLocation} onChange={this.handleChange} name="workLocation"  />
            </div>
            
            <label htmlFor="projectName"><b>Project Name</b></label>
            <label id="projectKey" htmlFor="projectkey"><b>Project Key</b></label>
            <div className="MessageError">{this.state.projectNameError}</div>
            <div className="MessageErrors">{this.state.projectKeyError}</div>
            <div className="clearfix">
            <input type="projectName" placeholder="Enter your Project Name" value={this.state.projectName} onChange={this.handleChange} name="projectName" />
            <input type="text" id="projectkey" placeholder="Enter your Project Key" value={this.state.projectKey} onChange={this.handleChange} name="projectKey" style={margin} />
            </div>
            
            <label htmlFor="password"><b>Password</b></label>
            <div className="MessageError">{this.state.passwordError}</div>
            <input type="password" className="password" placeholder="Enter Password" value={this.state.password} onChange={this.handleChange} name="password" />
            <div className="clearfix">
            <label htmlFor="secureQuestions"><b>Security Question(s)</b></label>
            <div className="MessageError">{this.state.securyQestionError}</div>
            <br />
            
            <FormGroup >
              <Input type="select" onChange={this.handleSelect}>
                {questionArr}
              </Input>
            </FormGroup>
            
            <input type="text" placeholder="Enter your Answer" style={styles.AnswerBox} onChange={this.handleChangeAnswers1} name="securyAnswer1" />
            <div className="MessageError" style={styles.AnswerErros}>{this.state.securyAnswerError}</div>
            <FormGroup>
              <Input type="select" onChange={this.handleSelect}>
                {questionArr2}
              </Input>
            </FormGroup>
            
            <input type="text" placeholder="Enter your Answer" style={styles.AnswerBox} onChange={this.handleChangeAnswers2} name="securyAnswer2" />
            <div className="MessageError" style={styles.AnswerErros} >{this.state.securyAnswerError2}</div>
            <UncontrolledDropdown name="status" >
              <DropdownToggle caret>
                {this.state.employeeStatus}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.handleOnChange}>LTL-long term</DropdownItem>
                <DropdownItem onClick={this.handleOnChange}>STL-short term</DropdownItem>
                <DropdownItem onClick={this.handleOnChange}>Local-nativo</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <br/>
            <br/>
            
            <Link to="/"><button type="submit" className="FormField__Button mr-20 col-sm-offset-4 col-sm-2 signupbtn" onClick={e => this.onSubmit(e)}>Save</button></Link>
            <Link to ="/"><button type="button" className="FormField__Button mr-20 col-sm-2 cancelbtn" >Cancel</button></Link> 
            </div>
            {resultado}
        </div>
      </form>
    </div>
        );
  }
}

 const styles={
    AnswerBox:{
      marginTop: '-10',
      marginBottom: '-2'
    },
    AnswerErros:{
      paddingTop: '-20',
      marginBottom: '30'
    }
  }

export default CreateAccount;
