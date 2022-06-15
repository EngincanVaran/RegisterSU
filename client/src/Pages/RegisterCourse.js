import React, { Component } from "react";
import '../index.css';
import { Button, CardTitle } from "reactstrap";
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import {
    FormGroup,
    Form,
    Input,
    Label,
    Row,
    Col
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
            courseCode: '',
            web3Init: false
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
            const studentName = await this.state.contract.methods.getStudentName(this.state.currentAccount).call();
            this.setState({ studentName: studentName })
            const studentId = await this.state.contract.methods.getStudentId(this.state.currentAccount).call();
            this.setState({ studentId: studentId })
            console.log("LOL")
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    Register = async () => {

        if (this.state.courseCode === '') {
            alert("Enter a code!");
        }
        else {
            let res = await this.state.contract.methods.registerToCourse(
                this.state.courseCode
            )
                .send({
                    from: this.state.account,
                }).then(response => {
                    //this.props.history.push("/health");
                    console.log(response)
                    alert("You successfully registered");

                });

            //Reload
            //window.location.reload(false);
            console.log(res)
        }
    }

    updateCode = event => (
        this.setState({ courseCode: event.target.value })
    )


    render() {
        return (
            <>
                <center><div class="title"><h1>Student Lecture Page</h1></div></center>
                <hr></hr>
                <div class="container-profile">
                    <div class="info-container">
                        <div class="avatar">

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
                        <p class="overwievc"> ✓ Overwiev</p>
                        <div class="btn-1-c">
                        </div>
                        <div class="btn-2-c">
                            <button type="button" class="btn btn-success">Register Course</button>
                        </div>
                        <div class="btn-3-c">
                            <button type="button" class="btn btn-success">Trade Course</button>
                        </div>
                    </div>

                </div>
                <div class="container-profile-3">
                    <Row className="justify-content-center mx-auto">
                        <Col className="col-md-6 mt-5 mb-5" >
                            <Row className="d-flex justify-content-end">
                                <button type="button" class="btn-close" aria-label="Close"></button>
                            </Row>
                            <h2>Add Course to Your Schedule</h2>
                            <Form className="form">

                                <FormGroup>
                                    <Label for="courseID">Course Code</Label>
                                    <Input
                                        type="text"
                                        name="idCourse"
                                        id="courseID"
                                        placeholder="ID..."
                                        value={this.state.courseCode}
                                        onChange={this.updateCode}
                                    />
                                </FormGroup>

                                <Button onClick={this.Register} >Register</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>

            </>

        );
    }
}