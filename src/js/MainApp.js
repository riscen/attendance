import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import Upload from './upload/Upload'; //All of us
import Download from "./download/Download"; //Raul
import Calendar from "./calendar/Calendar"; //Raul
import Holiday from "./holiday/Holiday"; //Raul
import Consult from './Charts'; //Lalo
import EditProfile from './EditProfile';
import Security from './Security'; //Lalo
//import Loggin from './SignInForm';//Fer
import FeatherIcon from 'feather-icons-react';
import '../css/bootstrap.css';
import '../css/dashboard.css';
import { Redirect } from 'react-router';

class MainApp extends Component {
  
  constructor(props){
    super(props);  
    this.state = {
      userName : this.props.data.name,
      user : this.props.data.user
    };
    console.log(this.state.userName);
    this.navBetweenTabs = this.navBetweenTabs.bind(this);    
    this.deleteState = this.deleteState.bind(this); 
  }

  g(control){
    return  document.getElementById(control);
  } 
  
  deleteState(){
    this.setState({
      currentActiveTab : 0,
      userName : null,
      user : null
    });
    this.props.handleLogOut();
  }

  navBetweenTabs(event){
    event.preventDefault();    
    console.log('props', this.props);
    if (this.props.data.user.role === "1") {
      this.g("aUpload").classList.remove("active");
      this.g("aDownload").classList.remove("active"); 
      this.g("aSecurity").classList.remove("active");
      this.g("aHoliday").classList.remove("active");
      this.g("aEditProfile").classList.remove("active");
    }
    this.g("aConsult").classList.remove("active");
    this.g("aCalendar").classList.remove("active");
    switch(event.target.id){
      case "aUpload": //UploadFile
        this.g("aUpload").classList.add("active");
        ReactDOM.render(<Upload user={this.props.data.name} />, document.getElementById('main'));
        //this.setState({currentActiveTab : 0});        
      break;
      case "aDownload": //Download File
        this.g("aDownload").classList.add("active");
        ReactDOM.render(<Download />, document.getElementById('main'));
        //this.setState({currentActiveTab : 1});
      break;
      case "aCalendar":
        this.g("aCalendar").classList.add("active");
        ReactDOM.render(<Calendar user={this.props.data.user} />, document.getElementById("main"));
        //ReactDOM.render(<Calendar user={this.state.user} />, document.getElementById("main"));
        //this.setState({ currentActiveTab: 2 });
        break;
      case "aConsult": //Check Charts
        this.g("aConsult").classList.add("active");
        ReactDOM.render(<Consult />, document.getElementById('main'));
        //this.setState({currentActiveTab : 3});
      break;
      case "aHoliday": //Check Charts
        this.g("aHoliday").classList.add("active");
        ReactDOM.render(<Holiday user={this.props.data.user}/>, document.getElementById('main'));
        //this.setState({currentActiveTab : 3});
      break;
      case "aSecurity": //Check Charts
        this.g("aSecurity").classList.add("active");
        ReactDOM.render(<Security />, document.getElementById('main'));
        //this.setState({currentActiveTab : 3});
      break;
      case "aEditProfile": //Check Edit profile
        this.g("aEditProfile").classList.add("active");
        //ReactDOM.render(<EditProfile user={this.props.data.user} />, document.getElementById("main"));
        ReactDOM.render(
          <EditProfile
            user={this.state.user}
          />,
          document.getElementById("main")
        );
        //this.setState({ currentActiveTab: 4 });
        break;
      default:
        //doNothing
      break;
    }
  }
      
  componentDidMount(){
     //feather.replace();//Pinta iconos en el menu
     //ReactDOM.render(<Upload user={this.props.data.name} />, document.getElementById('main'));
      /*if (this.props.data.user.role === "1" ) {
       ReactDOM.render(<Upload user={this.props.data.name} />, document.getElementById('main'));
     }
     else {
       ReactDOM.render(<Calendar user={this.props.data.user} />, document.getElementById('main')); 
     } */
     //debugger;
     if(this.props.data.user != null && typeof(this.props.data.user.sapId) != "undefined"){
        ReactDOM.render(this.props.data.user.role === "1" ?<Upload user={this.props.data.name} />  : <Calendar user={this.props.data.user} />, document.getElementById('main'));    
     }
      
  }
      
  render() {
    //console.log('u', this.props.data.user);
    let userNameHeaderStyle = {
      paddingLeft: '2%',
      paddingTop: '0.7em'
    };

    let noPadding ={
      paddingTop:"0px"
    }
    let employeeName_Role;
    if(this.props.data.user.role === "1"){
      employeeName_Role= this.props.data.name + " ( Admin )";
    }else if(this.props.data.user.role === "2") {
      employeeName_Role= this.props.data.name;
    }else{
      return <Redirect push to="/login" />;
    }
    
    return (
        <div className="container-fluid" id="top" >
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#top">Logged in by:</a>
            <h6 className="bg-dark w-100 text-white" style={userNameHeaderStyle}>{employeeName_Role}</h6>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap">
                <Link to ="/" className="nav-link" href="#" onClick={this.deleteState}>Sign out</Link>
              </li>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="row">
              <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                  <ul className="nav flex-column">
                  {this.props.data.user && this.props.data.user.role === "1" ? 
                    <React.Fragment>
                      <li className="nav-item">
                        <a className="nav-link active" id="aUpload"  href="#top" onClick={this.navBetweenTabs} >
                          <span><FeatherIcon icon="upload-cloud"/></span> 
                          Upload File                
                          <span className="sr-only">(current)</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#top" id="aDownload" onClick={this.navBetweenTabs}>
                          <span><FeatherIcon icon="download-cloud"/></span>          
                          Finance Files         
                        </a>
                      </li>
                    </React.Fragment>
                    : 
                    <React.Fragment />
                  }
                    
                    <li className="nav-item">
                      <a className="nav-link" href="#" id="aCalendar" onClick={this.navBetweenTabs}>
                        <span><FeatherIcon icon="calendar"/></span>
                        Shift Calendar
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#top" id="aConsult" onClick={this.navBetweenTabs}>
                          <span><FeatherIcon icon="bar-chart-2"/></span>          
                          Consult Charts             
                      </a>
                    </li>
                  {this.props.data.user && this.props.data.user.role === "1" ? 
                    <React.Fragment>
                     <li className="nav-item">
                      <a className="nav-link" href="#top" id="aHoliday" onClick={this.navBetweenTabs}>
                        <span><FeatherIcon icon="bookmark"/></span>          
                        Holidays             
                      </a>
                     </li>
                     <li className="nav-item">
                        <a className="nav-link" href="#top" id="aSecurity" onClick={this.navBetweenTabs}>
                          <span><FeatherIcon icon="shield"/></span>                         
                          Security
                        </a>
                      </li>
                    </React.Fragment>
                    : 
                    <React.Fragment />
                  }
                    <li className="nav-item fixed-bottom edit-profile-btn">
                    <a
                      className="nav-link"
                      href="#"
                      id="aEditProfile"
                      onClick={this.navBetweenTabs}
                    >
                      <span>
                        <span><FeatherIcon  icon="settings"/></span>
                      </span>
                      Edit Profile
                    </a>
                  </li>
                  </ul>
                </div>
              </nav>  
              
              
              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" style={noPadding}>                 
                <div id="main"></div>          
              </main>
              
              
              
              
            </div>            
          </div>            
        </div>
      );
  }
}

export default MainApp;