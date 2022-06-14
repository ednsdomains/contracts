pragma solidity ^0.8.9;

import "./BasieRegistrar.sol";
import "../utils/Synchronizer.sol";

contract OmniRegistrar is BasieRegistrar,Synchronizer {
    function initialize(IRegistry registry_, address _endpoint)  public initializer {
        __Registrar_init(registry_);
        __NonBlockingLayerZeroApp_init(_endpoint);
    }


    function exists(bytes32 tld)  public view override(BasieRegistrar,Synchronizer) returns (bool) {
        return _registry.exists(tld);
    }
    function register(
        bytes calldata domain,
        bytes calldata tld,
        address owner,
        uint256 duration
    )   public override onlyController(keccak256(tld)) {
        super.register(domain,tld,owner,duration);
        _sync(abi.encode("regisiter(bytes,bytes,address,uint256)",domain,tld,owner,duration));
    }

    function renew(
        bytes calldata domain,
        bytes calldata tld,
        uint256 duration
    )  public override(BasieRegistrar) onlyController(keccak256(bytes(tld))) {
        super.renew(domain,tld,duration);
        _sync(abi.encode("renew(bytes,bytes,uint256)",domain,tld,duration));
    }

    function reclaim(
        bytes calldata domain,
        bytes calldata tld,
        address owner
    )  public override(BasieRegistrar) onlyController(keccak256(bytes(tld))) {
        super.reclaim(domain,tld,owner);
        _sync(abi.encode("reclaim(bytes,bytes,address)",domain,tld,owner));
    }

}
