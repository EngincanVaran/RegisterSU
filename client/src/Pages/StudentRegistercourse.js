import React, { Component } from "react";
import '../index.css';
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


export default class StudentRegistercoursePage extends Component {

    render() {  
        return(
    
            <>
            <center><div class="title"><h1>Student Lecture Page</h1></div></center>
            <hr></hr>
            <div class="container-profile">
                <div class="info-container">
                    <div class="avatar">
                    
                    </div>
                    <div class="name-content">
                        <p class="namec">Ali Arda Girgin (Student)</p>
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
                    <div class="btn-3-c">
                        <button type="button" class="btn btn-success">Trade Class</button>
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
                                <Label for="courseID">Course ID</Label>
                                <Input
                                type="text"
                                name="idCourse"
                                id="courseID"
                                placeholder="ID..."
                                />
                            </FormGroup>

                            <Button>Add Course</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
    
            </>
    
        );
        }
    }