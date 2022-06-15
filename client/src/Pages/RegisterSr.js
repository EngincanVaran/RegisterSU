import React, { Component } from "react";
import RegisterSU from "../contracts/RegisterSU.json";
//import { Button } from "reactstrap";
import getWeb3 from "../getWeb3";
import { FormGroup, FormControl, Button } from 'react-bootstrap'

import '../index.css';

export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null,
            sr_code: 'asdfqwer',
            sr_code_input: '',
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
    };

    RegisterFunc = async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (this.state.sr_code_input === '') {
            alert("All the fields are compulsory!");
        }
        else if (this.state.sr_code_input !== this.state.sr_code) {
            alert("Access denied! Your code is wrong!");
        }

        else {
            await this.state.contract.methods.registerStudentResources()
                .send({
                    from: this.state.currentAccount,
                }).then(response => {
                    this.props.history.push("/sr-profile");
                });

            //Reload
            window.location.reload(false);
        }
    }

    updateCode = event => (
        this.setState({ sr_code_input: event.target.value })
    )

    render() {
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
                                        SR Registration
                                    </h1>
                                </div>
                            </div>



                            <div className="form">
                                <FormGroup>
                                    <div className="form-label">
                                        Enter SR Code
                                    </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.sr_code_input}
                                            onChange={this.updateCode}
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