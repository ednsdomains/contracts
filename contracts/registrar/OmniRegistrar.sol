pragma solidity ^0.8.9;

import "./BaseRegistrar.sol";
import "../utils/Synchronizer.sol";

contract OmniRegistrar is BaseRegistrar,Synchronizer {
    function initialize(IRegistry registry_, address _endpoint)  public initializer {
        __Registrar_init_unchained(registry_);
        __ERC721_init("Omni Name Service", "OMNS");
        __AccessControl_init();
        __NonBlockingLayerZeroApp_init(_endpoint);
    }


    function exists(bytes32 tld)  public view override(BaseRegistrar,Synchronizer) returns (bool) {
        return _registry.exists(tld);
    }
    function register(
        bytes calldata domain,
        bytes calldata tld,
        address owner,
        uint256 duration
    )   public onlyController(keccak256(tld)) {
        _register(domain,tld,owner,duration);
        _sync(abi.encode("_register(bytes,bytes,address,uint256)",domain,tld,owner,duration));
    }

    function renew(
        bytes calldata domain,
        bytes calldata tld,
        uint256 duration
    )  public  onlyController(keccak256(bytes(tld))) {
        _renew(domain,tld,duration);
        _sync(abi.encode("renew(bytes,bytes,uint256)",domain,tld,duration));
    }

    function reclaim(
        bytes calldata domain,
        bytes calldata tld,
        address owner
    )  public  onlyController(keccak256(bytes(tld))) {
        _reclaim(domain,tld,owner);
        _sync(abi.encode("reclaim(bytes,bytes,address)",domain,tld,owner));
    }

}
