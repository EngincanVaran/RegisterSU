// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract StudentResources {
    address public _sr;

    constructor() internal {
        _sr = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlySR() {
        require(isSR(), "You are not the SR.");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isSR() public view returns (bool) {
        return (msg.sender == _sr);
    }
}
