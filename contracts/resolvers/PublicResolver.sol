// SPDX-Licednse-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../registry/EDNS.sol";
import "./profiles/ABIResolver.sol";
import "./profiles/AddrResolver.sol";
import "./profiles/ContentHashResolver.sol";
import "./profiles/DNSResolver.sol";
import "./profiles/InterfaceResolver.sol";
import "./profiles/NameResolver.sol";
import "./profiles/PubkeyResolver.sol";
import "./profiles/TextResolver.sol";
import "./profiles/NFTResolver.sol";
import "./Multicallable.sol";

interface INameWrapper {
    function ownerOf(uint256 id) external view returns (address);
}

/**
 * A simple resolver anyone can use; only allows the owner of a node to set its
 * address.
 */
contract PublicResolver is
    Multicallable,
    ABIResolver,
    AddrResolver,
    ContentHashResolver,
    DNSResolver,
    InterfaceResolver,
    NameResolver,
    PubkeyResolver,
    TextResolver,
    NFTResolver,
    Initializable
{
    EDNS edns;
    INameWrapper nameWrapper;

    /**
     * A mapping of operators. An address that is authorised for an address
     * may make any changes to the name that the owner could, but may not update
     * the set of authorisations.
     * (owner, operator) => approved
     */
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Logged when an operator is added or removed.
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    // constructor(EDNS _edns, INameWrapper wrapperAddress){
    //     edns = _edns;
    //     nameWrapper = wrapperAddress;
    // }

    function initialize(EDNS _edns) public initializer {
        __PublicResolver_init(_edns);
    }

    function __PublicResolver_init(EDNS _edns) internal onlyInitializing {
        __PublicResolver_init_unchained(_edns);
    }

    function __PublicResolver_init_unchained(EDNS _edns)
        internal
        onlyInitializing
    {
        edns = _edns;
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(
            msg.sender != operator,
            "ERC1155: setting approval status for self"
        );

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isAuthorised(bytes32 node) public view override returns (bool) {
        address owner = edns.owner(node);
        return owner == msg.sender || isApprovedForAll(owner, msg.sender);
    }

    // function setEDNSRegistry(EDNS _edns) private {
    //     edns = _edns;
    // }

    /**
     * @dev See {IERC1155-isApprovedForAll}.
     */
    function isApprovedForAll(address account, address operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[account][operator];
    }

    function supportsInterface(bytes4 interfaceID)
        public
        pure
        override(
            Multicallable,
            ABIResolver,
            AddrResolver,
            ContentHashResolver,
            DNSResolver,
            InterfaceResolver,
            NameResolver,
            PubkeyResolver,
            TextResolver,
            NFTResolver
        )
        returns (bool)
    {
        return
            interfaceID == type(IMulticallable).interfaceId ||
            super.supportsInterface(interfaceID);
    }
}
