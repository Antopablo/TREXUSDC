require("dotenv").config();
const { ethers } = require("ethers");

// === PARAMÈTRES ===

const identityToClaim = process.env.IDENTITY_800A;

// Claim type : 1 = KYC
const topicClaimType = 1;

const data = ethers.utils.toUtf8Bytes("Finally");

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

const issuerIdentityContractAddress = process.env.IDENTITY_9834;

async function main() {
    const abiEncoded = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes"],
        [identityToClaim, topicClaimType, data]
    );

    const hash = ethers.utils.keccak256(abiEncoded);

    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

    const signerAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature)


    console.log("✅ Signature :", signature);
    console.log("📦 Data (hex) :", ethers.utils.hexlify(data));
    console.log("🏢 Issuer Identity contract :", issuerIdentityContractAddress);
    console.log("👤 Subject Identity :", identityToClaim);
    console.log("🔒 Claim type :", topicClaimType);
    console.log("✍️ Signer is:", signerAddress)
    console.log("Hash used:", hash)

    console.log("Hash to sign:", hash);
    console.log("Signature:", signature);

    const recovered = ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature);
    console.log("Recovered signer address:", recovered);

    // Pour obtenir la clé à comparer avec keyHasPurpose
    const key = ethers.utils.keccak256(ethers.utils.zeroPad(recovered, 32));
    console.log("Key (bytes32) to check:", key);

}

main().catch(console.error);

