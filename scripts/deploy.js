// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting GiftCardManager deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with the account:", deployer.address);
  
  // Check deployer balance
  const deployerBalance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(deployerBalance), "ETH\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId);

  // Deploy GiftCardManager
  console.log("\n📦 Deploying GiftCardManager...");
  const GiftCardManager = await ethers.getContractFactory("GiftCardManager");
  const giftCardManager = await GiftCardManager.deploy();
  
  await giftCardManager.waitForDeployment();
  const contractAddress = await giftCardManager.getAddress();
  
  console.log("✅ GiftCardManager deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔍 Transaction hash:", giftCardManager.deploymentTransaction().hash);

  // Verify deployment by calling a view function
  console.log("\n🔍 Verifying deployment...");
  try {
    const totalGiftCards = await giftCardManager.getTotalGiftCards();
    console.log("✅ Contract verification successful!");
    console.log("📊 Initial gift card count:", totalGiftCards.toString());
  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
  }

  // Display environment variable format for easy copying
  const networkName = network.name.toUpperCase().replace(/\s+/g, '_');
  console.log("\n📝 Environment Variables:");
  console.log(`NEXT_PUBLIC_GIFT_CARD_MANAGER_${networkName}=${contractAddress}`);
  
  // Display contract info summary
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Network:           ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Contract:          GiftCardManager`);
  console.log(`Address:           ${contractAddress}`);
  console.log(`Deployer:          ${deployer.address}`);
  console.log(`Gas Used:          ${giftCardManager.deploymentTransaction().gasLimit}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractName: "GiftCardManager",
    address: contractAddress,
    deployer: deployer.address,
    deploymentTransaction: giftCardManager.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    gasLimit: giftCardManager.deploymentTransaction().gasLimit.toString()
  };

  // Write deployment info to file
  const fs = require('fs');
  const deploymentDir = './deployments';
  
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = `${deploymentDir}/${network.name}-${network.chainId}.json`;
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  console.log("\n🎉 Deployment completed successfully!");
  
  // Verification instructions
  console.log("\n🔍 To verify the contract on Etherscan, run:");
  console.log(`npx hardhat verify --network ${network.name} ${contractAddress}`);
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });