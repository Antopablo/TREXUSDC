// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IIdentity {
    function keyHasPurpose(bytes32 key, uint256 purpose) external view returns (bool);
}

contract ClaimValidatorDebug {
    using ECDSA for bytes32;

    address public identityContract;

    constructor(address _identityContract) {
        identityContract = _identityContract;
    }

    function debugIsClaimValid(
        address identity,
        uint256 topic,
        bytes memory signature,
        bytes memory data
    ) public view returns (
        bytes32 hash,
        bytes32 ethSignedHash,
        address recovered,
        bytes32 key,
        bool hasPurpose
    ) {
        // Étapes de calculs comme dans isClaimValid
        hash = keccak256(abi.encodePacked(identity, topic, data));
        ethSignedHash = hash.toEthSignedMessageHash();
        recovered = ethSignedHash.recover(signature);
        key = keccak256(abi.encodePacked(recovered));
        hasPurpose = IIdentity(identityContract).keyHasPurpose(key, 3);

        return (hash, ethSignedHash, recovered, key, hasPurpose);
    }
}
