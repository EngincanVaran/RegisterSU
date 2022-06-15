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
            courseCode: '',
            courseCapacity: '',
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
    }

    addCourseToSystem = async () => {

        if (this.state.courseCode === '' || this.state.courseCapacity === '') {
            alert("All the fields are compulsory!");
        }
        else {
            await this.state.contract.methods.addCourse(
                this.state.courseCapacity,
                this.state.courseCode
            ).send({
                from: this.state.account,
            }).then(response => {
                console.log(response.events.AddingCourse.returnValues)
                alert("You successfully added a course");
            });

            //Reload
            //window.location.reload(false);
        }
    }

    updateCode = event => (
        this.setState({ courseCode: event.target.value })
    )
    updateCapacity = event => (
        this.setState({ courseCapacity: event.target.value })
    )

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
                            <p class="namec">Student Resources</p>
                        </div>
                        <div class="name-content-account">
                            <p class="namec">Your Account: {this.state.currentAccount}</p>
                        </div>
                    </div>
                </div>
                <div class="container-profile-2">
                    <div class="info-container">
                        <p class="overview"> Adding Course</p>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-primary" onClick={() => this.nagivateToPage("/sr-profile")}>Get Courses</button>
                        </div>
                        <div class="btn-1-c">
                            <button type="button" class="btn btn-danger" disabled>Add Course</button>
                        </div>
                        <div class="btn-1-c">
                        </div>
                    </div>

                </div>
                <div class="container-profile-3">
                    <Row className="justify-content-center mx-auto">
                        <Col className="col-md-6 mt-5 mb-5" >
                            <h2>Add Course to System</h2>
                            <Form className="form">
                                <FormGroup>
                                    <Label for="courseCode">Course Code</Label>
                                    <Input
                                        type="text"
                                        name="codeCourse"
                                        id="courseCode"
                                        placeholder="Code..."
                                        value={this.state.courseCode}
                                        onChange={this.updateCode}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="courseCapacity">Course Capacity</Label>
                                    <Input
                                        type="text"
                                        name="capCourse"
                                        id="courseCapacity"
                                        placeholder="Capacity..."
                                        value={this.state.courseCapacity}
                                        onChange={this.updateCapacity}
                                    />
                                </FormGroup>
                                <Button onClick={this.addCourseToSystem} >Add Course</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>

            </>

        );
    }
}