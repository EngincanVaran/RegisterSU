import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    Table,
    Spinner
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


export default class StudentRegisterCoursePage extends Component {

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
            this.setState({ currentAccount: currentAccount });

            var student = await instance.methods.isStudent(currentAccount).call();
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
            var count = await this.state.contract.methods.getCoursesCount().call();
            count = parseInt(count);

            let tempBody = [];
            let index = 1
            for (var i = 0; i < count; i++) {
                let code = await this.state.contract.methods.getCourseCode(i).call();
                let capacity = await this.state.contract.methods.getCourseCapacity(i).call();
                let status = await this.state.contract.methods.getCourseStatus(i).call();
                let maxCapacity = await this.state.contract.methods.getCourseMaxCapacity(i).call();
                let action = null
                if (status) {
                    let temp = {
                        "indices": index,
                        "code": code,
                        "capacity": capacity,
                        "maxCapacity": maxCapacity,
                        "actionName": action
                    }
                    tempBody.push(temp);
                    index += 1;
                }
            }
            this.setState({ body: tempBody });

        } catch (error) {
            alert(
                `Failed to fetch courseData.`,
            );
            console.error(error);
        }
    };


    enrollToCourse = async (courseCode) => {
        await this.state.contract.methods.registerToCourse(
            courseCode
        ).send({
            from: this.state.account,
        }).then(response => {
            let result = response.events.Enrolled.returnValues;
            if (result) {
                if (result["_isEnrolled"]) {
                    alert("You successfully registered to " + result["_courseCode"]);
                } else {
                    alert("You are already registered to " + result["_courseCode"]);
                }
            } else {
                alert("Error Occured! Try Again!")
            }
        });
        window.location.reload(false);
    }

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
                        <p class="overview">Enroll Courses</p>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-success" onClick={() => this.nagivateToPage("/profile")}>My Courses</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-warning" disabled>Enroll Course</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-danger" onClick={() => this.nagivateToPage("/trade-course")}>Trade Course</button>
                        </div>
                    </div>
                </div>
                <br></br>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Total Enrolled</th>
                            <th>Capacity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.body.map(item => {
                            return (
                                <tr key={item.indices}>
                                    <td>{item.indices}</td>
                                    <td>{item.code}</td>
                                    <td>{item.capacity}</td>
                                    <td>{item.maxCapacity}</td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-warning btn-sm"
                                            onClick={() => this.enrollToCourse(item.code)}
                                        >
                                            Register
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </>

        );
    }
}