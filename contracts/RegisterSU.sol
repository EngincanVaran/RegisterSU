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
        uint256 index;
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

    struct CourseExchangeRequest {
        uint256 reqId;
        address requesterId;
        address requestedId;
        string courseId;
        string reqCourseId;
        bool status;
    }

    mapping(string => Courses) public courses;
    mapping(uint256 => Courses) public courseList;
    mapping(address => Students) public StudentMapping;
    mapping(address => StudentResources) public StudentResourcesMapping;
    mapping(uint256 => CourseExchangeRequest) public RequestsMapping;
    mapping(address => CourseExchangeRequest[]) public StudentExchangeMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredStudentsMapping;
    mapping(address => bool) public RegisteredStudentResourcesMapping;
    mapping(string => bool) public CourseMapping;

    address[] public students;
    address[] public studentResources;
    CourseExchangeRequest[] public allExchangeList;

    uint256 private coursesCount;
    uint256 private studentResourcesCount;
    uint256 private studentsCount;
    uint256 private requestsCount;

    event Registration(address _registrationId);
    event AddingCourse(string _courseCode);
    event CourseStatusChanged(string _courseCode, bool _status);
    event Enrolled(string _courseCode, bool _isEnrolled);
    event TradeResult(bool _result);

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
            sCourses,
            coursesCount
        );
        courses[courseCode] = Courses(
            courseCode,
            false,
            maxStudentCount,
            0,
            sCourses,
            coursesCount
        );
        coursesCount++;

        emit AddingCourse(courseCode);
    }

    function changeCourseStatus(uint256 status, string memory courseCode)
        public
    {
        require(
            isStudentResources(msg.sender),
            "You are not the student resources!"
        );
        require(
            isCourseAddedBefore(courseCode),
            "This course hasn't been added to the course list yet."
        );
        bool courseStatus = false;
        if (status == 1) {
            courseStatus = true;
        }
        courses[courseCode].status = courseStatus;
        courseList[courses[courseCode].index].status = courseStatus;
        emit CourseStatusChanged(courseCode, courseStatus);
    }

    function registerToCourse(string memory _courseCode) public {
        // check whether the student already registered or not!
        require(isStudent(msg.sender), "You are not a student!");
        require(isCourseAddedBefore(_courseCode), "There is no such course!");
        require(courses[_courseCode].status, "Course is not open");
        require(
            courses[_courseCode].courseCapacity <
                courses[_courseCode].courseMaxCapacity,
            "Course capacity is full!"
        );
        bool isEnrolled = true;

        for (
            uint256 i = 0;
            i < StudentMapping[msg.sender].courses.length;
            i++
        ) {
            if (
                keccak256(bytes(StudentMapping[msg.sender].courses[i])) ==
                keccak256(bytes(_courseCode))
            ) {
                isEnrolled = false;
            }
        }
        if (isEnrolled) {
            StudentMapping[msg.sender].courses.push(_courseCode);
            courses[_courseCode].courseCapacity += 1;
            courseList[courses[_courseCode].index].courseCapacity += 1;
        }
        emit Enrolled(_courseCode, isEnrolled);
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

    function getCourseMaxCapacity(uint256 i) public view returns (uint256) {
        return courseList[i].courseMaxCapacity;
    }

    function getStudentCourses(address _address)
        public
        view
        returns (string[] memory)
    {
        return StudentMapping[_address].courses;
    }

    function exchangeCourse(
        address _id,
        string memory courseId,
        string memory reqCourseId
    ) public returns (bool) {
        // check whether the student already registered or not!
        require(isStudent(msg.sender), "You are not a student!");
        require(isStudent(_id), "There is not a student at this address!");
        require(msg.sender != _id, "You can't exchange courses with yourself!");

        requestsCount++;
        RequestsMapping[requestsCount] = CourseExchangeRequest(
            requestsCount,
            msg.sender,
            _id,
            courseId,
            reqCourseId,
            false
        );

        allExchangeList.push(RequestsMapping[requestsCount]);

        uint256 temp = 0;
        if (StudentExchangeMapping[msg.sender].length == 0) {
            temp = 0;
            StudentExchangeMapping[msg.sender].push(
                RequestsMapping[requestsCount]
            );
        } else {
            bool isRequested = true;
            for (
                uint256 i = 0;
                i < StudentExchangeMapping[msg.sender].length;
                i++
            ) {
                if (
                    StudentExchangeMapping[msg.sender][i].requestedId == _id &&
                    keccak256(
                        bytes(StudentExchangeMapping[msg.sender][i].courseId)
                    ) ==
                    keccak256(bytes(courseId)) &&
                    keccak256(
                        bytes(StudentExchangeMapping[msg.sender][i].reqCourseId)
                    ) ==
                    keccak256(bytes(reqCourseId)) &&
                    StudentExchangeMapping[msg.sender][i].status == false
                ) {
                    isRequested = false;
                    temp = i;
                    break;
                }
            }
            if (isRequested) {
                StudentExchangeMapping[msg.sender].push(
                    RequestsMapping[requestsCount]
                );
                temp = StudentExchangeMapping[msg.sender].length - 1;
            }
        }

        bool isTraded = false;
        for (uint256 i = 0; i < StudentExchangeMapping[_id].length; i++) {
            if (
                StudentExchangeMapping[_id][i].requestedId == msg.sender &&
                keccak256(bytes(StudentExchangeMapping[_id][i].reqCourseId)) ==
                keccak256(bytes(courseId)) &&
                keccak256(bytes(StudentExchangeMapping[_id][i].courseId)) ==
                keccak256(bytes(reqCourseId)) &&
                StudentExchangeMapping[_id][i].status == false
            ) {
                StudentExchangeMapping[_id][i].status = true;
                StudentExchangeMapping[msg.sender][temp].status = true;
                isTraded = true;
                break;
            }
        }
        emit TradeResult(isTraded);
        return isTraded;
    }
}
