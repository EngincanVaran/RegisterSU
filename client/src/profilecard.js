import React, { Component } from "react";
import './index.css';
import history from './history';
import { Redirect } from 'react-router-dom';
import { Button } from "reactstrap";
import getWeb3 from "./getWeb3";
import RegisterSU from "./contracts/RegisterSU.json";

export default class ProfilePage extends Component {

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