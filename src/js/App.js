import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import '../css/App.css';
import SignInForm from './SignInForm';
import MainApp from './MainApp';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';

class App extends Component {
  constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            user: {}
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

  handleLogOut() {
    this.setState({
      name : null,
      password : null,
      user : null
    });
  }
  
  handleChange(data) {
      this.setState({
        name: data.name,
        password: data.password,
        user : data.user
      })
  }

  render() {
   
    return (
      <Router>
        <div className="App">
          <div className="App__Form" >
            
            {/*<Route path="/sign-in" component={SignInForm} components={{handleChange: this.handleChange}}  />*/}
            <Route exact="/" path="/" render={(props) => <SignInForm {...props} handleChange={this.handleChange} />}  />
            <Route exact="/login" path="/login" render={(props) => <SignInForm {...props} handleChange={this.handleChange} />}  />
            {/*<SignInForm handleChange={this.handleChange} />  */}         
            <div className="Layout_Template">
            {/*<Route path="/MainApp" component={MainApp} components={{data: this.state}}/>*/}
              <Route path="/MainApp" render={(props) => <MainApp {...props} data={this.state} handleLogOut={this.handleLogOut} />}  />
              <Route path="/CreateAccount" render={(props) => <CreateAccount {...props} data={this.state} />}  />
              <Route path="/ForgotPassword" render={(props) => <ForgotPassword {...props} data={this.state} />}  />
            </div>

          </div>
        </div>
      </Router>
    );
  }
}

export default App;
