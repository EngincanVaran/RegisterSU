import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    Spinner,
} from "reactstrap";
import { FormGroup, FormControl, Button } from 'react-bootstrap'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';



export default class TradeCoursePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            student: null,
            studentName: '',
            studentId: '',
            acc1: '',
            acc2: '',
            course1: '',
            course2: '',
            body: []
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

            var student = await instance.methods.isStudent(currentAccount).call();
            console.log(student);
            if (!student) {
                this.props.history.push("/")
                window.location.reload(false);
            }

            const studentName = await this.state.contract.methods.getStudentName(this.state.currentAccount).call();
            this.setState({ studentName: studentName })
            const studentId = await this.state.contract.methods.getStudentId(this.state.currentAccount).call();
            this.setState({ studentId: studentId })
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    nagivateToPage = async (path) => {
        this.props.history.push(path)
        window.location.reload(false);
    }

    render() {
        if (!this.state.web3) {
            return (
                <div>
                    <div>
                        <h1>
                            <center><Spinner animation="border" variant="primary" /></center>
                        </h1>
                    </div>

                </div>
            );
        }
        return (
            <>
                <hr></hr>
                <div class="container-profile">
                    <div class="info-container">
                        <div class="avatar">
                            <img src={require("../components/profile_page.jpg")} alt="Profile" />
                        </div>
                        <div class="name-content">
                            <p class="namec">Username: {this.state.studentName}</p>
                        </div>
                        <div class="name-content">
                            <p class="namec">Number: {this.state.studentId}</p>
                        </div>
                        <div class="name-content-account">
                            <p class="namec">Your Account: {this.state.currentAccount}</p>
                        </div>
                    </div>
                </div>
                <div class="container-profile-2">
                    <div class="info-container">
                        <p class="overview">Trade Course</p>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-success" onClick={() => this.nagivateToPage("/profile")}>My Courses</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-warning" onClick={() => this.nagivateToPage("/register-course")}>Enroll Course</button>
                        </div >
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-danger" disabled >Trade Course</button>
                        </div>
                    </div >
                </div >
                <br></br>
                <div className="form">
                                <FormGroup>
                                    <div className="form-label">
                                        Enter Your Address
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            //value={this.state.acc1}
                                           // onChange={this.acc1}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Trader's Address
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            //value={this.state.acc2}
                                            //onChange={this.acc2}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Course Code to send
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            //value={this.state.course1}
                                            //onChange={this.course1}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter Course Code to receive
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            //value={this.state.course2}
                                            //onChange={this.course2}
                                        />
                                    </div>
                                </FormGroup>
                                <br></br>
                                <button type="button" class="btn btn-warning">Trade</button>

                                
                                </div >
            </>

        );
    }
}