require("dotenv").config();
const { ethers } = require("ethers");

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("❌ Need to provide identity to claim and claim type");
    process.exit(1);
}

const privateKey = process.env.PRIVATE_KEY;
const identityToClaim = args[0];
const topicClaimType = args[1];
const data = ethers.utils.toUtf8Bytes(process.env.DATA || "OK");

const wallet = new ethers.Wallet(privateKey);

(async () => {
    const dataHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["address", "uint256", "bytes"],
            [identityToClaim, topicClaimType, data]
        )
    );
    const ethSignedHash = ethers.utils.hashMessage(ethers.utils.arrayify(dataHash));
    const signature = await wallet.signMessage(ethers.utils.arrayify(dataHash));
    const sig = ethers.utils.splitSignature(signature);
    const recovered = ethers.utils.recoverAddress(ethSignedHash, sig);
    const key = ethers.utils.keccak256(ethers.utils.zeroPad(ethers.utils.getAddress(recovered), 32));

    // === LOGS ===
    console.log("🔒 Wallet:", wallet.address);
    console.log("👤 Identity to claim:", identityToClaim);
    console.log("📛 Topic:", topicClaimType);
    console.log("📦 Data (bytes):", ethers.utils.hexlify(data));
    console.log("🧩 DataHash:", dataHash);
    console.log("🔁 EthSignedHash:", ethSignedHash);
    console.log("✍️ Signature:", signature);
    console.log("↪️ v:", sig.v, "| r:", sig.r, "| s:", sig.s);
    console.log("✅ Signer address (recovered):", recovered);
    console.log("🗝️ getKey(...) value:", key);
})();
