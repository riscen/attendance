import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Redirect } from 'react-router';
import {Button, Alert} from 'reactstrap';
import Error from './Error';
import axios from 'axios';

class ForgotPassword extends Component {
    constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      sapid : '',
      securyQuestion1 : '',
      securyQuestion2 : '',
      securyAnswer1 : '',
      securyAnswer2 : '',
      userAnswer1 : '',
      userAnswer2 : '',
      error: false,
      errorDescription: "",
      success: false,
      alertSucces: false,
      userNewPass: '',
      userTemp : {}
    };
    
    this.toggle = this.toggle.bind(this);
    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputAswerValue1 = this.handleInputAswerValue1.bind(this);
    this.handleInputAswerValue2 = this.handleInputAswerValue2.bind(this);
    this.handleNewPass = this.handleNewPass.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
 
  handleInputValue(evt) {
    this.setState({
      sapid: evt.target.value
    });
  }
  
  handleInputAswerValue1(evt) {
    this.setState({
      userAnswer1: evt.target.value
    });
  }
  
  handleInputAswerValue2(evt) {
    this.setState({
      userAnswer2: evt.target.value
    });
  }
  
   handleNewPass(evt) {
    this.setState({
      userNewPass: evt.target.value
    });
  }
  
  handleSubmit(evt) {
    evt.preventDefault();
    if(this.state.userAnswer1 == this.state.securyAnswer1 && this.state.userAnswer2 == this.state.securyAnswer2){
      let user = this.state.userTemp;
      //console.log("atras de los 8 difitos")
      if (this.state.userNewPass.length > 5){
        //console.log("PASO LOS & DIGIYOS")
        this.setState({
          error: false
        })
        user.password = this.state.userNewPass
        axios.post("http://www.react-lalovar.c9users.io/updateUserInfo",  user)
                .then(res => {
                    if(res.status  == 200) {
                        this.setState ({
                          error : false,
                          alertSucces : true,
                          success: false
                        })
                    }
                })
                .catch(error => {
                    console.log("error", error);
                    this.setState ({
                        error: true,
                        alertSucces : false,
                        success : false,
                        errorDescription: "Something went wrong, check your info and try again!"
                    });
                });
      }else{
        this.setState({
          error : true,
          errorDescription : "Password must be at least 6 digit long"
        });
      }
    }else{
      this.setState({
        error : true,
        errorDescription: "Verify your answers, information does not match."
      });
    }
  }
  
  handleSearch(evt) {
    evt.preventDefault();
    if( this.state.sapid.length == 8 ){
      this.setState({
        error: false,
        success: false,
        errorDescription: ""
      });
      //do rest request
      let userSapId = {
        sapId: this.state.sapid
      }
      axios.get("http://www.react-lalovar.c9users.io/getUserInfo", {params: {userName: userSapId }})
        .then(res => {
          if(typeof(res.data.secureQuestions) != "undefined") {
            console.log("@@")
            console.log(res)
            console.log("@@")
            this.setState({
              securyQuestion1 : res.data.secureQuestions[0],
              securyQuestion2 : res.data.secureQuestions[1],
              securyAnswer1 : res.data.secureAnswers[0],
              securyAnswer2 : res.data.secureAnswers[1],
              userTemp : res.data,
              success: true,
              error: false,
              errorDescription: ""
            });
          }else{
            this.setState ({
              error: true,
              errorDescription: "User does not exists!"
            }); 
          }
        });
    }else{
      this.setState({
        success: false,
        error: true,
        errorDescription: "SapID must be 8 digit long"
      });
    }
  }
 
  render(){ 
    let none = {
      display:"none"
    }
    let noPadding ={
      paddingTop:"2%"
    }
    
    let resSucces;
    if (this.state.success){
      resSucces = <div>
                    <div>
                      <input type="text" readOnly className="FormField__Input" defaultValue={this.state.securyQuestion1} style={styles.twoBoxes}/>
                      <input type="text" className="FormField__Input" placeholder="Enter your answer" onChange={this.handleInputAswerValue1} />
                    </div>
                    <div>
                      <input type="text" readOnly className="FormField__Input" defaultValue={this.state.securyQuestion2} style={styles.twoBoxes}/>
                      <input type="text" className="FormField__Input" placeholder="Enter your answer" onChange={this.handleInputAswerValue2} />
                    </div>
                    <div>
                      <label className="FormField__Label" htmlFor="name">New Password</label>
                      <input type="password" className="FormField__Input" placeholder="Enter your new password" onChange={this.handleNewPass} />
                      <br/><br/>
                    </div>
                    <Button color="primary" style= {styles.BtnReset} className="inline-block" onClick={this.handleSubmit}>Reset Pass</Button>{' '}
                  </div>
    }else{
      resSucces = <span></span>
    }
    
    let alertSucces;
    if(this.state.alertSucces){
    alertSucces = (<div>
              <Alert color="success" style= {styles.Alert}>
                Password changed successfully!
              </Alert>
            </div>)
    }else{
      alertSucces = <span></span>
    }
      
    
    return (
      <div style={styles.MarginFrom}>
        
          <div className="FormField">
            <br/>
            <br/>
            <br/>
            <div>
              <label className="FormField__Label" htmlFor="name">SapID</label>
              <input type="text" className="FormField__Input" onChange={this.handleInputValue} placeholder="Enter your sapid"/>
            </div>
            {this.state.error? (<p style= {styles.errText}>{this.state.errorDescription}</p>):(<span></span>)}
            
            <Button color="info" onClick={this.handleSearch}>Search by SapID</Button>
            <br />
            <br />
            {resSucces}
            {/*<Button color="secondary" onClick={this.props.Fun}>Cancel</Button>*/}
            {alertSucces}
          </div>
      </div>
    );
  }
}

 const styles={
    errText:{
      color:'red'
    },
    twoBoxes:{
      marginBottom: '0'
    },
    MarginFrom:{
      marginTop: '-5em',
      marginTop: '-3em'
    },
    Alert:{
    marginTop: '1.5em',
    marginBottom: '-3em'
    },
    BtnReset : { 
    marginBottom : '1em'
    }
    
  }

export default ForgotPassword;