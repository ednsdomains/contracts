//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/ITokenPriceOracle.sol";

contract TokenPriceOracleMock is ITokenPriceOracle, Ownable, AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

  bytes32 private jobId;
  uint256 private fee;

  uint256 private _amount;
  //   mapping(uint256 => uint256) private _amounts;
  //   uint256 private _reqTime;

  string private _apiUrl;

  constructor(
    address token,
    address oracle,
    bytes32 jobId_
  ) {
    _setRoleAdmin(CONTROLLER_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
    // setChainlinkToken(token);
    // setChainlinkOracle(oracle);
    jobId = jobId_;
    fee = 10**17; // 0,1 * 10**18 (Varies by network and job)
  }

  function setApiUrl(string memory url) public onlyRole(CONTROLLER_ROLE) {
    _apiUrl = url;
    emit SetApiUrl(url);
  }

  function requestTokenPriceInUsd() external onlyRole(CONTROLLER_ROLE) {
    _amount += 1;
    // if (block.timestamp + 3 minutes > _reqTime) {
    //   Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    //   req.add("get", _apiUrl);
    // {"price": 18007584 }
    // The number should be an integer and mutiplied by it decimals
    //   req.add("path", "price");
    //   sendChainlinkRequest(req, fee);
    // }
  }

  function getTokenPriceInUsd() public view returns (uint256) {
    // return _amounts[_reqTime];
    return _amount;
  }

  function fulfill(bytes32 _requestid, uint256 amount_) public {
    // uint256 timestamp = block.timestamp;
    // _reqTime = timestamp;
    // _amounts[timestamp] = amount_;
    // emit GetTokenPriceInUsd(_requestid, amount_);
  }

  function withdraw() public onlyOwner {
    // LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    // require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(ITokenPriceOracle).interfaceId || super.supportsInterface(interfaceID);
  }
}
