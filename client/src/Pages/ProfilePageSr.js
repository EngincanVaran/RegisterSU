import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import { Button } from "reactstrap";
import CourseTable from "../components/CourseTable"

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
                if (status)
                    status = "Open"
                else
                    status = "Closed"
                let temp = {
                    "indices": i + 1,
                    "code": code,
                    "capacity": capacity,
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

    AddCourse = async () => {

        if (this.state.courseCode === '' || this.state.courseCapacity === '') {
            alert("All the fields are compulsory!");
        }
        else {
            await this.state.contract.methods.addCourse(
                this.state.courseCapacity,
                this.state.courseCode
            )

                .send({
                    from: this.state.account,
                }).then(response => {
                    //this.props.history.push("/health");
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
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Code</th>
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
                                <td>{item.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        )
        return (
            <>
                <center><div class="title"><h1>SR Add Course</h1></div></center>
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
                        <p class="overwievc"> ✓ Overview</p>
                        <div class="btn-1-c">
                        </div>
                        <div class="btn-2-c">
                            <button type="button" class="btn btn-success">Add Course</button>
                        </div>
                    </div>

                </div>
                <div class="container-profile-3">
                    <Row className="justify-content-center mx-auto">
                        <Col className="col-md-6 mt-5 mb-5" >
                            <Row className="d-flex justify-content-end">
                                <button type="button" class="btn-close" aria-label="Close"></button>
                            </Row>
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
                                <Button onClick={this.AddCourse} >Add Course</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>

            </>

        );
    }
}