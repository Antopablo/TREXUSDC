import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();


const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY;

// Adresse Identity à qui on ajoute le claim (wallet user)
const identityAddress = process.env.IDENTITY_800A;

// Topic du claim (ex: 1 pour KYC)
const claimTopic = 1;

// Données du claim (ex: "Finally" en bytes)
const claimDataString = "Finally";
const claimData = ethers.utils.toUtf8Bytes(claimDataString);

async function main() {
    // Setup wallet admin signer
    const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY);

    // Calcul du hash keccak256(abi.encodePacked(identity, topic, data))
    const encodedPacked = ethers.utils.solidityPack(
        ["address", "uint256", "bytes"],
        [identityAddress, claimTopic, claimData]
    );

    const hash = ethers.utils.keccak256(encodedPacked);

    // Eth Signed Message hash
    const ethSignedHash = ethers.utils.hashMessage(ethers.utils.arrayify(hash));

    // Signature du hash
    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

    // Récupération de l'adresse du signer
    const recovered = ethers.utils.recoverAddress(ethSignedHash, signature);

    // Calcul de la clé (keccak256 abi.encodePacked recovered)
    const recoveredKey = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(["address"], [recovered])
    );

    const recoveredAddress = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(ethers.utils.arrayify(hash)),
        signature
    );

    console.log("Recovered:", recoveredAddress);

    console.log("Admin address:", wallet.address);
    console.log("Identity (user):", identityAddress);
    console.log("Claim topic:", claimTopic);
    console.log("Claim data:", claimData);
    console.log("Hash to sign (packed):", hash);
    console.log("Eth Signed Hash:", ethSignedHash);
    console.log("Signature:", signature);
    console.log("Recovered signer address:", recovered);
    console.log("Key to check in Identity contract:", recoveredKey);

    const issuerAddress = "0x521cfd57c76c1950fc2ee526b77dff86f88c423e"
    const claimId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [issuerAddress, claimTopic])
    );
    console.log("🧾 Claim ID:", claimId);
}

main().catch(console.error);
