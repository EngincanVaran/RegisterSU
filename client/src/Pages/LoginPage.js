import React, { Component } from "react";
import RegisterSU from "../contracts/RegisterSU.json";
import { Button } from "reactstrap";
import getWeb3 from "../getWeb3";

import '../index.css';

export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            student: null,
            studentResources: null
        };
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = RegisterSU.networks[networkId];
            const instance = new web3.eth.Contract(
                RegisterSU.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({ contract: instance, web3: web3, account: accounts[0] });

            const currentAccount = await web3.currentProvider.selectedAddress
            console.log(currentAccount)
            this.setState({ currentAccount: currentAccount });

            var studentResources = await this.state.contract.methods.isStudentResources(currentAccount).call();
            console.log(studentResources);
            this.setState({ studentResources: studentResources });

            var student = await this.state.contract.methods.isStudent(currentAccount).call();
            console.log(student)
            this.setState({ student: student });

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        if (this.state.student || this.state.studentResources) {
            return (
                <div className="bodyC">
                    <div className="img-wrapper">
                        <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Register SU</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <h1>You are already registered.</h1>
                            <Button href="/health" className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }} >Health</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <center><div class="title"><h1>Not Registered Account:</h1></div></center>
                <center><div class="title"><h2>{this.state.currentAccount}</h2></div></center>
            </div>

        )

        return (
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