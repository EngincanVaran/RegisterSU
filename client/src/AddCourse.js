import React, { Component } from "react";
import RegisterSU from "./contracts/RegisterSU.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      courseCode: "",
      courseId: 0,
      courseCapacity: 0,
      web3: null,
      accounts: null,
      contract: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RegisterSU.networks[networkId];
      const instance = new web3.eth.Contract(
        RegisterSU.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async handleSubmit(event) {
    const code = this.state.courseCode;
    const id = this.state.courseId;
    const capacity = this.state.courseCapacity;
    console.log(code, id, capacity);
    event.preventDefault();

    let result = await this.state.contract.methods.createCourse(id, code, capacity).send({ from: this.state.accounts[0] })
    console.log(result)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Course Code:
            <input type="text" name="courseCode" value={this.state.courseCode} onChange={this.handleInputChange} />
          </label>
          <label>
            Course ID
            <input type="number" name="courseId" value={this.state.courseId} onChange={this.handleInputChange} />
          </label>
          <label>
            Course Capacity
            <input type="number" name="courseCapacity" value={this.state.courseCapacity} onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
