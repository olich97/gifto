// scripts/dev-setup.js
const { spawn } = require('child_process');
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Setting up local development environment...\n");

  // Check if Hardhat node is already running
  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    await provider.getNetwork();
    console.log("✅ Hardhat node is already running at http://localhost:8545");
  } catch (error) {
    console.log("❌ Hardhat node not detected. Please start it first:");
    console.log("   yarn hardhat:node");
    console.log("\nOr use the combined script:");
    console.log("   yarn dev:full");
    process.exit(1);
  }

  console.log("\n🔨 Deploying contracts to local network...");
  
  // Deploy contracts
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);
  
  const deployerBalance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(deployerBalance), "ETH");

  // Deploy GiftCardManager
  const GiftCardManager = await ethers.getContractFactory("GiftCardManager");
  console.log("📦 Deploying GiftCardManager...");
  
  const giftCardManager = await GiftCardManager.deploy();
  await giftCardManager.waitForDeployment();
  const contractAddress = await giftCardManager.getAddress();
  
  console.log("✅ GiftCardManager deployed at:", contractAddress);

  // Create .env.local if it doesn't exist
  const envPath = path.join(__dirname, '..', '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add the contract address
  const contractEnvVar = `NEXT_PUBLIC_GIFT_CARD_MANAGER_HARDHAT=${contractAddress}`;
  
  if (envContent.includes('NEXT_PUBLIC_GIFT_CARD_MANAGER_HARDHAT=')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_GIFT_CARD_MANAGER_HARDHAT=.*/,
      contractEnvVar
    );
  } else {
    envContent += `\n${contractEnvVar}\n`;
  }

  // Add WalletConnect project ID if not present
  if (!envContent.includes('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=')) {
    envContent += `# Get your project ID from https://cloud.reown.com/\nNEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Updated .env.local with contract address");

  // Test basic contract functionality
  console.log("\n🧪 Testing contract deployment...");
  try {
    const totalGiftCards = await giftCardManager.getTotalGiftCards();
    const stats = await giftCardManager.getStatistics();
    
    console.log("✅ Contract is functional!");
    console.log("📊 Initial state:");
    console.log(`   Total Gift Cards: ${totalGiftCards}`);
    console.log(`   Created: ${stats.totalCreated}, Claimed: ${stats.totalClaimed}, Cancelled: ${stats.totalCancelled}`);
    console.log(`   Total Value: ${ethers.formatEther(stats.totalValue)} ETH`);
    
  } catch (error) {
    console.error("❌ Contract test failed:", error.message);
  }

  // Create some test data for development
  console.log("\n🎭 Creating test gift cards for development...");
  
  try {
    // Create a test gift card with ETH
    const recipientHash = ethers.keccak256(
      ethers.solidityPacked(
        ["address", "bytes32"], 
        [deployer.address, ethers.id("test-salt")]
      )
    );
    
    const expiration = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const message = "Test gift card for development";
    const giftValue = ethers.parseEther("1.0");
    
    const tokens = [{
      tokenType: 0, // NATIVE
      contractAddress: ethers.ZeroAddress,
      amount: giftValue,
      tokenId: 0,
      data: "0x"
    }];

    const createTx = await giftCardManager.createGiftCard(
      recipientHash,
      expiration,
      message,
      tokens,
      { value: giftValue }
    );
    
    await createTx.wait();
    console.log("✅ Created test gift card #1");
    
    // Verify the gift card was created
    const updatedTotal = await giftCardManager.getTotalGiftCards();
    console.log(`📊 Total gift cards now: ${updatedTotal}`);
    
  } catch (error) {
    console.error("⚠️  Failed to create test gift card:", error.message);
  }

  // Display development info
  console.log("\n🔧 Development Environment Ready!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 Network:           Hardhat Local (Chain ID: 31337)");
  console.log("📍 Contract Address:  " + contractAddress);
  console.log("🔗 RPC URL:           http://localhost:8545");
  console.log("👤 Test Account:      " + deployer.address);
  console.log("💰 Test Balance:      " + ethers.formatEther(deployerBalance) + " ETH");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("\n📋 Next Steps:");
  console.log("1. Start the Next.js development server:");
  console.log("   yarn dev");
  console.log("\n2. Open your browser to http://localhost:3000");
  console.log("\n3. Connect your wallet to Hardhat network:");
  console.log("   - Network: Hardhat");
  console.log("   - RPC URL: http://localhost:8545");
  console.log("   - Chain ID: 31337");
  console.log("   - Symbol: ETH");
  
  console.log("\n4. Import test account into your wallet:");
  console.log("   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("   (This is the first Hardhat test account with 10,000 ETH)");
  
  console.log("\n🎉 Happy coding!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });