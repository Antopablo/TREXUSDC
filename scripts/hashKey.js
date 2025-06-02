require("dotenv").config();
const { ethers } = require("ethers");

const address = process.env.WALLET_9834;
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

const key = ethers.utils.keccak256(ethers.utils.solidityPack(["address"], [wallet.address]));

console.log("Hashed key2:", key);


