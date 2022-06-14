import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import { Button } from "reactstrap";

import {
    FormGroup,
    Form,
    Input,
    Label,
    Row,
    Col,
    Table,
    Spinner
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


        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
        
        try {
            var count = await this.state.contract.methods.getCoursesCount().call();
            count = parseInt(count);
            console.log(typeof (count));
            console.log(count);

            let tempBody = []

            for (var i = 0; i < count; i++) {
                let code = await this.state.contract.methods.getCourseCode(i).call();
                let capacity = await this.state.contract.methods.getCourseCapacity(i).call();
                let status = await this.state.contract.methods.getCourseStatus(i).call();
                let maxCapacity = await this.state.contract.methods.getCourseMaxCapacity(i).call();
                if (status)
                    status = "Open"
                else
                    status = "Closed"
                let temp = {
                    "indices": i + 1,
                    "code": code,
                    "capacity": capacity,
                    "maxCapacity": maxCapacity,
                    "status": status
                }
                tempBody.push(temp)
            }
            this.setState({ body: tempBody });
            console.log(this.state.body);

        } catch (error) {
            alert(
                `Failed to fetch courseData.`,
            );
            console.error(error);
        }
    }

    NavigateAddCourse = async () =>{
        this.props.history.push("/sr-add-course")
        window.location.reload(false);
    }

    
    render() {
        if (!this.state.web3) {
            return (
                <div>
                    <div>
                        <h1>
                            <Spinner animation="border" variant="primary" />
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
                        <p class="overwievc"> Profile Page</p>
                        <div class="btn-1-c">
                        </div>
                        <div class="btn-2-c">
                            <button type="button" class="btn btn-success" onClick={this.NavigateAddCourse} >Add Course</button>
                        </div>

                        <div class="btn-3-c">
                            <button type="button" class="btn btn-success">Get Courses</button>
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
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            </>
            )
    }
}