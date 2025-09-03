// scripts/deploy-testnet.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Deploying to Testnet...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer:", deployer.address);
  
  // Check deployer balance
  const deployerBalance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(deployerBalance), "ETH");

  // Ensure we have enough balance for deployment
  const minimumBalance = ethers.parseEther("0.01"); // 0.01 ETH minimum
  if (deployerBalance < minimumBalance) {
    console.error("❌ Insufficient balance for deployment. Need at least 0.01 ETH");
    process.exit(1);
  }

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId);

  // Verify this is a testnet
  const testnetChainIds = [11155111, 80001, 421613, 84531, 420]; // Sepolia, Mumbai, Arbitrum Goerli, Base Goerli, Optimism Goerli
  if (!testnetChainIds.includes(Number(network.chainId))) {
    console.warn("⚠️  Warning: This doesn't appear to be a known testnet!");
    console.log("Known testnet chain IDs:", testnetChainIds);
  }

  // Deploy GiftCardManager
  console.log("\n📦 Deploying GiftCardManager...");
  const GiftCardManager = await ethers.getContractFactory("GiftCardManager");
  
  // Estimate gas for deployment
  const deploymentData = GiftCardManager.bytecode;
  const gasEstimate = await ethers.provider.estimateGas({
    data: deploymentData
  });
  console.log("⛽ Estimated gas:", gasEstimate.toString());

  const giftCardManager = await GiftCardManager.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await giftCardManager.waitForDeployment();
  const contractAddress = await giftCardManager.getAddress();
  
  console.log("✅ GiftCardManager deployed!");
  console.log("📍 Address:", contractAddress);
  console.log("🔍 Tx Hash:", giftCardManager.deploymentTransaction().hash);

  // Test the deployed contract
  console.log("\n🧪 Testing deployed contract...");
  try {
    // Test basic functionality
    const totalGiftCards = await giftCardManager.getTotalGiftCards();
    const stats = await giftCardManager.getStatistics();
    
    console.log("✅ Contract is functional!");
    console.log("📊 Total gift cards:", totalGiftCards.toString());
    console.log("📈 Stats - Created:", stats.totalCreated.toString(), 
                "Claimed:", stats.claimed.toString(), 
                "Cancelled:", stats.cancelled.toString());
                
    // Test contract owner
    const owner = await giftCardManager.owner();
    console.log("👤 Contract owner:", owner);
    console.log("✅ Owner matches deployer:", owner === deployer.address);
    
  } catch (error) {
    console.error("❌ Contract test failed:", error.message);
  }

  // Network-specific instructions
  console.log("\n🔗 Network Information:");
  const networkInfo = getNetworkInfo(Number(network.chainId));
  if (networkInfo) {
    console.log(`Name: ${networkInfo.name}`);
    console.log(`Explorer: ${networkInfo.explorer}/address/${contractAddress}`);
    console.log(`Faucet: ${networkInfo.faucet || 'N/A'}`);
  }

  // Environment variable
  const envVarName = getEnvVarName(Number(network.chainId));
  console.log("\n📝 Add to .env.local:");
  console.log(`${envVarName}=${contractAddress}`);

  console.log("\n🎉 Testnet deployment completed!");
}

function getNetworkInfo(chainId) {
  const networks = {
    11155111: {
      name: "Sepolia",
      explorer: "https://sepolia.etherscan.io",
      faucet: "https://sepoliafaucet.com"
    },
    80001: {
      name: "Polygon Mumbai",
      explorer: "https://mumbai.polygonscan.com",
      faucet: "https://faucet.polygon.technology"
    },
    421613: {
      name: "Arbitrum Goerli", 
      explorer: "https://goerli.arbiscan.io",
      faucet: "https://bridge.arbitrum.io"
    },
    84531: {
      name: "Base Goerli",
      explorer: "https://goerli.basescan.org", 
      faucet: "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
    },
    420: {
      name: "Optimism Goerli",
      explorer: "https://goerli-optimism.etherscan.io",
      faucet: "https://app.optimism.io/faucet"
    }
  };
  
  return networks[chainId];
}

function getEnvVarName(chainId) {
  const envNames = {
    11155111: "NEXT_PUBLIC_GIFT_CARD_MANAGER_SEPOLIA",
    80001: "NEXT_PUBLIC_GIFT_CARD_MANAGER_POLYGON_MUMBAI", 
    421613: "NEXT_PUBLIC_GIFT_CARD_MANAGER_ARBITRUM_GOERLI",
    84531: "NEXT_PUBLIC_GIFT_CARD_MANAGER_BASE_GOERLI",
    420: "NEXT_PUBLIC_GIFT_CARD_MANAGER_OPTIMISM_GOERLI"
  };
  
  return envNames[chainId] || `NEXT_PUBLIC_GIFT_CARD_MANAGER_${chainId}`;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });