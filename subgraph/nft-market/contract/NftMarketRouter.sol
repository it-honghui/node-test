// contracts/NftMarketRouter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "IERC721ReceiverUpgradeable.sol";
import "IERC721.sol";
import "NftMarket.sol";
import "NftMarketFactory.sol";

contract NftMarketRouter is IERC721ReceiverUpgradeable {
    address public immutable factory;

    constructor(address _factory) {
        factory = _factory;
    }

    event SellNft(address _collection, uint256 _tokenId, address seller, uint256 _price);
    event PriceChange(address _collection, uint256 _tokenId, address seller, uint256 _newPrice);
    event Cancel(address _collection, uint256 _tokenId, address seller);
    event BuyNft(address _collection, uint256 _tokenId, address seller, address buyer, uint256 _price);

    function sellItem(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) external {
        require(_price > 0, "Router:price wrong");
        address _pair = NftMarketFactory(factory).getPair(_collection);
        require(_pair != address(0), "Router:collection market not exist");
        IERC721(_collection).safeTransferFrom(msg.sender, address(this), _tokenId);
        IERC721(_collection).transferFrom(address(this), _pair, _tokenId);
        NftMarket(_pair).sellItemByRouter(msg.sender, _tokenId, _price);
        emit SellNft(_collection, _tokenId, msg.sender, _price);
    }

    function buyItem(address _collection, uint256 _tokenId) external payable {
        address _pair = NftMarketFactory(factory).getPair(_collection);
        require(_pair != address(0), "Router:collection market not exist");
        NftMarket nftMarket = NftMarket(_pair);

        require(nftMarket.getOrder(_tokenId).price == msg.value, "Router: value is wrong");
        address seller = nftMarket.buyItemByRouter{value: msg.value}(msg.sender, _tokenId);
        emit BuyNft(_collection, _tokenId, seller, msg.sender, msg.value);
    }

    function cancelItem(address _collection, uint256 _tokenId) external {
        address _pair = NftMarketFactory(factory).getPair(_collection);
        require(_pair != address(0), "Router:collection market not exist");
        NftMarket nftMarket = NftMarket(_pair);
        require(nftMarket.getOwner(_tokenId) == msg.sender, "Router:not owner");
        nftMarket.cancelItemByRouter(_tokenId);
        emit Cancel(_collection, _tokenId, msg.sender);
    }

    function changePrice(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) external {
        require(_price > 0, "Router:price wrong");
        address _pair = NftMarketFactory(factory).getPair(_collection);
        require(_pair != address(0), "Router:collection market not exist");
        NftMarket nftMarket = NftMarket(_pair);
        require(nftMarket.getOwner(_tokenId) == msg.sender, "Router:not owner");
        nftMarket.changePriceByRouter(_tokenId, _price);
        emit PriceChange(_collection, _tokenId, msg.sender, _price);
    }

    function getOrderPage(
        address _collection,
        uint256 pageIdx,
        uint256 pageSize
    ) public view returns (NftMarket.TokenMeta[] memory) {
        address _pair = NftMarketFactory(factory).getPair(_collection);
        NftMarket nftMarket = NftMarket(_pair);
        return nftMarket.getOrderPage(pageIdx, pageSize);
    }

    function bulkGetOrders(
        address _collection,
        uint256 startIdx,
        uint256 endIdx
    ) public view returns (NftMarket.TokenMeta[] memory ret) {
        address _pair = NftMarketFactory(factory).getPair(_collection);
        NftMarket nftMarket = NftMarket(_pair);
        return nftMarket.bulkGetOrders(startIdx, endIdx);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
