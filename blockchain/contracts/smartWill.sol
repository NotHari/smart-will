// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract smartWill {
    address payable public owner;
    address payable public beneficiary;
    uint public lastAccess;
    uint public inactivityTime;
    uint public willExpiry;

    constructor() {
        owner = payable(msg.sender);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function setBeneficiary(address payable _beneficiary) public isOwner {
        beneficiary = _beneficiary;
        lastAccess = block.timestamp;
    }

    function setInactivityTime(uint _inactivityTime) public isOwner {
        inactivityTime = _inactivityTime;
        lastAccess = block.timestamp;
    }

    function setWillExpiry(uint _willExpiry) public isOwner {
        willExpiry = _willExpiry;
        lastAccess = block.timestamp;
    }

    function setLastAccess() public isOwner {
        lastAccess = block.timestamp;
    }

    function send() public payable isOwner {
        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}

    fallback() external payable {}

    function transferFunds(
        uint value
    ) public payable isOwnerOrBeneficiary willMaturity {
        if (block.timestamp > willExpiry) {
            owner.transfer(value * 1e18);
        } else {
            beneficiary.transfer(value * 1e18);
        }
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isOwnerOrBeneficiary() {
        require(msg.sender == owner || msg.sender == beneficiary);
        _;
    }

    modifier willMaturity() {
        require(
            block.timestamp - lastAccess >= inactivityTime,
            "Will hasn't matured"
        );
        _;
    }
}
