// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ETHSafariComments
 * @dev Contract for commenting on tweets with NFT minting
 */
contract ETHSafariComments is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct Comment {
        string tweetId;
        string content;
        address author;
        uint256 timestamp;
    }

    mapping(uint256 => Comment) public comments;
    mapping(string => uint256[]) public tweetComments; // tweetId => commentIds

    mapping(string => mapping(address => bool)) public tweetLikes; // tweetId => user => liked
    mapping(string => uint256) public tweetLikeCounts; // tweetId => count

    event CommentAdded(uint256 indexed tokenId, string tweetId, string content, address indexed author);
    event LikeAdded(string indexed tweetId, address indexed user);
    event LikeRemoved(string indexed tweetId, address indexed user);

    constructor() ERC721("ETHSafari Comment", "ESC") Ownable(msg.sender) {}

    /**
     * @dev Mint a comment NFT for a tweet
     * @param tweetId The ID of the tweet being commented on
     * @param content The comment content
     */
    function addComment(string memory tweetId, string memory content) external {
        require(bytes(content).length > 0, "Comment cannot be empty");
        require(bytes(tweetId).length > 0, "Tweet ID cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);

        comments[tokenId] = Comment({
            tweetId: tweetId,
            content: content,
            author: msg.sender,
            timestamp: block.timestamp
        });

        tweetComments[tweetId].push(tokenId);

        emit CommentAdded(tokenId, tweetId, content, msg.sender);
    }

    /**
     * @dev Get all comments for a tweet
     * @param tweetId The tweet ID
     * @return Array of comment structs
     */
    function getCommentsForTweet(string memory tweetId) external view returns (Comment[] memory) {
        uint256[] memory commentIds = tweetComments[tweetId];
        Comment[] memory result = new Comment[](commentIds.length);

        for (uint256 i = 0; i < commentIds.length; i++) {
            result[i] = comments[commentIds[i]];
        }

        return result;
    }

    /**
     * @dev Like or unlike a tweet
     * @param tweetId The ID of the tweet
     */
    function toggleLike(string memory tweetId) external {
        require(bytes(tweetId).length > 0, "Tweet ID cannot be empty");

        if (tweetLikes[tweetId][msg.sender]) {
            // Unlike
            tweetLikes[tweetId][msg.sender] = false;
            tweetLikeCounts[tweetId]--;
            emit LikeRemoved(tweetId, msg.sender);
        } else {
            // Like
            tweetLikes[tweetId][msg.sender] = true;
            tweetLikeCounts[tweetId]++;
            emit LikeAdded(tweetId, msg.sender);
        }
    }

    /**
     * @dev Get like count for a tweet
     * @param tweetId The tweet ID
     * @return The number of likes
     */
    function getLikeCount(string memory tweetId) external view returns (uint256) {
        return tweetLikeCounts[tweetId];
    }

    /**
     * @dev Check if user liked a tweet
     * @param tweetId The tweet ID
     * @param user The user address
     * @return True if liked
     */
    function hasLiked(string memory tweetId, address user) external view returns (bool) {
        return tweetLikes[tweetId][user];
    }
}