// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../registrar/StringUtils.sol";
import "./IAffiliateProgram.sol";

contract AffiliateProgram is
    ContextUpgradeable,
    ERC721Upgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721PausableUpgradeable,
    IAffiliateProgram
{
    using StringUtils for string;
    using SafeMathUpgradeable for uint256;

    // STRUCTS
    struct Profile {
        bool accepted; // Is the enrollment accepted
        bool rejected; // Is the enrollment rejected
        address owner;
        uint256 pledged; // The amount of pledged $EDNS
        uint256 level; // Level in seconds
        uint256 reward; // The reward hasen't claim
    }

    // struct PledgeMultiplier {
    //     bool allow;
    //     uint256 factor; // It should be a percentage, since solidity does not support floating point
    // }

    // struct LevelMultiplierTier {
    //     uint256 lower; // Should be in year, not seconds
    //     uint256 upper; // Should be in year, not seconds
    //     uint256 factor; // It should be a percentage in integer format 25% => 25
    // }

    // struct LevelMultiplier {
    //     bool allow;
    //     LevelMultiplierTier[] tiers;
    // }

    /* ========== STATE VARIABLES  ========== */
    // IERC20 public token;
    // EDNSRegistrarController public controller;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // uint256 private _totalPledged;
    // uint256 public minimumPledge;
    // uint256 public maximumPledge;

    // bool private _allowRewarding;
    // bool public allowPledge;
    // bool public allowWithdraw;
    // bool public allowClaim;
    // bool public allowAutoPayout;
    // bool public allowAutoEnroll;
    // bool public allowMultiplier;

    // PledgeMultiplier private _pledgeMultiplier;
    // LevelMultiplier private _levelMultiplier;

    mapping(bytes32 => Profile) private _profiles;

    // uint256 private _rewardPerYear;

    /* ========== INITIALIZER  ========== */
    function initialize() public initializer {
        __AffiliateProgram_init();
    }

    function __AffiliateProgram_init() internal onlyInitializing {
        __ERC721_init_unchained("EDNS Affiliate Program", "EDNSAP");
        __AffiliateProgram_init_unchained();
    }

    function __AffiliateProgram_init_unchained() internal onlyInitializing {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(OPERATOR_ROLE, _msgSender());

        // controller = _controller;

        // minimumPledge = 0;
        // maximumPledge = 0;

        // _allowRewarding = false;
        // allowPledge = false;
        // allowWithdraw = false;
        // allowClaim = false;
        // allowAutoPayout = false;
        // allowAutoEnroll = false;
        // allowMultiplier = false;

        //     _rewardPerYear = 0; // How many $EDNS will deliver to the profile per domain years purchased

        //     _pledgeMultiplier = PledgeMultiplier({allow: false, factor: 0});
        //     _levelMultiplier = LevelMultiplier({
        //         allow: false,
        //         tiers: new LevelMultiplierTier[](0)
        //     });
    }

    /* ========== MODIFIER  ========== */

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "403 - Forbidden");
        _;
    }

    modifier onlyAdminOrOperator() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) ||
                hasRole(OPERATOR_ROLE, _msgSender()),
            "403 - Forbidden"
        );
        _;
    }

    // modifier onlyController() {
    //     require(_msgSender() == address(controller), "403 - Forbidden");
    //     _;
    // }

    modifier onlyProfileOwnerOrOperator(bytes32 id) {
        require(
            ownerOf(uint256(id)) == _msgSender() ||
                hasRole(OPERATOR_ROLE, _msgSender()),
            "403 - Forbidden"
        );
        _;
    }

    modifier onlyIdExist(bytes32 id) {
        require(_exists(uint256(id)), "404 - Profile not found");
        _;
    }

    modifier onlyAcceptedProfile(bytes32 id) {
        require(_profiles[id].accepted, "500 - Profile pending approval");
        _;
    }

    /* ========== VIEW FUNCTIONS  ========== */
    function _getLabel(string memory id)
        internal
        pure
        virtual
        returns (bytes32)
    {
        return keccak256(bytes(id));
    }

    // function allowRewarding() public view returns (bool) {
    //     return _allowRewarding;
    // }

    function valid(string memory id) public pure returns (bool) {
        return id.strlen() >= 5 && id.strlen() <= 32;
    }

    function available(string memory _id) public view returns (bool) {
        bytes32 id = _getLabel(_id);
        // if (_profiles[id].accepted == true || _profiles[id].rejected == false)
        //     return false;
        // if (_profiles[id].accepted == false || _profiles[id].rejected == false)
        //     return false;
        // if (_profiles[id].rejected == true) return true;
        return !_exists(uint256(id));
    }

    function earned(bytes32 id)
        public
        view
        onlyIdExist(id)
        returns (
            // onlyProfileOwnerOrOperator(id)
            uint256
        )
    {
        // return _profiles[id].reward.div(365 days).mul(_rewardPerYear);
        return _profiles[id].reward;
    }

    // function pledged(bytes32 id)
    //     public
    //     view
    //     onlyIdExist(id)
    //     onlyProfileOwnerOrOperator(id)
    //     returns (uint256)
    // {
    //     return _profiles[id].pledged;
    // }

    function level(bytes32 id)
        public
        view
        onlyIdExist(id)
        onlyProfileOwnerOrOperator(id)
        returns (uint256)
    {
        return _profiles[id].level;
    }

    // Input the base reward, then output the aggregated reward. (base + pledged bonus + level bonus)
    // function _multiplier(bytes32 id, uint256 base)
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     uint256 _reward = base;
    //     if (allowMultiplier) {
    //         if (_pledgeMultiplier.allow) {
    //             // Because factor is an percentage but in integer format, so it must be divide by 100 at the end
    //             // _reward = (profile_pledged / maximum_pledge) * factor * _reward / 100 + _reward
    //             uint256 _pledgeBonus = _reward
    //                 .mul(
    //                     _profiles[id].pledged.div(maximumPledge).mul(
    //                         _pledgeMultiplier.factor
    //                     )
    //                 )
    //                 .div(100);
    //             _reward = _reward.add(_pledgeBonus);
    //         }
    //         if (_levelMultiplier.allow) {
    //             for (uint256 i = 0; i < _levelMultiplier.tiers.length; i++) {
    //                 if (
    //                     _profiles[id].level.div(365 days) <=
    //                     _levelMultiplier.tiers[i].upper &&
    //                     _profiles[id].level.div(365 days) >=
    //                     _levelMultiplier.tiers[i].lower
    //                 ) {
    //                     // Because factor is an percentage but in integer format, so it must be divide by 100 at the end
    //                     // _reward = (factor * _reward) / 100 + _reward
    //                     uint256 _levelBonus = _reward
    //                         .mul(_levelMultiplier.tiers[i].factor)
    //                         .div(100);
    //                     _reward = _reward.add(_levelBonus);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     return _reward;
    // }

    // function allowPledgeMultiplier() public view returns (bool) {
    //     return _pledgeMultiplier.allow;
    // }

    // function pledgeMultiplierFactor() public view returns (uint256) {
    //     return _pledgeMultiplier.factor;
    // }

    // function allowLevelMultiplier() public view returns (bool) {
    //     return _levelMultiplier.allow;
    // }

    // function numberOfLevelMultiplierTiers() public view returns (uint256) {
    //     return _levelMultiplier.tiers.length;
    // }

    // function levelMultiplierTier(uint256 index) public view returns (bytes32) {
    //     require(
    //         index < numberOfLevelMultiplierTiers(),
    //         "500 - Index out of range"
    //     );
    //     // upper:lower:factor
    //     return
    //         bytes32(
    //             abi.encodePacked(
    //                 _levelMultiplier.tiers[index].upper,
    //                 ":",
    //                 _levelMultiplier.tiers[index].lower,
    //                 ":",
    //                 _levelMultiplier.tiers[index].factor
    //             )
    //         );
    // }

    // function rewardPerYear() public view returns (uint256) {
    //     return _rewardPerYear;
    // }

    // function totalPledged() public view returns (uint256) {
    //     return _totalPledged;
    // }

    /* ========== MUTATIVE FUNCTIONS  ========== */

    function enroll(string memory _id, address registrant)
        public
        whenNotPaused
        onlyAdminOrOperator
    {
        require(available(_id), "500 - ID not available");
        bytes32 id = _getLabel(_id);
        _profiles[id] = Profile({
            accepted: true,
            rejected: false,
            owner: registrant,
            pledged: 0,
            level: 0,
            reward: 0
        });
        _safeMint(_profiles[id].owner, uint256(id));
        emit EnrollmentRequest(registrant, id);
        // if (allowAutoEnroll) {
        //     _profiles[id].accepted = true;
        //     emit EnrollmentAccepted(ownerOf(uint256(id)), id);
        // }
    }

    // function quit(bytes32 id)
    //     public
    //     nonReentrant
    //     whenNotPaused
    //     onlyProfileOwnerOrOperator(id)
    //     onlyIdExist(id)
    //     onlyAcceptedProfile(id)
    // {
    //     if (_profiles[id].pledged > 0) {
    //         _withdraw(id, _profiles[id].pledged);
    //     }
    //     _burn(uint256(id));
    //     delete _profiles[id];
    //     emit Quit(_msgSender(), id);
    // }

    // function accept(bytes32 id) public onlyAdminOrOperator onlyIdExist(id) {
    //     require(
    //         _profiles[id].rejected != true,
    //         "500 - Profile has been rejected"
    //     );
    //     _profiles[id].accepted = true;
    //     _safeMint(_profiles[id].owner, uint256(id));
    //     emit EnrollmentAccepted(ownerOf(uint256(id)), id);
    // }

    // function reject(bytes32 id) public onlyAdminOrOperator onlyIdExist(id) {
    //     _profiles[id].rejected = true;
    //     emit EnrollmentRejected(ownerOf(uint256(id)), id);
    // }

    // function _pledge(bytes32 id, uint256 amount)
    //     internal
    //     virtual
    //     nonReentrant
    //     whenNotPaused
    //     onlyIdExist(id)
    //     onlyAcceptedProfile(id)
    // {
    //     // require(allowPledge, "403 - Withdraw is not allow");
    //     require(amount > 0, "500 - Cannot pledge 0 $EDNS");
    //     require(
    //         _profiles[id].pledged.add(amount) <= maximumPledge,
    //         "500 - Exceed pledged limit"
    //     );
    //     require(
    //         token.allowance(ownerOf(uint256(id)), address(this)) >= amount,
    //         "500 - Insuffient allowance"
    //     );
    //     token.safeTransferFrom(_msgSender(), address(this), amount);
    //     _totalPledged = _totalPledged.add(amount);
    //     _profiles[id].pledged = _profiles[id].pledged.add(amount);
    //     emit Pledged(_msgSender(), id, amount);
    // }

    // function pledge(bytes32 id, uint256 amount) public {
    //     _pledge(id, amount);
    // }

    // function _withdraw(bytes32 id, uint256 amount)
    //     internal
    //     virtual
    //     nonReentrant
    //     whenNotPaused
    //     onlyIdExist(id)
    //     onlyAcceptedProfile(id)
    // {
    //     // require(allowWithdraw, "403 - Withdraw is not allow");
    //     require(amount > 0, "500 - Cannot withdraw 0 $EDNS");
    //     require(_profiles[id].pledged > amount, "500 - Insuffient balance");
    //     token.safeTransfer(ownerOf(uint256(id)), amount);
    //     _totalPledged = _totalPledged.sub(amount);
    //     _profiles[id].pledged = _profiles[id].pledged.sub(amount);
    //     emit Withdrawn(_msgSender(), id, amount);
    // }

    // function withdraw(bytes32 id, uint256 amount)
    //     public
    //     onlyProfileOwnerOrOperator(id)
    // {
    //     _withdraw(id, amount);
    // }

    // function _claim(bytes32 id)
    //     internal
    //     virtual
    //     whenNotPaused
    //     onlyIdExist(id)
    //     onlyAcceptedProfile(id)
    // {
    //     // require(allowClaim, "500 - Claim is not allow");
    //     _payout(id);
    // }

    // function claim(bytes32 id) public onlyProfileOwnerOrOperator(id) {
    //     _claim(id);
    // }

    function _issue(
        address buyer,
        bytes32 fqdn,
        uint256 total,
        bytes32 id
    ) internal virtual onlyIdExist(id) onlyAcceptedProfile(id) {
        // require(_allowRewarding, "500 - Rewarding is not allow");
        require(total > 0, "500 - Cannot issue 0 reward");
        _profiles[id].reward = _profiles[id].reward.add(total);
        _profiles[id].level = _profiles[id].level.add(total);
        emit IssuedReward(buyer, fqdn, total, ownerOf(uint256(id)), id);
        // if (_profiles[id].pledged >= minimumPledge) {
        //     _profiles[id].reward = _profiles[id].reward.add(total);
        //     emit IssuedReward(buyer, fqdn, total, ownerOf(uint256(id)), id);
        // if (allowAutoPayout) {
        //     _payout(id);
        // }
    }

    function issue(
        address buyer,
        bytes32 fqdn,
        uint256 total,
        bytes32 id
    ) external onlyAdminOrOperator {
        _issue(buyer, fqdn, total, id);
    }

    function _payout(bytes32 id, bytes32 ref)
        internal
        virtual
        whenNotPaused
        onlyIdExist(id)
        onlyAcceptedProfile(id)
    {
        emit Payout(id, _profiles[id].reward, ref);
        _profiles[id].reward = 0;
        // require(_profiles[id].reward >= 365 days, "500 - Threshold not reach");
        // uint256 _reward = _profiles[id].reward.div(365 days).mul(
        //     _rewardPerYear
        // );
        // if (allowMultiplier) {
        //     _reward = _multiplier(id, _reward);
        // }
        // token.transfer(ownerOf(uint256(id)), _reward);
    }

    function payout(bytes32 id, bytes32 ref) public onlyAdminOrOperator {
        _payout(id, ref);
    }

    function batchPayout(bytes32[] memory ids, bytes32[] memory refs)
        public
        whenNotPaused
        onlyAdminOrOperator
    {
        require(ids.length == refs.length);
        for (uint256 i = 0; i < ids.length; i++) {
            payout(ids[i], refs[i]);
        }
    }

    // function setRewardPerYear(uint256 amount) public onlyAdminOrOperator {
    //     _rewardPerYear = amount;
    // }

    // function setMinimumPledge(uint256 value) public onlyAdminOrOperator {
    //     minimumPledge = value;
    // }

    // function setMaximumPledge(uint256 value) public onlyAdminOrOperator {
    //     minimumPledge = value;
    // }

    // function setAllowRewarding(bool allow) public onlyAdminOrOperator {
    //     _allowRewarding = allow;
    // }

    // function setAllowPledge(bool allow) public onlyAdminOrOperator{
    //     allowPledge = allow;
    // }

    // function setAllowWithdraw(bool allow) public onlyAdminOrOperator{
    //     allowWithdraw = allow;
    // }

    // function setAllowClaim(bool allow) public onlyAdminOrOperator{
    //     allowClaim = allow;
    // }

    // function setAllowAutoPayout(bool allow) public onlyAdminOrOperator {
    //     allowAutoPayout = allow;
    // }

    // function setAllowAutoEnroll(bool allow) public onlyAdminOrOperator {
    //     allowAutoEnroll = allow;
    // }

    // function setAllowMultiplier(bool allow) public onlyAdminOrOperator {
    //     allowMultiplier = allow;
    // }

    // function setAllowPledgeMultiplier(bool allow) public onlyAdminOrOperator {
    //     _pledgeMultiplier.allow = allow;
    // }

    // function setPledgeMultiplierFactor(uint256 factor)
    //     public
    //     onlyAdminOrOperator
    // {
    //     _pledgeMultiplier.factor = factor;
    // }

    // function setAllowLevelMultiplier(bool allow) public onlyAdminOrOperator {
    //     _levelMultiplier.allow = allow;
    // }

    // function setLevelMultiplierTier(
    //     uint256 index,
    //     uint256 factor,
    //     uint256 upper,
    //     uint256 lower
    // ) public onlyAdminOrOperator {
    //     _levelMultiplier.tiers[index] = LevelMultiplierTier({
    //         upper: upper,
    //         lower: lower,
    //         factor: factor
    //     });
    // }

    function setPause(bool pause) public onlyAdminOrOperator {
        if (pause) {
            _pause();
        } else {
            _unpause();
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Upgradeable) {
        super._transfer(from, to, tokenId);
        _profiles[bytes32(tokenId)].owner = to;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721PausableUpgradeable, ERC721Upgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlEnumerableUpgradeable, ERC721Upgradeable)
        returns (bool)
    {
        return
            type(IAffiliateProgram).interfaceId == interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
