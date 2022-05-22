import React, { Component } from "react";
import './index.css';
import history from './history';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import getWeb3 from "./getWeb3";

export default class LoginPage extends Component {

   

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
                        <center><input type="submit" name="btn-1" value="Login" /> </center>
                    </form>
                    
                </div>
            </div>
            </>
            
        );
        
    }
    
}