// contracts/ETHSafariTicket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ETHSafariTicket is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public constant TICKET_PRICE = 0.01 ether; // 0.01 ETH per ticket

    struct Ticket {
        uint256 tokenId;
        address owner;
        string username;
        uint256 mintedAt;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;

    event TicketMinted(uint256 indexed tokenId, address indexed owner, string username);

    constructor() ERC721("ETHSafari 2026 Ticket", "EST26") Ownable(msg.sender) {}

    function mintTicket(string memory username) external payable {
        require(msg.value >= TICKET_PRICE, "Insufficient payment");
        require(bytes(username).length > 0, "Username required");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);

        tickets[tokenId] = Ticket({
            tokenId: tokenId,
            owner: msg.sender,
            username: username,
            mintedAt: block.timestamp
        });

        userTickets[msg.sender].push(tokenId);

        emit TicketMinted(tokenId, msg.sender, username);

        // Refund excess payment
        if (msg.value > TICKET_PRICE) {
            payable(msg.sender).transfer(msg.value - TICKET_PRICE);
        }
    }

    function getUserTickets(address user) external view returns (Ticket[] memory) {
        uint256[] memory tokenIds = userTickets[user];
        Ticket[] memory result = new Ticket[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            result[i] = tickets[tokenIds[i]];
        }

        return result;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}