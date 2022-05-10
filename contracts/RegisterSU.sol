pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./StudentResources.sol";

contract RegisterSU is StudentResources {
    enum CourseRegistrationStatus {
        Open,
        Closed
    }

    struct Course {
        RegisterSU.CourseRegistrationStatus _status;
        string _courseCode;
        uint256 _courseMaxCapacity;
        uint256 _courseCapacity;
        address[] _students;
    }

    mapping(uint256 => Course) public courses;
    uint256[] public courseList;
    uint256[] public myCourses;

    function createCourse(
        uint256 _id,
        string memory _courseCode,
        uint256 _courseMaxCapacity
    ) public onlySR {
        courses[_id]._courseCode = _courseCode;
        courses[_id]._courseMaxCapacity = _courseMaxCapacity;

        courses[_id]._courseCapacity = 0;
        courses[_id]._status = CourseRegistrationStatus.Closed;
        courses[_id]._students = new address[](0);

        courseList.push(_id);
    }

    function openCourse(uint256 _courseIndex) public onlySR {
        require(
            courses[_courseIndex]._status != CourseRegistrationStatus.Open,
            "Course is already Open!"
        );

        courses[_courseIndex]._status = CourseRegistrationStatus.Open;
    }

    function closeCourse(uint256 _courseIndex) public onlySR {
        require(
            courses[_courseIndex]._status != CourseRegistrationStatus.Closed,
            "Course is already Closed!"
        );

        courses[_courseIndex]._status = CourseRegistrationStatus.Closed;
    }

    function registerCourse(uint256 _courseIndex) public {
        require(!isSR(), "Student Resources cannot register to a course!");
        require(
            courses[_courseIndex]._status != CourseRegistrationStatus.Closed,
            "Course is Closed!"
        );
        require(
            courses[_courseIndex]._courseCapacity <
                courses[_courseIndex]._courseMaxCapacity,
            "Course is at Max Capacity!"
        );

        courses[_courseIndex]._students.push(msg.sender);
        courses[_courseIndex]._courseCapacity += 1;
    }

    function getCourseStudents(uint256 _courseIndex)
        public
        view
        onlySR
        returns (address[] memory)
    {
        return courses[_courseIndex]._students;
    }

    function setMyCourses() internal {
        for (uint256 i = 0; i < courseList.length; i += 1) {
            for (
                uint256 j = 0;
                j < courses[courseList[i]]._students.length;
                j += 1
            ) {
                if (courses[courseList[i]]._students[j] == msg.sender) {
                    myCourses.push(courseList[i]);
                }
            }
        }
    }

    function getMyCourses() public returns (uint256[] memory) {
        setMyCourses();
        return myCourses;
    }
}
