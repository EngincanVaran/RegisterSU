import React, { Component } from "react";
import history from './history';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import RegisterSU from "./contracts/RegisterSU.json";
import getWeb3 from "./getWeb3";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            role: null,
            redirect: null,
            sr: '',
            student: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = RegisterSU.networks[networkId];
          const instance = new web3.eth.Contract(
            RegisterSU.abi,
            deployedNetwork && deployedNetwork.address,
          );
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, contract: instance }, this.runExample);
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };
      handleInputChange(event) {
        this.setState({
            redirect: "/AddCourse" 
        });
    }
    submit() {
        this.props.history.push(this.state.redirect);
        window.location.reload(false);
    }
    render() {           
        return (
            <div className="bodyC">
                <a href ="/Help" className="faq" style={{borderRadius: "10%", textDecoration: "none", fontWeight: "bolder"}} >
                <h3 style={{color: "wheat"}}>Help?</h3>
                                    </a>
                <div className="img-wrapper">
                    <img src="https://upload.wikimedia.org/wikipedia/tr/d/d3/Sabanc%C4%B1_%C3%9Cniversitesi_logosu.jpg" className="logo" />
                    <div className="wine-text-container">
                        <div className="site-title wood-text">RegisterSU</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h1 style={{ letterSpacing: "3px", fontWeight: 500, color: "black" }}>Welcome !</h1>
                            <h4 style={{ letterSpacing: "2px", color: 'black' }}>Our BC Project RegisterSU</h4>
                            <hr
                                style={{
                                    color: "#696969",
                                    height: 1
                                }}
                            />

                            <div class="form-group" style={{ color: "black" }}>
                                <label class="control-label" for="Company" style={{ fontSize: "18px", padding: "2px" }}>Select Role</label>
                                <select id="Company" class="form-control" name="Company" onChange={this.handleInputChange}>
                                    <option selected="true" disabled="disabled">Select Role</option>
                                    <option value="Student">Student</option>
                                    <option value="SR">SR</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={() => this.submit()} className="btn btn-primary btn-block" style={{ marginBottom: "10px", marginTop: "10px" }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
