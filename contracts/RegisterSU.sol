// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract RegisterSU {
    struct Courses {
        uint256 id;
        bool status;
        string courseCode;
        uint256 courseMaxCapacity;
        uint256 courseCapacity;
        address[] students;
    }

    struct Students {
        address id;
        string studentId;
        string username;
        uint256[] courses;
    }

    struct StudentResources {
        address id;
    }

    struct CourseRequest {
        uint256 reqId;
        address studentId;
        uint256 courseId;
    }

    mapping(uint256 => Courses) public courses;
    mapping(address => Students) public StudentMapping;
    mapping(address => StudentResources) public StudentResourcesMapping;
    mapping(uint256 => CourseRequest) public RequestsMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredStudentsMapping;
    mapping(address => bool) public RegisteredStudentResourcesMapping;

    address[] public students;
    address[] public studentResources;

    uint256 public coursesCount;
    uint256 public studentResourcesCount;
    uint256 public studentsCount;
    uint256 public requestsCount;

    event Registration(address _registrationId);
    event AddingCourse(uint256 indexed _landId);
    event Courserequested(address _sellerId);

    constructor() public payable {}

    function getCoursesCount() public view returns (uint256) {
        return coursesCount;
    }

    function getStudentsCount() public view returns (uint256) {
        return studentsCount;
    }

    function getStudentResourcesCount() public view returns (uint256) {
        return studentResourcesCount;
    }

    function getRequestsCount() public view returns (uint256) {
        return requestsCount;
    }

    //registration of studentResources
    function registerStudentResources() public {
        //require that StudentResources is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentResourcesMapping[msg.sender] = true;
        studentResourcesCount++;
        StudentResourcesMapping[msg.sender] = StudentResources(msg.sender);
        studentResources.push(msg.sender);
        emit Registration(msg.sender);
    }

    //registration of students
    function registerStudents(string memory _studentId, string memory _username)
        public
    {
        //require that student is not already registered
        require(!RegisteredAddressMapping[msg.sender]);
        require(bytes(_studentId).length > 0);
        require(bytes(_username).length > 0);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentsMapping[msg.sender] = true;
        studentsCount++;

        uint256[] memory sCourses = new uint256[](7);
        StudentMapping[msg.sender] = Students(
            msg.sender,
            _studentId,
            _username,
            sCourses
        );
        students.push(msg.sender);
        emit Registration(msg.sender);
    }

    function isStudentResources(address _id) public view returns (bool) {
        if (RegisteredStudentResourcesMapping[_id]) {
            return true;
        }
        return false;
    }

    function isStudent(address _id) public view returns (bool) {
        if (RegisteredStudentsMapping[_id]) {
            return true;
        }
        return false;
    }
}
