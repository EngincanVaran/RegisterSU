import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";
import { Button, CardTitle } from "reactstrap";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Label,
    Row,
    Col,
    CardSubtitle
} from "reactstrap";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';



export default class InstructorAddCoursePage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            student: null,
            courseCode: '',
            courseCapacity: ''
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
            
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
        try {

        } catch (error) {
            console.log(error)
        }
    };

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
        return(   
            <>
            <center><div class="title"><h1>SR Add Course</h1></div></center>
            <hr></hr>
            <div class="container-profile">
                <div class="info-container">
                    <div class="avatar">
                    
                    </div>
                    <div class="name-content">
                        <p class="namec">Instructor</p>
                    </div>
                </div>
            </div>
            <div class="container-profile-2">
                <div class="info-container">
                    <p class="overwievc"> ✓ Overwiev</p>
                    <div class="btn-1-c">
                    </div>
                    <div class="btn-2-c">
                        <button type="button" class="btn btn-success">Add Class</button>
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

    //butondan add course yazınca contract gelmiyor
    //register courseda input boş geliyor ganacheda