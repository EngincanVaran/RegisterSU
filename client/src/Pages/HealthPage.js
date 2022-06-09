import React, { Component } from "react";
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";

export default class HealthPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAccount: null,
            web3: null,
            accounts: null,
            contract: null
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

            const currentAccount = await web3.currentProvider.selectedAddress;
            this.setState({ web3, accounts, contract: instance, currentAccount: currentAccount }, this.runExample);
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        return (
            <div>
                <center><div class="title"><h1>Health Page</h1></div></center>
                <center><div class="title"><h2>Current Account:</h2></div></center>
                <center><div class="title"><h3>{this.state.currentAccount}</h3></div></center>
            </div>
        );

    }

}