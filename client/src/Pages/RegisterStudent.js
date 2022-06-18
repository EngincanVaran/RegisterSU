import React, { Component } from "react";
import RegisterSU from "../contracts/RegisterSU.json";
//import { Button } from "reactstrap";
import getWeb3 from "../getWeb3";
import { FormGroup, FormControl, Button } from 'react-bootstrap'

import '../index.css';

export default class RegisterStudentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            student: null,
            username: '',
            id: '',
            studentResources: null,
            maxCourseNumber: 5,
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

            var studentResources = await this.state.contract.methods.isStudentResources(currentAccount).call();
            console.log(studentResources);
            this.setState({ studentResources: studentResources });

            var student = await this.state.contract.methods.isStudent(currentAccount).call();
            console.log(student)
            this.setState({ student: student });

        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    RegisterFunc = async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));


        if (this.state.username === '' || this.state.id === '') {
            alert("All the fields are compulsory!");
        }
        else {
            await this.state.contract.methods.registerStudents(
                this.state.maxCourseNumber,
                this.state.id,
                this.state.username
            )

                .send({
                    from: this.state.account,
                }).then(response => {
                    this.props.history.push("/profile");
                });

            //Reload
            window.location.reload(false);
        }
    }

    updateUserName = event => (
        this.setState({ username: event.target.value })
    )
    updateId = event => (
        this.setState({ id: event.target.value })
    )


    render() {
        if (this.state.student || this.state.studentResources) {
            return (
                <div className="bodyC">
                    <div className="img-wrapper">
                        <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" alt="Logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Register SU</div>
                        </div>
                    </div>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <h1>You are already registered.</h1>
                            <Button href="/health" className="btn-block" style={{ margin: "2px", backgroundColor: "peru" }} >Health</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="bodyC">
                <div className="img-wrapper">
                    <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" alt="Logo" />
                    <div className="wine-text-container">
                        <div className="site-title wood-text">Register</div>
                    </div>
                </div>
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div className="App">

                            <div>
                                <div>
                                    <h1 style={{ color: "black" }}>
                                        Student Registration
                                    </h1>
                                </div>
                            </div>



                            <div className="form">
                                <FormGroup>
                                    <div className="form-label">
                                        Enter Username
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.username}
                                            onChange={this.updateUserName}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="form-label">
                                        Enter id
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.id}
                                            onChange={this.updateId}
                                        />
                                    </div>
                                </FormGroup>


                                <Button onClick={this.RegisterFunc} className="button-vote">
                                    Register
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );

    }

}