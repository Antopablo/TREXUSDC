import pkg from 'hardhat';
const { ethers, upgrades } = pkg;


async function main() {

    let identityRegistryAddress;
    let complianceAddress;


    const [deployer] = await ethers.getSigners();
    console.log("🧑 Deploying contracts with account:", deployer.address);

    // Dépendances
    const complianceContractAddress = process.env.COMPLIANCE_CONTRACT_ADDRESS
    if (complianceContractAddress == null || complianceContractAddress == undefined || complianceContractAddress == "") {
        const Compliance = await ethers.getContractFactory("DefaultCompliance");
        const compliance = await Compliance.deploy();
        await compliance.deployed();
        complianceAddress = compliance.address;
        console.log("✅ Compliance deployed at:", compliance.address);
    } else {
        complianceAddress = complianceContractAddress
        console.log("☕ Use existing compliance contract :", complianceContractAddress)
    }

    const claimTopicContractAddress = process.env.CLAIM_TOPIC_CONTRACT_ADDRESS
    if (claimTopicContractAddress == null || claimTopicContractAddress == undefined || claimTopicContractAddress == "") {
        const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
        const claimTopics = await ClaimTopicsRegistry.deploy();
        await claimTopics.deployed();
        console.log("✅ Claim Topics Registry deployed at:", claimTopics.address);
    } else {
        console.log("☕ Use existing Claim Topics Registry contract :", claimTopicContractAddress)
    }

    const trustedIssuersContractAddress = process.env.TRUSTED_ISSUER_REGISTRY_CONTRACT_ADDRESS
    if (trustedIssuersContractAddress == null || trustedIssuersContractAddress == undefined || trustedIssuersContractAddress == "") {
        const TrustedIssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
        const trustedIssuers = await TrustedIssuersRegistry.deploy();
        await trustedIssuers.deployed();
        console.log("✅ Trusted Issuers Registry deployed at:", trustedIssuers.address);
    } else {
        console.log("☕ Use existing  Trusted Issuers Registry contract :", trustedIssuersContractAddress)
    }

    const identityRegistryStorageContractAddress = process.env.IDENTITY_REGISTRY_STORAGE_CONTRACT_ADDRESS
    if (identityRegistryStorageContractAddress == null || identityRegistryStorageContractAddress == undefined || identityRegistryStorageContractAddress == "") {
        const IdentityStorage = await ethers.getContractFactory("IdentityRegistryStorage");
        const identityStorage = await IdentityStorage.deploy();
        await identityStorage.deployed();
        console.log("✅ Identity Registry Storage deployed at:", identityStorage.address);
    } else {
        console.log("☕ Use existing Identity Registry Storage contract :", identityRegistryStorageContractAddress)
    }

    const identityRegistryContractAddress = process.env.IDENTITY_REGISTRY_STORAGE_CONTRACT_ADDRESS
    if (identityRegistryContractAddress == null || identityRegistryContractAddress == undefined || identityRegistryContractAddress == "") {
        const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
        const identityRegistry = await upgrades.deployProxy(
            IdentityRegistry,
            [trustedIssuers.address, claimTopics.address, identityStorage.address],
            { initializer: "init" }
        );
        await identityRegistry.deployed();
        identityRegistryAddress = identityRegistry.address;
        console.log("✅ Identity Registry deployed at:", identityRegistry.address);
    } else {
        identityRegistryAddress = identityRegistryContractAddress
        console.log("☕ Use existing Identity Registry contract :", identityRegistryContractAddress)
    }



    // 🪙 Déploiement du token ERC3643 (T-REX / ComplianceToken)
    const Token = await ethers.getContractFactory("Token"); // ou "TREX" ou "ComplianceToken"
    const token = await upgrades.deployProxy(
        Token,
        [
            identityRegistryAddress,
            complianceAddress,
            "My Token Anto",       // Nom
            "MTA",            // Symbole
            18,               // Décimales
            deployer.address  // Propriétaire initial
        ],
        { initializer: "init" }
    );
    await token.deployed();
    console.log("🎉 Anto Token deployed at:", token.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

