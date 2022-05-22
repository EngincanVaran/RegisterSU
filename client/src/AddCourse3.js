import React, { Component } from "react";
import RegisterSU from "./contracts/RegisterSU.json";
import getWeb3 from "./getWeb3";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
} from "reactstrap";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


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
        return(
            <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Course</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Course Code</label>
                        <Input
                          placeholder="Course Code"
                          name="courseCode"
                          type="text"
                          value={this.state.courseCode}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Course Id</label>
                        <Input
                          placeholder="Course Id"
                          name="courseId"
                          type="text"
                          value={this.state.courseId}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Course Capacity</label>
                        <Input
                          placeholder="Course Capacity"
                          name="courseCapacity"
                          type="text"
                          value={this.state.courseCapacity}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  
                  
                  
                  
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" onClick={this.handleSubmit}>
                  Add Course
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
        );
      }
}

export default App;