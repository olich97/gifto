// scripts/test-local.js
// Script to test deployed contracts with real interactions

const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !key.startsWith('#')) {
      process.env[key] = value;
    }
  });
}

async function main() {
  console.log("🧪 Testing GiftCardManager on local network...\n");

  // Get signers (test accounts from Hardhat)
  const [deployer, sender, recipient] = await ethers.getSigners();
  
  console.log("👥 Test Accounts:");
  console.log("   Deployer:", deployer.address);
  console.log("   Sender:", sender.address);
  console.log("   Recipient:", recipient.address);

  // Connect to deployed contract
  const contractAddress = process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_HARDHAT;
  if (!contractAddress) {
    console.error("❌ Contract address not found. Run dev-setup.js first.");
    process.exit(1);
  }

  console.log("\n📍 Connecting to GiftCardManager at:", contractAddress);
  const giftCardManager = await ethers.getContractAt("GiftCardManager", contractAddress);

  // Test 1: Check initial state
  console.log("\n🔍 Test 1: Initial State");
  try {
    const totalCards = await giftCardManager.getTotalGiftCards();
    const stats = await giftCardManager.getStatistics();
    
    console.log("✅ Total gift cards:", totalCards.toString());
    console.log("✅ Statistics:", {
      created: stats.totalCreated.toString(),
      claimed: stats.claimed.toString(), 
      cancelled: stats.cancelled.toString(),
      totalValue: ethers.formatEther(stats.totalValue) + " ETH"
    });
  } catch (error) {
    console.error("❌ Failed to read initial state:", error.message);
    return;
  }

  // Test 2: Create a gift card with native token (ETH)
  console.log("\n🎁 Test 2: Creating Gift Card with ETH");
  try {
    const recipientHash = ethers.keccak256(
      ethers.solidityPacked(["address", "bytes32"], [recipient.address, ethers.id("secret-salt")])
    );
    
    const expiration = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    const message = "Happy Testing! 🎉";
    const giftAmount = ethers.parseEther("2.5");
    
    const tokens = [{
      tokenType: 0, // NATIVE
      contractAddress: ethers.ZeroAddress,
      amount: giftAmount,
      tokenId: 0,
      data: "0x"
    }];

    const senderBalanceBefore = await sender.provider.getBalance(sender.address);
    console.log("   Sender balance before:", ethers.formatEther(senderBalanceBefore), "ETH");

    // Create gift card as sender
    const createTx = await giftCardManager.connect(sender).createGiftCard(
      recipientHash,
      expiration,
      message,
      tokens,
      { value: giftAmount }
    );
    
    const receipt = await createTx.wait();
    console.log("✅ Gift card created! Gas used:", receipt.gasUsed.toString());
    
    // Find the GiftCardCreated event
    const createEvent = receipt.logs.find(log => 
      log.fragment && log.fragment.name === 'GiftCardCreated'
    );
    
    if (createEvent) {
      const giftCardId = createEvent.args[0];
      console.log("✅ Gift Card ID:", giftCardId.toString());
      
      // Get gift card details
      const giftCard = await giftCardManager.getGiftCard(giftCardId);
      console.log("✅ Gift Card Details:", {
        sender: giftCard.sender,
        expiration: new Date(Number(giftCard.expiration) * 1000).toLocaleString(),
        message: giftCard.message,
        claimed: giftCard.claimed,
        cancelled: giftCard.cancelled,
        tokenCount: giftCard.tokenCount.toString()
      });

      // Test 3: Check if recipient can claim
      console.log("\n🔐 Test 3: Checking Claim Eligibility");
      const canClaim = await giftCardManager.canClaimGiftCard(
        giftCardId,
        recipient.address,
        ethers.id("secret-salt")
      );
      console.log("✅ Can recipient claim?", canClaim);

      // Test 4: Claim the gift card
      console.log("\n🎯 Test 4: Claiming Gift Card");
      const recipientBalanceBefore = await recipient.provider.getBalance(recipient.address);
      console.log("   Recipient balance before:", ethers.formatEther(recipientBalanceBefore), "ETH");

      const claimTx = await giftCardManager.connect(recipient).claimGiftCard(
        giftCardId,
        recipient.address,
        ethers.id("secret-salt")
      );
      
      const claimReceipt = await claimTx.wait();
      console.log("✅ Gift card claimed! Gas used:", claimReceipt.gasUsed.toString());

      const recipientBalanceAfter = await recipient.provider.getBalance(recipient.address);
      console.log("   Recipient balance after:", ethers.formatEther(recipientBalanceAfter), "ETH");
      
      const gained = recipientBalanceAfter - recipientBalanceBefore;
      console.log("   Net gain (after gas):", ethers.formatEther(gained), "ETH");

      // Verify the gift card is now claimed
      const updatedGiftCard = await giftCardManager.getGiftCard(giftCardId);
      console.log("✅ Gift card claimed status:", updatedGiftCard.claimed);
    }
    
  } catch (error) {
    console.error("❌ Failed to create/claim gift card:", error.message);
  }

  // Test 5: Create and cancel an expired gift card
  console.log("\n⏰ Test 5: Creating and Cancelling Expired Gift Card");
  try {
    const recipientHash2 = ethers.keccak256(
      ethers.solidityPacked(["address", "bytes32"], [recipient.address, ethers.id("salt2")])
    );
    
    const shortExpiration = Math.floor(Date.now() / 1000) + 7200; // 2 hours
    const cancelAmount = ethers.parseEther("1.0");
    
    const tokens2 = [{
      tokenType: 0, // NATIVE
      contractAddress: ethers.ZeroAddress,
      amount: cancelAmount,
      tokenId: 0,
      data: "0x"
    }];

    const createTx2 = await giftCardManager.connect(sender).createGiftCard(
      recipientHash2,
      shortExpiration,
      "This will be cancelled",
      tokens2,
      { value: cancelAmount }
    );
    
    const receipt2 = await createTx2.wait();
    const createEvent2 = receipt2.logs.find(log => 
      log.fragment && log.fragment.name === 'GiftCardCreated'
    );
    
    if (createEvent2) {
      const giftCardId2 = createEvent2.args[0];
      console.log("✅ Created gift card for cancellation test, ID:", giftCardId2.toString());
      
      // Fast forward time in Hardhat
      await ethers.provider.send("evm_increaseTime", [7201]); // Move forward 2+ hours
      await ethers.provider.send("evm_mine"); // Mine a new block
      
      console.log("⏰ Fast-forwarded time past expiration");
      
      const senderBalanceBeforeCancel = await sender.provider.getBalance(sender.address);
      
      // Cancel the expired gift card
      const cancelTx = await giftCardManager.connect(sender).cancelGiftCard(giftCardId2);
      const cancelReceipt = await cancelTx.wait();
      
      console.log("✅ Gift card cancelled! Gas used:", cancelReceipt.gasUsed.toString());
      
      const senderBalanceAfterCancel = await sender.provider.getBalance(sender.address);
      const recovered = senderBalanceAfterCancel - senderBalanceBeforeCancel;
      console.log("   Recovered amount (after gas):", ethers.formatEther(recovered), "ETH");
    }
    
  } catch (error) {
    console.error("❌ Failed to test cancellation:", error.message);
  }

  // Final statistics
  console.log("\n📊 Final Statistics");
  try {
    const finalStats = await giftCardManager.getStatistics();
    const finalTotal = await giftCardManager.getTotalGiftCards();
    
    console.log("✅ Final State:", {
      totalGiftCards: finalTotal.toString(),
      created: finalStats.totalCreated.toString(),
      claimed: finalStats.claimed.toString(),
      cancelled: finalStats.cancelled.toString(),
      totalValue: ethers.formatEther(finalStats.totalValue) + " ETH"
    });
  } catch (error) {
    console.error("❌ Failed to read final statistics:", error.message);
  }

  console.log("\n🎉 Local testing completed!");
  console.log("🔗 Contract is ready for frontend integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });