const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("GiftCardManager", function () {
  let giftCardManager;
  let owner, sender, recipient;
  let mockERC20;

  beforeEach(async function () {
    [owner, sender, recipient] = await ethers.getSigners();

    // Deploy GiftCardManager
    const GiftCardManager = await ethers.getContractFactory("GiftCardManager");
    giftCardManager = await GiftCardManager.deploy();
    await giftCardManager.waitForDeployment();

    // Deploy mock ERC20 for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Test Token", "TEST", ethers.parseEther("1000"));
    await mockERC20.waitForDeployment();
    
    // Transfer some tokens to sender
    await mockERC20.transfer(sender.address, ethers.parseEther("100"));
  });

  describe("Gift Card Creation", function () {
    it("Should create a gift card with native tokens", async function () {
      const recipientHash = ethers.keccak256(
        ethers.solidityPacked(["address", "bytes32"], [recipient.address, ethers.id("salt")])
      );
      const expiration = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
      const message = "Happy Birthday!";
      const tokens = [
        {
          tokenType: 0, // NATIVE
          contractAddress: ethers.ZeroAddress,
          amount: ethers.parseEther("1"),
          tokenId: 0,
          data: "0x"
        }
      ];

      const tx = await giftCardManager.connect(sender).createGiftCard(
        recipientHash,
        expiration,
        message,
        tokens,
        { value: ethers.parseEther("1") }
      );

      await expect(tx)
        .to.emit(giftCardManager, "GiftCardCreated")
        .withArgs(1, sender.address, recipientHash, expiration, message);

      const giftCard = await giftCardManager.getGiftCard(1);
      expect(giftCard.sender).to.equal(sender.address);
      expect(giftCard.recipientHash).to.equal(recipientHash);
      expect(giftCard.message).to.equal(message);
      expect(giftCard.tokenCount).to.equal(1);
    });

    it("Should create a gift card with ERC20 tokens", async function () {
      const recipientHash = ethers.keccak256(
        ethers.solidityPacked(["address", "bytes32"], [recipient.address, ethers.id("salt")])
      );
      const expiration = Math.floor(Date.now() / 1000) + 7200;
      const message = "Here are some tokens!";
      const tokenAmount = ethers.parseEther("10");
      
      const tokens = [
        {
          tokenType: 1, // ERC20
          contractAddress: await mockERC20.getAddress(),
          amount: tokenAmount,
          tokenId: 0,
          data: "0x"
        }
      ];

      // Approve tokens
      await mockERC20.connect(sender).approve(await giftCardManager.getAddress(), tokenAmount);

      const tx = await giftCardManager.connect(sender).createGiftCard(
        recipientHash,
        expiration,
        message,
        tokens
      );

      await expect(tx)
        .to.emit(giftCardManager, "GiftCardCreated")
        .withArgs(1, sender.address, recipientHash, expiration, message);
    });
  });

  describe("Gift Card Claiming", function () {
    it("Should allow recipient to claim gift card", async function () {
      const salt = ethers.id("salt");
      const recipientHash = ethers.keccak256(
        ethers.solidityPacked(["address", "bytes32"], [recipient.address, salt])
      );
      const expiration = Math.floor(Date.now() / 1000) + 7200;
      const giftAmount = ethers.parseEther("1");
      
      const tokens = [
        {
          tokenType: 0, // NATIVE
          contractAddress: ethers.ZeroAddress,
          amount: giftAmount,
          tokenId: 0,
          data: "0x"
        }
      ];

      // Create gift card
      await giftCardManager.connect(sender).createGiftCard(
        recipientHash,
        expiration,
        "Test gift",
        tokens,
        { value: giftAmount }
      );

      const initialBalance = await ethers.provider.getBalance(recipient.address);

      // Claim gift card
      const tx = await giftCardManager.claimGiftCard(1, recipient.address, salt);
      
      await expect(tx)
        .to.emit(giftCardManager, "GiftCardClaimed")
        .withArgs(1, recipient.address, sender.address);

      const finalBalance = await ethers.provider.getBalance(recipient.address);
      expect(finalBalance - initialBalance).to.equal(giftAmount);
    });
  });

  describe("Gift Card Cancellation", function () {
    it("Should allow sender to cancel expired gift card", async function () {
      const recipientHash = ethers.keccak256(
        ethers.solidityPacked(["address", "bytes32"], [recipient.address, ethers.id("salt")])
      );
      const expiration = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
      const giftAmount = ethers.parseEther("1");
      
      const tokens = [
        {
          tokenType: 0, // NATIVE
          contractAddress: ethers.ZeroAddress,
          amount: giftAmount,
          tokenId: 0,
          data: "0x"
        }
      ];

      // Create gift card
      await giftCardManager.connect(sender).createGiftCard(
        recipientHash,
        expiration,
        "Test gift",
        tokens,
        { value: giftAmount }
      );

      // Fast forward time to after expiration
      await time.increaseTo(expiration + 1);

      const initialBalance = await ethers.provider.getBalance(sender.address);

      // Cancel gift card
      const tx = await giftCardManager.connect(sender).cancelGiftCard(1);
      
      await expect(tx)
        .to.emit(giftCardManager, "GiftCardCancelled")
        .withArgs(1, sender.address);

      // Check that sender got funds back (minus gas)
      const finalBalance = await ethers.provider.getBalance(sender.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});