// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IGiftCardManager
 * @dev Interface for the gas-efficient gift card manager
 */
interface IGiftCardManager {
    enum TokenType {
        NATIVE,    // ETH, MATIC, etc.
        ERC20,     // Standard ERC20 tokens
        ERC721,    // NFTs
        ERC1155    // Semi-fungible tokens
    }

    struct Token {
        TokenType tokenType;
        address contractAddress;  // Zero address for native tokens
        uint256 amount;          // Amount for ERC20/NATIVE, tokenId for ERC721/ERC1155
        uint256 tokenId;         // Only used for ERC1155 (amount goes in 'amount' field)
        bytes data;              // Additional data for ERC1155 transfers
    }

    struct GiftCard {
        address sender;
        bytes32 recipientHash;   // keccak256(recipient_address + salt)
        uint256 expiration;
        uint256 createdAt;
        bool claimed;
        bool cancelled;
        string message;
        uint256 tokenCount;      // Number of tokens in this gift card
    }

    /**
     * @dev Emitted when a gift card is created
     */
    event GiftCardCreated(
        uint256 indexed giftCardId,
        address indexed sender,
        bytes32 indexed recipientHash,
        uint256 expiration,
        string message
    );

    /**
     * @dev Emitted when a gift card is claimed
     */
    event GiftCardClaimed(
        uint256 indexed giftCardId,
        address indexed recipient,
        address indexed sender
    );

    /**
     * @dev Emitted when a gift card is cancelled
     */
    event GiftCardCancelled(
        uint256 indexed giftCardId,
        address indexed sender
    );

    /**
     * @dev Create a new gift card with multiple tokens
     * @param recipientHash Hash of recipient address + salt for privacy
     * @param expiration Timestamp when gift expires (must be > block.timestamp)
     * @param message Message from sender to recipient
     * @param tokens Array of tokens to include in the gift card
     * @return giftCardId The ID of the created gift card
     */
    function createGiftCard(
        bytes32 recipientHash,
        uint256 expiration,
        string calldata message,
        Token[] calldata tokens
    ) external payable returns (uint256 giftCardId);

    /**
     * @dev Claim a gift card by providing recipient address and salt
     * @param giftCardId The gift card ID to claim
     * @param recipient The recipient address
     * @param salt The salt used to generate the recipientHash
     */
    function claimGiftCard(
        uint256 giftCardId,
        address recipient,
        bytes32 salt
    ) external;

    /**
     * @dev Cancel an expired gift card and return funds to sender
     * @param giftCardId The gift card ID to cancel
     */
    function cancelGiftCard(uint256 giftCardId) external;

    /**
     * @dev Get gift card details
     * @param giftCardId The gift card ID
     * @return giftCard The gift card details
     */
    function getGiftCard(uint256 giftCardId) external view returns (GiftCard memory giftCard);

    /**
     * @dev Get token details for a gift card
     * @param giftCardId The gift card ID
     * @param tokenIndex The index of the token
     * @return token The token details
     */
    function getGiftCardToken(uint256 giftCardId, uint256 tokenIndex) 
        external 
        view 
        returns (Token memory token);

    /**
     * @dev Get all tokens for a gift card
     * @param giftCardId The gift card ID
     * @return tokens Array of all tokens in the gift card
     */
    function getGiftCardTokens(uint256 giftCardId) 
        external 
        view 
        returns (Token[] memory tokens);

    /**
     * @dev Check if a gift card can be claimed by a recipient
     * @param giftCardId The gift card ID
     * @param recipient The recipient address
     * @param salt The salt used to generate recipientHash
     * @return canClaim True if the gift card can be claimed
     */
    function canClaimGiftCard(
        uint256 giftCardId,
        address recipient,
        bytes32 salt
    ) external view returns (bool canClaim);

    /**
     * @dev Get gift cards sent by a specific address
     * @param sender The sender address
     * @return giftCardIds Array of gift card IDs sent by the address
     */
    function getGiftCardsBySender(address sender) 
        external 
        view 
        returns (uint256[] memory giftCardIds);

    /**
     * @dev Get total number of gift cards created
     * @return count Total gift card count
     */
    function getTotalGiftCards() external view returns (uint256 count);

    /**
     * @dev Get gift card statistics
     * @return totalCreated Total gift cards created
     * @return claimed Total gift cards claimed
     * @return cancelled Total gift cards cancelled
     * @return totalValue Total value locked in active gift cards (ETH only)
     */
    function getStatistics() 
        external 
        view 
        returns (
            uint256 totalCreated,
            uint256 claimed,
            uint256 cancelled,
            uint256 totalValue
        );
}