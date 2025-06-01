require("dotenv").config();
const { ethers } = require("ethers");

const address = process.env.WALLET_9834;
const key = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address"], [address]));

console.log("Hashed key:", key);
