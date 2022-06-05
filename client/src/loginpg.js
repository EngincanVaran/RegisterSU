import React, { Component } from "react";
import './index.css';
import history from './history';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import getWeb3 from "./getWeb3";
import RegisterSU from "./contracts/RegisterSU.json";

export default class LoginPage extends Component {

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
        return(
            <>
            <center><div class="title"><h1>Login Page</h1></div></center>
            <div class="container-login">
                <div class="formBox">
                    <form>
                        <p class="par">Sabanci Mail</p>
                        <input type="text" name="txt-1" placeholder="Online"></input>
                        <p class="par">Password</p>
                        <input type="Password" name="pw-1" placeholder="******"></input>
                        <center><div class="custom-select">
                            <p>Login As: &nbsp;&nbsp;           
                                <select>
                                    <option value="0">Student</option>
                                    <option value="1">SR</option>
                                </select>
                            </p>
                        </div>
                        </center>
                        <center><input type="submit" name="btn-1" value="Login" onClick={() => this.submit()} /> </center>
                    </form>
                    
                </div>
            </div>
            </>
            
        );
        
    }
    
}