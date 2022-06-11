import React, { Component } from "react";
import '../index.css';
import RegisterSU from "../contracts/RegisterSU.json";
import getWeb3 from "../getWeb3";

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


    render() {
        return (

            <>
                <center><div class="title"><h1>Student Profile Page</h1></div></center>
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
                        <p class="overwievc"> Overview</p>
                        <div class="btn-1-c">
                        </div>
                        <div class="btn-2-c">
                            <button type="button" class="btn btn-success">Add Class</button>
                        </div>
                        <div class="btn-3-c">
                            <button type="button" class="btn btn-success">Trade Class</button>
                        </div>
                    </div>

                </div>
                <div class="container-profile-3">

                    <div class="lecture-card">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5zfbTKHAgCd2U1uRDLdflDpzyOnajKcLOwQ&usqp=CAU" alt="Avatar"></img>
                        <div class="container">
                            <p></p>
                            <h3><b>CS210</b></h3>
                            <p>Introduction to Data Science </p>
                            <h4><b>Capacity of the course is: 250</b></h4>
                        </div>
                        <div class="closebutton"> <button type="button" class="btn-close" aria-label="Close"></button>  </div>
                    </div>
                </div>

            </>

        );
    }
}