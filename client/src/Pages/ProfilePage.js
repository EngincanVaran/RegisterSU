import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    Table,
    Spinner
} from "reactstrap";

export default class ProfilePage extends Component {

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
            maxCourseNumber: 5,
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
            await this.state.contract.methods.getStudentCourses(this.state.currentAccount).call()
                .then(response => {
                    let tempBody = []
                    for (let i = 0; i < response.length; i++) {
                        tempBody.push(
                            {
                                "indices": i + 1,
                                "code": response[i]
                            }
                        )
                    }
                    this.setState({ body: tempBody })
                });

        } catch (error) {
            console.log(error)
        }
    };

    nagivateToPage = async (path) => {
        this.props.history.push(path)
        window.location.reload(false);
    }

    dropCourse = async (_courseCode) => {
        await this.state.contract.methods.dropCourse(
            _courseCode
        ).send({
            from: this.state.account,
        }).then(response => {
            let result = response.events.Drop.returnValues;
            console.log(result);
            if (result) {
                if (result["_canDrop"]) {
                    alert("You successfully dropped " + result["_courseCode"]);
                } else {
                    alert("An error occured please try again!");
                }
            } else {
                alert("Error Occured! Try Again!")
            }
        });
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
                        <p class="overview"> My Courses</p>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-success" disabled>My Courses</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-warning" onClick={() => this.nagivateToPage("/register-course")}>Enroll Course</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-danger" onClick={() => this.nagivateToPage("/trade-course")}>Trade Course</button>
                        </div>
                    </div>

                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.body.map(item => {
                            return (
                                <tr key={item.indices}>
                                    <td>{item.indices}</td>
                                    <td>{item.code}</td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-danger btn-sm"
                                            onClick={() => this.dropCourse(item.code)}
                                        >
                                            Drop
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