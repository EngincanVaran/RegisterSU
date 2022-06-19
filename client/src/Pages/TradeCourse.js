import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    Spinner,
} from "reactstrap";
import { FormGroup, FormControl } from 'react-bootstrap'
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
            reciever: '',
            senderCourse: '',
            recieverCourse: '',
            studentCourses: [],
            allCourses: []
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
        try {
            await this.state.contract.methods.getStudentCourses(this.state.currentAccount).call()
                .then(response => {
                    let tempBody = []
                    for (let i = 0; i < response.length; i++) {
                        tempBody.push(
                            {
                                "label": i + 1,
                                "value": response[i]
                            }
                        )
                    }
                    this.setState({ studentCourses: tempBody })
                });

        } catch (error) {
            console.log(error)
        }

        try {
            var count = await this.state.contract.methods.getCoursesCount().call();
            count = parseInt(count);
            console.log("Course Count:" + count);

            let tempBody2 = [];
            for (var i = 0; i < count; i++) {
                let code = await this.state.contract.methods.getCourseCode(i).call();
                let status = await this.state.contract.methods.getCourseStatus(i).call();
                if (status) {
                    tempBody2.push(
                        {
                            "label": i + 1,
                            "value": code
                        }
                    )
                }
            }
            this.setState({ allCourses: tempBody2 });

        } catch (error) {
            alert(
                `Failed to fetch courseData.`,
            );
            console.error(error);
        }
    };

    nagivateToPage = async (path) => {
        this.props.history.push(path)
        window.location.reload(false);
    }

    handleChange = event => {
        this.setState({ reciever: event.target.value })
    }

    doTrade = async () => {

        if (!this.state.reciever || this.state.reciever === "") {
            alert("Please Provide Reciever Details!")
        } else if (!this.state.senderCourse || this.state.senderCourse === "") {
            alert("Please Provide Your Course Details!")
        } else if (!this.state.recieverCourse || this.state.recieverCourse === "") {
            alert("Please Provide Your Wanted Course Details!")
        } else if (this.state.senderCourse === this.state.recieverCourse) {
            alert("Sending and recieving the same course. Cancelling transaction!")
        }
        else {
            console.log("Sender: " + this.state.currentAccount);
            console.log("Reciever: " + this.state.reciever);
            console.log("SenderCourse: " + this.state.senderCourse);
            console.log("RecieverCourse: " + this.state.recieverCourse);

            await this.state.contract.methods.exchangeCourse(
                this.state.reciever,
                this.state.senderCourse,
                this.state.recieverCourse
            ).send({
                from: this.state.currentAccount,
            }).then(response => {
                let result = response.events.TradeResult.returnValues;
                if (result) {
                    let traded = result["_result"]
                    if (!traded) {
                        alert("Trade request sent to " + this.state.reciever + " from you!");
                    } else {
                        alert("Traded courses with" + this.state.reciever + "!");
                    }
                } else {
                    alert("Error Occured! Try Again!")
                }

                console.log(response)
            });

        }
    }

    handleSenderCourseSelect = (event) => {
        this.setState({ senderCourse: event.target.value })
    }

    handleRecieverCourseSelect = (event) => {
        this.setState({ recieverCourse: event.target.value })
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
                            Enter Trader's Address
                        </div>
                        <div className="form-input">
                            <FormControl
                                input='text'
                                value={this.state.reciever}
                                onChange={this.handleChange}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <div className="form-label">
                            Select Course Code to send
                        </div>
                        <select
                            onChange={this.handleSenderCourseSelect}>
                            <option value="" disabled selected>Select your option</option>
                            {this.state.studentCourses.map((option) => (
                                <option
                                    value={option.value}
                                >
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <div className="form-label">
                            Select Course Code to receive
                        </div>
                        <select
                            onChange={this.handleRecieverCourseSelect}>
                            <option value="" disabled selected>Select your option</option>
                            {this.state.allCourses.map((option) => (
                                <option
                                    value={option.value}
                                >
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    <br></br>
                    <button type="button" class="btn btn-warning" onClick={() => this.doTrade()}>Trade</button>
                </div >
            </>

        );
    }
}