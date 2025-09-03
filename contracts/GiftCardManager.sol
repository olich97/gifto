// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./interfaces/IGiftCardManager.sol";

/**
 * @title GiftCardManager
 * @dev Gas-efficient gift card manager that stores all gift cards in a single contract
 * @notice This contract allows users to create multi-token gift cards with privacy features
 */
contract GiftCardManager is 
    IGiftCardManager, 
    ReentrancyGuard, 
    Pausable, 
    Ownable, 
    ERC721Holder, 
    ERC1155Holder 
{
    using SafeERC20 for IERC20;

    // State variables
    mapping(uint256 => GiftCard) private giftCards;
    mapping(uint256 => mapping(uint256 => Token)) private giftCardTokens;
    mapping(address => uint256[]) private senderToGiftCards;
    
    uint256 private nextGiftCardId = 1;
    uint256 public totalClaimed;
    uint256 public totalCancelled;
    
    // Constants
    uint256 public constant MAX_EXPIRATION = 365 days; // Maximum 1 year expiration
    uint256 public constant MIN_EXPIRATION = 1 hours;  // Minimum 1 hour expiration
    uint256 public constant MAX_TOKENS_PER_GIFT = 10;  // Maximum tokens per gift card

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new gift card with multiple tokens
     */
    function createGiftCard(
        bytes32 recipientHash,
        uint256 expiration,
        string calldata message,
        Token[] calldata tokens
    ) external payable override nonReentrant whenNotPaused returns (uint256 giftCardId) {
        // Validation
        require(tokens.length > 0, "Must include at least one token");
        require(tokens.length <= MAX_TOKENS_PER_GIFT, "Too many tokens");
        require(expiration > block.timestamp + MIN_EXPIRATION, "Expiration too soon");
        require(expiration <= block.timestamp + MAX_EXPIRATION, "Expiration too far");
        require(recipientHash != bytes32(0), "Invalid recipient hash");
        require(bytes(message).length <= 280, "Message too long"); // Twitter-like limit

        giftCardId = nextGiftCardId++;
        
        // Create gift card
        giftCards[giftCardId] = GiftCard({
            sender: msg.sender,
            recipientHash: recipientHash,
            expiration: expiration,
            createdAt: block.timestamp,
            claimed: false,
            cancelled: false,
            message: message,
            tokenCount: tokens.length
        });

        uint256 nativeValueRequired = 0;

        // Process and store tokens
        for (uint256 i = 0; i < tokens.length; i++) {
            Token calldata token = tokens[i];
            
            // Validate token data
            require(token.amount > 0, "Token amount must be > 0");
            
            if (token.tokenType == TokenType.NATIVE) {
                require(token.contractAddress == address(0), "Native token must have zero address");
                nativeValueRequired += token.amount;
            } else if (token.tokenType == TokenType.ERC20) {
                require(token.contractAddress != address(0), "Invalid ERC20 address");
                // Transfer ERC20 tokens to this contract
                IERC20(token.contractAddress).safeTransferFrom(
                    msg.sender, 
                    address(this), 
                    token.amount
                );
            } else if (token.tokenType == TokenType.ERC721) {
                require(token.contractAddress != address(0), "Invalid ERC721 address");
                // Transfer NFT to this contract
                IERC721(token.contractAddress).safeTransferFrom(
                    msg.sender, 
                    address(this), 
                    token.amount
                );
            } else if (token.tokenType == TokenType.ERC1155) {
                require(token.contractAddress != address(0), "Invalid ERC1155 address");
                require(token.amount > 0, "ERC1155 amount must be > 0");
                // Transfer ERC1155 tokens to this contract
                IERC1155(token.contractAddress).safeTransferFrom(
                    msg.sender,
                    address(this),
                    token.tokenId,
                    token.amount,
                    token.data
                );
            }
            
            // Store token data
            giftCardTokens[giftCardId][i] = token;
        }

        // Validate native value sent
        require(msg.value == nativeValueRequired, "Incorrect native token amount");

        // Update sender's gift card list
        senderToGiftCards[msg.sender].push(giftCardId);

        emit GiftCardCreated(giftCardId, msg.sender, recipientHash, expiration, message);
    }

    /**
     * @dev Claim a gift card
     */
    function claimGiftCard(
        uint256 giftCardId,
        address recipient,
        bytes32 salt
    ) external override nonReentrant whenNotPaused {
        GiftCard storage giftCard = giftCards[giftCardId];
        
        // Validation
        require(giftCard.sender != address(0), "Gift card does not exist");
        require(!giftCard.claimed, "Gift card already claimed");
        require(!giftCard.cancelled, "Gift card was cancelled");
        require(block.timestamp <= giftCard.expiration, "Gift card has expired");
        require(
            keccak256(abi.encodePacked(recipient, salt)) == giftCard.recipientHash,
            "Invalid recipient or salt"
        );

        // Mark as claimed
        giftCard.claimed = true;
        totalClaimed++;

        // Transfer all tokens to recipient
        for (uint256 i = 0; i < giftCard.tokenCount; i++) {
            Token storage token = giftCardTokens[giftCardId][i];
            _transferToken(token, recipient);
        }

        emit GiftCardClaimed(giftCardId, recipient, giftCard.sender);
    }

    /**
     * @dev Cancel an expired gift card
     */
    function cancelGiftCard(uint256 giftCardId) external override nonReentrant {
        GiftCard storage giftCard = giftCards[giftCardId];
        
        // Validation
        require(giftCard.sender == msg.sender, "Only sender can cancel");
        require(!giftCard.claimed, "Gift card already claimed");
        require(!giftCard.cancelled, "Gift card already cancelled");
        require(block.timestamp > giftCard.expiration, "Gift card not yet expired");

        // Mark as cancelled
        giftCard.cancelled = true;
        totalCancelled++;

        // Return all tokens to sender
        for (uint256 i = 0; i < giftCard.tokenCount; i++) {
            Token storage token = giftCardTokens[giftCardId][i];
            _transferToken(token, giftCard.sender);
        }

        emit GiftCardCancelled(giftCardId, msg.sender);
    }

    /**
     * @dev Internal function to transfer tokens
     */
    function _transferToken(Token storage token, address to) private {
        if (token.tokenType == TokenType.NATIVE) {
            (bool success, ) = payable(to).call{value: token.amount}("");
            require(success, "Native token transfer failed");
        } else if (token.tokenType == TokenType.ERC20) {
            IERC20(token.contractAddress).safeTransfer(to, token.amount);
        } else if (token.tokenType == TokenType.ERC721) {
            IERC721(token.contractAddress).safeTransferFrom(address(this), to, token.amount);
        } else if (token.tokenType == TokenType.ERC1155) {
            IERC1155(token.contractAddress).safeTransferFrom(
                address(this),
                to,
                token.tokenId,
                token.amount,
                token.data
            );
        }
    }

    // View functions
    function getGiftCard(uint256 giftCardId) external view override returns (GiftCard memory) {
        return giftCards[giftCardId];
    }

    function getGiftCardToken(uint256 giftCardId, uint256 tokenIndex) 
        external 
        view 
        override 
        returns (Token memory) 
    {
        return giftCardTokens[giftCardId][tokenIndex];
    }

    function getGiftCardTokens(uint256 giftCardId) 
        external 
        view 
        override 
        returns (Token[] memory tokens) 
    {
        GiftCard memory giftCard = giftCards[giftCardId];
        tokens = new Token[](giftCard.tokenCount);
        
        for (uint256 i = 0; i < giftCard.tokenCount; i++) {
            tokens[i] = giftCardTokens[giftCardId][i];
        }
    }

    function canClaimGiftCard(
        uint256 giftCardId,
        address recipient,
        bytes32 salt
    ) external view override returns (bool) {
        GiftCard memory giftCard = giftCards[giftCardId];
        
        return giftCard.sender != address(0) &&
               !giftCard.claimed &&
               !giftCard.cancelled &&
               block.timestamp <= giftCard.expiration &&
               keccak256(abi.encodePacked(recipient, salt)) == giftCard.recipientHash;
    }

    function getGiftCardsBySender(address sender) 
        external 
        view 
        override 
        returns (uint256[] memory) 
    {
        return senderToGiftCards[sender];
    }

    function getTotalGiftCards() external view override returns (uint256) {
        return nextGiftCardId - 1;
    }

    function getStatistics() 
        external 
        view 
        override 
        returns (uint256 totalCreated, uint256 claimed, uint256 cancelled, uint256 totalValue) 
    {
        return (
            nextGiftCardId - 1,
            totalClaimed,
            totalCancelled,
            address(this).balance
        );
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency functions - only for stuck funds due to bugs
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }
}