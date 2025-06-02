require("dotenv").config();
const { ethers } = require("ethers");

const identityToClaim = process.env.IDENTITY_800A;
const topicClaimType = 1;
const data = ethers.utils.toUtf8Bytes("Verified");

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

const issuerIdentityContractAddress = process.env.IDENTITY_9834;

async function main() {
    const hash = ethers.utils.keccak256(
        ethers.utils.solidityPack(
            ["address", "uint256", "bytes"],
            [identityToClaim, topicClaimType, data]
        )
    );

    const ethSignedHash = ethers.utils.hashMessage(ethers.utils.arrayify(hash)); // préfixé

    const signature = await wallet.signMessage(ethers.utils.arrayify(hash)); // préfixé automatiquement

    const recovered = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature);
    const key = ethers.utils.keccak256(ethers.utils.zeroPad(recovered, 32));

    // === LOGS ===
    console.log("✅ Signature :", signature);
    console.log("📦 Data (hex) :", ethers.utils.hexlify(data));
    console.log("🏢 Issuer Identity contract :", issuerIdentityContractAddress);
    console.log("👤 Subject Identity :", identityToClaim);
    console.log("🔒 Claim type :", topicClaimType);
    console.log("✍️ Signer address (from signature):", recovered);
    console.log("🧩 Hash used (before signature):", hash);
    console.log("🔁 Eth Signed Hash (with prefix):", ethSignedHash);
    console.log("🗝️ Key (bytes32) to check in getKey():", key);
}

main().catch(console.error);
