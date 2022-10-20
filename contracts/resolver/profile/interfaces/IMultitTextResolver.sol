// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMultiTextResolver {
    event SetMultiText(bytes host, bytes name, bytes tld, string type_, string text);

    function setMultiText(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_,
        string memory text
    ) external;

    function setMultiText_SYNC(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_,
        string memory text
    ) external;

    function getMultiText(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_
    ) external view returns (string memory);
}
