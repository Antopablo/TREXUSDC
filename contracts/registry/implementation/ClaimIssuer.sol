// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

interface IIdentity {
    function keyHasPurpose(bytes32 _key, uint256 _purpose) external view returns (bool);
}

contract ClaimIssuer {
    using ECDSA for bytes32;

    address public identityContract;

    constructor(address _identityContract) {
        identityContract = _identityContract;
    }

    function isClaimValid(
        address identity,
        uint256 topic,
        bytes memory signature,
        bytes memory data
    ) public view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(identity, topic, data));
        address recovered = hash.toEthSignedMessageHash().recover(signature);
        bytes32 key = keccak256(abi.encodePacked(recovered));

        return IIdentity(identityContract).keyHasPurpose(key, 3);
    }
}
