// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract RegisterSU {
    struct Courses {
        string courseCode;
        bool status;
        uint256 courseMaxCapacity;
        uint256 courseCapacity;
        address[] students;
    }

    struct Students {
        address id;
        string studentId;
        string username;
        uint256 maxCourseNumber;
        string[] courses;
    }

    struct StudentResources {
        address id;
    }

    struct CourseRequest {
        uint256 reqId;
        address studentId;
        string courseId;
    }

    mapping(string => Courses) public courses;
    mapping(uint256 => Courses) public courseList;
    mapping(address => Students) public StudentMapping;
    mapping(address => StudentResources) public StudentResourcesMapping;
    mapping(string => CourseRequest) public RequestsMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredStudentsMapping;
    mapping(address => bool) public RegisteredStudentResourcesMapping;
    mapping(string => bool) public CourseMapping;

    address[] public students;
    address[] public studentResources;

    uint256 private coursesCount;
    uint256 private studentResourcesCount;
    uint256 private studentsCount;
    uint256 private requestsCount;

    event Registration(address _registrationId);
    event AddingCourse(string _courseCode);
    event Courserequested(address _studentId);

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
        require(
            !RegisteredAddressMapping[msg.sender],
            "You are already registered as a SR."
        );

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentResourcesMapping[msg.sender] = true;
        studentResourcesCount++;
        StudentResourcesMapping[msg.sender] = StudentResources(msg.sender);
        studentResources.push(msg.sender);
        emit Registration(msg.sender);
    }

    //registration of students
    function registerStudents(
        uint256 maxCourseNumber,
        string memory _studentId,
        string memory _username
    ) public {
        //require that student is not already registered
        require(
            !RegisteredAddressMapping[msg.sender],
            "You are already registered as a student."
        );
        require(bytes(_studentId).length > 0);
        require(bytes(_username).length > 0);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredStudentsMapping[msg.sender] = true;
        studentsCount++;

        string[] memory sCourses;
        StudentMapping[msg.sender] = Students(
            msg.sender,
            _studentId,
            _username,
            maxCourseNumber,
            sCourses
        );
        students.push(msg.sender);
        emit Registration(msg.sender);
    }

    function addCourse(uint256 maxStudentCount, string memory courseCode)
        public
    {
        require(isStudentResources(msg.sender), "You are not the SR.");
        require(
            !isCourseAddedBefore(courseCode),
            "This course has already added to list."
        );
        address[] memory sCourses = new address[](maxStudentCount);
        CourseMapping[courseCode] = true;
        courseList[coursesCount] = Courses(
            courseCode,
            false,
            maxStudentCount,
            0,
            sCourses
        );
        coursesCount++;
        courses[courseCode] = Courses(
            courseCode,
            false,
            maxStudentCount,
            0,
            sCourses
        );

        emit AddingCourse(courseCode);
    }

    function changeCourseStatus(uint256 status, string memory courseCode)
        public
    {
        require(isStudentResources(msg.sender));
        require(
            isCourseAddedBefore(courseCode),
            "This course hasn't been added to the course list yet."
        );
        bool courseStatus = false;
        if (status == 1) {
            courseStatus = true;
        }
        courses[courseCode].status = courseStatus;
    }

    function registerToCourse(string[] memory courseCodes)
        public
        returns (string[] memory)
    {
        require(isStudent(msg.sender));

        // string[] memory studentCourses = courseCodes;

        for (uint256 i = 0; i < courseCodes.length; i++) {
            StudentMapping[msg.sender].courses.push(courseCodes[i]);
        }

        return StudentMapping[msg.sender].courses;
        //sCourses.push(msg.sender);
        //courses[courseCode].students =  courses[courseCode].students.add(sCourses);
    }

    function isStudentResources(address _id) public view returns (bool) {
        if (RegisteredStudentResourcesMapping[_id]) {
            return true;
        }
        return false;
    }

    function isCourseAddedBefore(string memory code)
        public
        view
        returns (bool)
    {
        if (CourseMapping[code]) {
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

    function getStudentName(address _id) public view returns (string memory) {
        require(isStudent(_id));
        return StudentMapping[_id].username;
    }

    function getStudentId(address _id) public view returns (string memory) {
        require(isStudent(_id));
        return StudentMapping[_id].studentId;
    }

    function getCourseCode(uint256 i) public view returns (string memory) {
        return courseList[i].courseCode;
    }

    function getCourseCapacity(uint256 i) public view returns (uint256) {
        return courseList[i].courseCapacity;
    }

    function getCourseStatus(uint256 i) public view returns (bool) {
        return courseList[i].status;
    }
}
