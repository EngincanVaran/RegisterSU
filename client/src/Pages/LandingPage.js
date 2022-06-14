import React, { Component } from "react";
import RegisterSU from "../contracts/RegisterSU.json";
//import { Button } from "reactstrap";
import getWeb3 from "../getWeb3";
import { Button } from 'react-bootstrap'

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
            redirect: null,
            studentResources: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
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


    handleInputChange(event) {
        this.setState({
            redirect: "/Register-" + event.target.value
        });
    }
    submit() {
        this.props.history.push(this.state.redirect);
        window.location.reload(false);
    }

    render() {
        if (this.state.student) {
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
                            <Button href="/profile" className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }} >Go to My Profile</Button>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.studentResources) {
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
                            <Button href="/sr-profile" className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }} >Go to My Profile</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="bodyC">
                <a href="/Help" className="faq" style={{ borderRadius: "10%", textDecoration: "none", fontWeight: "bolder" }} >
                    <h3 style={{ color: "wheat" }}>Help?</h3>
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
                                <label class="control-label" style={{ fontSize: "18px", padding: "2px" }}>Select Role</label>
                                <select class="form-control" onChange={this.handleInputChange}>
                                    <option selected="true" disabled="disabled">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="sr">Student Resources</option>
                                </select>
                            </div>

                            <div>
                                <button onClick={() => this.submit()} className="btn btn-primary btn-block" style={{ marginBottom: "10px", marginTop: "10px" }}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )


    }

}