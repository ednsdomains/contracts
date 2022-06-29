// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IAffiliateProgram {
    // EVENTS
    event EnrollmentRequest(address indexed enroller, bytes32 indexed id);
    // event EnrollmentAccepted(address indexed enroller, bytes32 indexed id);
    // event EnrollmentRejected(address indexed enroller, bytes32 indexed id);
    // event Quit(address indexed owner, bytes32 indexed id);
    // event Pledged(address indexed from, bytes32 indexed id, uint256 amount);
    // event Withdrawn(address indexed to, bytes32 indexed id, uint256 amount);
    event IssuedReward(
        address indexed buyer,
        bytes32 fqdn,
        uint256 total,
        address indexed rewarder,
        bytes32 indexed id
    );
    event Payout(bytes32 id, uint256 amount, bytes32 ref);

    // VIEWS
    // function _getLabel(string memory id) external pure returns(bytes32);
    // function allowRewarding() external returns (bool);

    function valid(string memory id) external returns (bool);

    function available(string memory id) external view returns (bool);

    function earned(bytes32 id) external view returns (uint256);

    // function pledged(bytes32 id) external view returns (uint256);

    function level(bytes32 id) external view returns (uint256);

    // function _multiplier(bytes32 id, uint256 base) external view returns(uint256);
    // function allowPledgeMultiplier() external view returns (bool);

    // function pledgeMultiplierFactor() external view returns (uint256);

    // function allowLevelMultiplier() external view returns (bool);

    // function numberOfLevelMultiplierTiers() external view returns (uint256);

    // function levelMultiplierTier(uint256 index) external view returns (bytes32);

    // function rewardPerYear() external view returns (uint256);

    // function totalPledged() external view returns (uint256);

    // FUNCTIONS
    function enroll(string memory id, address registrant) external;

    // function quit(bytes32 id) external;

    // function accept(bytes32 id) external;

    // function reject(bytes32 id) external;

    // function _pledge(bytes32 id, uint256 amount) external;
    // function pledge(bytes32 id, uint256 amount) external;

    // function _withdraw(bytes32 id, uint256 amount) external;
    // function withdraw(bytes32 id, uint256 amount) external;

    // function _claim(bytes32 id) external;
    // function claim(bytes32 id) external;

    // function _issue(address buyer, bytes32 fqdn,  uint256 duration, bytes32 id) external;
    function issue(
        address buyer,
        bytes32 fqdn,
        uint256 duration,
        bytes32 id
    ) external;

    // function _payout(bytes32 id) external;
    function payout(bytes32 id, bytes32 ref) external;

    function batchPayout(bytes32[] memory ids, bytes32[] memory refs) external;

    // function setRewardPerYear(uint256 amount) external;

    // function setMinimumPledge(uint256 value) external;

    // function setMaximumPledge(uint256 value) external;

    // function setAllowRewarding(bool allow) external;

    // function setAllowPledge(bool allow) external;
    // function setAllowWithdraw(bool allow) external;
    // function setAllowClaim(bool allow) external;
    // function setAllowAutoPayout(bool allow) external;

    // function setAllowAutoEnroll(bool allow) external;

    // function setAllowMultiplier(bool allow) external;

    // function setAllowPledgeMultiplier(bool allow) external;

    // function setPledgeMultiplierFactor(uint256 factor) external;

    // function setAllowLevelMultiplier(bool allow) external;

    // function setLevelMultiplierTier(
    //     uint256 index,
    //     uint256 factor,
    //     uint256 upper,
    //     uint256 lower
    // ) external;

    function setPause(bool allow) external;
}
