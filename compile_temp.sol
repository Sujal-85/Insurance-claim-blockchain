// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract InsuranceClaimSystem {

    address public insurer;

    constructor() {
        insurer = msg.sender;
    }

    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer allowed");
        _;
    }

    struct Policy {
        uint policyId;
        address holder;
        uint premium;
        uint coverage;
        bool active;
    }

    struct Claim {
        uint claimId;
        uint policyId;
        address claimant;
        string reason;
        bool approved;
        bool processed;
    }

    uint public policyCount;
    uint public claimCount;

    mapping(uint => Policy) public policies;
    mapping(uint => Claim) public claims;

    // EVENTS
    event PolicyCreated(uint policyId, address holder);
    event ClaimSubmitted(uint claimId, uint policyId);
    event ClaimApproved(uint claimId);
    event ClaimRejected(uint claimId);

    // CREATE POLICY
    function createPolicy(uint _premium, uint _coverage) public {
        policyCount++;

        policies[policyCount] = Policy(
            policyCount,
            msg.sender,
            _premium,
            _coverage,
            true
        );

        emit PolicyCreated(policyCount, msg.sender);
    }

    // SUBMIT CLAIM
    function submitClaim(uint _policyId, string memory _reason) public {
        require(policies[_policyId].holder == msg.sender, "Not policy holder");
        require(policies[_policyId].active == true, "Policy inactive");

        claimCount++;

        claims[claimCount] = Claim(
            claimCount,
            _policyId,
            msg.sender,
            _reason,
            false,
            false
        );

        emit ClaimSubmitted(claimCount, _policyId);
    }

    // APPROVE CLAIM
    function approveClaim(uint _claimId) public onlyInsurer {
        require(!claims[_claimId].processed, "Already processed");

        claims[_claimId].approved = true;
        claims[_claimId].processed = true;

        emit ClaimApproved(_claimId);
    }

    // REJECT CLAIM
    function rejectClaim(uint _claimId) public onlyInsurer {
        require(!claims[_claimId].processed, "Already processed");

        claims[_claimId].approved = false;
        claims[_claimId].processed = true;

        emit ClaimRejected(_claimId);
    }

    // GET POLICY
    function getPolicy(uint _policyId) public view returns (Policy memory) {
        return policies[_policyId];
    }

    // GET CLAIM
    function getClaim(uint _claimId) public view returns (Claim memory) {
        return claims[_claimId];
    }
}
