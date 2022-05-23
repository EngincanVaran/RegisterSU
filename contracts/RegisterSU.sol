// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract RegisterSU {

    struct Courses{
        uint id;
        bool status;
        string courseCode;
        uint courseMaxCapacity;
        uint courseCapacity;
        address[] students;
    }

    struct Students {
        address id;
        string studentId;
        string username;
        uint[] courses;
    }
    
    struct StudentResources{
        address id;
    }

    struct CourseRequest{
        uint reqId;
        address studentId;
        uint courseId;
    }

    mapping(uint => Courses) public courses;
    mapping(address => Students) public StudentMapping;
    mapping(address => StudentResources) public StudentResourcesMapping;
    mapping(uint => CourseRequest) public RequestsMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredStudentsMapping;
    mapping(address => bool) public RegisteredStudentResourcesMapping;

    address[] public students;
    address[] public studentResources;

    uint public coursesCount;
    uint public studentResourcesCount;
    uint public studentsCount;
    uint public requestsCount;

    event Registration(address _registrationId);
    event AddingCourse(uint indexed _landId);
    event Courserequested(address _sellerId);

    constructor() public payable{
    }
    
    function getCoursesCount() public view returns (uint) {
        return coursesCount;
    }

    function getStudentsCount() public view returns (uint) {
        return studentsCount;
    }

    function getStudentResourcesCount() public view returns (uint) {
        return studentResourcesCount;
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }

   //registration of studentResources
    function registerStudentResources() public {
        //require that StudentResources is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentResourcesMapping[msg.sender] = true ;
        studentResourcesCount++;
        StudentResourcesMapping[msg.sender] = StudentResources(msg.sender);
        studentResources.push(msg.sender);
        emit Registration(msg.sender);
    }

    //registration of students
    function registerStudents(string memory _studentId, string memory _username) public {
        //require that student is not already registered
        require(!RegisteredAddressMapping[msg.sender]);
        require(bytes(_studentId).length > 0);
        require(bytes(_username).length > 0);


        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentsMapping[msg.sender] = true ;
        studentsCount++;

        uint[] memory sCourses = new uint[](7);
        StudentMapping[msg.sender] = Students(msg.sender, _studentId, _username, sCourses);
        students.push(msg.sender);
        emit Registration(msg.sender);
    }

    function isStudentResources(address _id) public view returns (bool) {
        if(RegisteredStudentResourcesMapping[_id]){
            return true;
        }
    }

    function isStudent(address _id) public view returns (bool) {
        if(RegisteredStudentsMapping[_id]){
            return true;
        }
    }

}