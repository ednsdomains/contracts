pragma solidity ^0.8.9;
import "./BaseRegistrar.sol";


contract SingletonRegistrar is BaseRegistrar{

    function initialize(IRegistry registry_)  public initializer {
        __Registrar_init_unchained(registry_);
        __ERC721_init("Omni Name Service", "OMNS");
        __AccessControl_init();
    }
    function register(
        bytes calldata domain,
        bytes calldata tld,
        address owner,
        uint256 duration
    )   external  onlyController(keccak256(tld)) {
        _register(domain,tld,owner,duration);
    }

    function renew(
        bytes calldata domain,
        bytes calldata tld,
        uint256 duration
    )  external onlyController(keccak256(bytes(tld))) {
        _renew(domain,tld,duration);
    }

    function reclaim(
        bytes calldata domain,
        bytes calldata tld,
        address owner
    )  external onlyController(keccak256(bytes(tld))) {
        _reclaim(domain,tld,owner);
    }
}
