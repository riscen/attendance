import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { Redirect } from "react-router";
import Error from "./Error";
import axios from "axios";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import ForgotPassword from "./ForgotPassword";

import * as loggedUser from "../../responses/loginAdmin.json";
// import * as loggedUser from "../../responses/loginUser.json";

class SignInForm extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      password: "",
      error: "",
      redirect: false,
      errorDescription: "",
      user: {},
      modal: false,
      modalAppear: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    //SomeCode

    this.setState({
      error: false
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.handleChange({
      name: this.state.name,
      password: this.state.password,
      user: loggedUser
    });
    this.setState({
      redirect: true,
      user: loggedUser
    });

    /*
    let user = {
      email: this.state.name,
      password: this.state.password
    };

    if (this.state.name == "" || this.state.password == "") {
      this.setState({
        error: true,
        //modalAppear : true,
        errorDescription: "UserName or Passwords cannot be empty"
      });
      return;
    }

    

    axios.post("http://www.react-lalovar.c9users.io/loggin",  user)
      .then(res => {
        if(res.data.sapId !== undefined) {
          this.props.handleChange({
            name: this.state.name,
            password: this.state.password,
            user : res.data,
          });
          this.setState({
            user : res.data,
            redirect : true
          });
        }else{
          this.setState ({
            error: true,
            errorDescription: "User invalid, email or password is incorrect!"
          }); 
        }
      })
      .catch(error => {
        console.log("error", error);
        this.setState ({
          error: true,
          errorDescription: "Verify your internet connection!"
        }); 
      });*/
  }

  render() {
    const error = this.state.error;
    let resultado;
    let none = {
      display: "none"
    };
    let noPadding = {
      paddingTop: "2%"
    };

    if (this.state.redirect) {
      return <Redirect push to="/MainApp" />;
    }

    if (error) {
      resultado = <Error mensaje={this.state.errorDescription} />;
    }
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Forgot Password</ModalHeader>
          <ModalBody>
            <ForgotPassword Fun={this.toggle} />
          </ModalBody>
        </Modal>

        <div className="FormTitle">
          <NavLink
            exact="/"
            to="/"
            activeClassName="FormTitle__Link--Active"
            className="FormTitle__Link"
            style={noPadding}
          >
            Sign In.
          </NavLink>
        </div>
        <form className="FormFields">
          <div className="FormField">
            <br />
            <br />
            <br />
            <label className="FormField__Label" htmlFor="name">
              Email
            </label>
            <input
              type="name"
              id="name"
              className="FormField__Input"
              placeholder="Enter your name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>

          <div className="FormField">
            <label className="FormField__Label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="FormField__Input"
              placeholder="Enter your password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <br />
            <br />
            <Link to="/CreateAccount">
              Don't you have an account? Create one.
            </Link>
            <br />
            <a href="#" onClick={this.toggle}>
              Forgot password?
            </a>
          </div>

          <div className="FormField">
            <button
              className="FormField__Button mr-20 col-sm-5"
              onClick={this.handleSubmit}
            >
              Sign In
            </button>
            {/*<button className="FormField__Button mr-20">Sign In</button>*/}
          </div>
          {resultado}
        </form>
      </div>
    );
  }
}

export default SignInForm;
