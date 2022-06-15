import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    Table,
    Spinner,
    Button
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


export default class ProfilePageSr extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            student: null,
            body: []
        };

    }

    componentDidMount = async () => {
        await this.initWeb3();
    };

    initWeb3 = async () => {
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

            var studentResources = await instance.methods.isStudentResources(currentAccount).call();
            console.log(studentResources);

            if (!studentResources) {
                this.props.history.push("/")
                window.location.reload(false);
            }

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

        try {
            var count = await this.state.contract.methods.getCoursesCount().call();
            count = parseInt(count);
            console.log("Course Count:" + count);

            let tempBody = []

            for (var i = 0; i < count; i++) {
                let code = await this.state.contract.methods.getCourseCode(i).call();
                let capacity = await this.state.contract.methods.getCourseCapacity(i).call();
                let status = await this.state.contract.methods.getCourseStatus(i).call();
                let maxCapacity = await this.state.contract.methods.getCourseMaxCapacity(i).call();
                let action = null
                if (status) {
                    status = "Open"
                    action = "Close Course"
                }

                else {
                    status = "Closed"
                    action = "Open Course"
                }

                let temp = {
                    "indices": i + 1,
                    "code": code,
                    "capacity": capacity,
                    "maxCapacity": maxCapacity,
                    "status": status,
                    "actionName": action
                }
                tempBody.push(temp)
            }
            this.setState({ body: tempBody });
            // console.log(this.state.body);

        } catch (error) {
            alert(
                `Failed to fetch courseData.`,
            );
            console.error(error);
        }
    }

    NavigateToPage = async (path) => {
        this.props.history.push(path)
        window.location.reload(false);
    }

    ToggleCourseStatus = async (_code, _status) => {
        // means course is closed, open it
        let status = 1
        let new_status = "Open"

        // means course is open, close it
        if (_status === "Open") {
            status = 0
            new_status = "Closed"
        }

        await this.state.contract.methods.changeCourseStatus(
            status, _code
        ).send({
            from: this.state.account,
        }).then(response => {
            alert(_code + " status is changed from " + _status + " to " + new_status);
        });

        //Reload
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
                            <img src={require("../components/profile_page.jpg")} />
                        </div>
                        <div class="name-content">
                            <p class="namec">Student Resources</p>
                        </div>
                        <div class="name-content-account">
                            <p class="namec">Your Account: {this.state.currentAccount}</p>
                        </div>
                    </div>
                </div>
                <div class="container-profile-2">
                    <div class="info-container">
                        <p class="overview">All Courses</p>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-primary" disabled>Get Courses</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-danger" onClick={() => this.NavigateToPage("/sr-add-course")} >Add Course</button>
                        </div>
                        <div class="btn-1-c">
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
                            <th>Status</th>
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
                                    <td>{item.status}</td>
                                    <td>
                                        <button
                                            class="btn btn-danger btn-sm"
                                            type='button'
                                            onClick={() => this.ToggleCourseStatus(item.code, item.status)}
                                        >
                                            {item.actionName}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </>
        )
    }
}