// contracts/NftMarket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "IERC721.sol";
import "ReentrancyGuard.sol";
import "SafeMath.sol";
import "IERC721ReceiverUpgradeable.sol";
import "TransferHelper.sol";

contract NftMarket is ReentrancyGuard, IERC721ReceiverUpgradeable {
    using SafeMath for uint256;

    address public factory;
    address public router;
    IERC721 public nft;
    address public feeMarketReceiver;
    uint256 public feeMarketNum;
    address public feeCreatorReceiver;
    uint256 public feeCreatorNum;
    // 10 min
    uint256 public updateInterval = 1;
    // tokenId -> owner
    mapping(uint256 => address) public tokenOwners;
    // tokenId -> order index
    TokenMeta[] public nftOrders;
    // nft orders
    mapping(uint256 => uint256) public nftOrderIndexs;

    struct TokenMeta {
        uint256 tokenId;
        uint256 price;
        uint256 sellTime;
        uint256 nextUpdateTime;
    }

    event SellNft(uint256 _tokenId, address seller, uint256 _price, uint256 _sellTime, uint256 _nextUpdateTime);
    event PriceChange(uint256 _tokenId, uint256 _oldPrice, uint256 _newPrice, uint256 _nextUpdateTime);
    event Cancel(uint256 _tokenId, address seller);
    event BuyNft(uint256 _tokenId, address seller, address buyer, uint256 _price, uint256 buyTime);

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(
        address _nft,
        address _feeMarketReceiver,
        uint256 _feeMarketNum,
        address _feeCreatorReceiver,
        uint256 _feeCreatorNum,
        address _router
    ) external {
        require(msg.sender == factory, "Fund: FORBIDDEN"); // sufficient check
        nft = IERC721(_nft);
        feeMarketReceiver = _feeMarketReceiver;
        feeMarketNum = _feeMarketNum;
        feeCreatorReceiver = _feeCreatorReceiver;
        feeCreatorNum = _feeCreatorNum;
        router = _router;
    }

    function sellItemByRouter(
        address seller,
        uint256 _tokenId,
        uint256 _price
    ) external {
        require(msg.sender == router, "only can call by router");
        tokenOwners[_tokenId] = seller;
        nftOrders.push(TokenMeta(_tokenId, _price, block.timestamp, block.timestamp + updateInterval));
        nftOrderIndexs[_tokenId] = nftOrders.length;
        emit SellNft(_tokenId, seller, _price, block.timestamp, block.timestamp + updateInterval);
    }

    function buyItemByRouter(address buyer, uint256 _tokenId) external payable returns (address) {
        require(msg.sender == router, "only can call by router");
        require(nftOrderIndexs[_tokenId] != 0, "order not exist");
        uint256 idx = nftOrderIndexs[_tokenId] - 1;
        TokenMeta memory order = nftOrders[idx];
        require(msg.value == order.price, "value not equal price");
        address seller = tokenOwners[_tokenId];
        uint256 feeMarket = feeMarketNum.mul(msg.value).div(1000);
        uint256 feeCreator = feeCreatorNum.mul(msg.value).div(1000);
        uint256 feeSeller = msg.value.sub(feeMarket).sub(feeCreator);

        TransferHelper.safeTransferETH(feeMarketReceiver, feeMarket);
        TransferHelper.safeTransferETH(feeCreatorReceiver, feeCreator);
        TransferHelper.safeTransferETH(seller, feeSeller);
        remove(idx);
        nftOrderIndexs[_tokenId] = 0;
        tokenOwners[_tokenId] = address(0);

        nft.safeTransferFrom(address(this), buyer, _tokenId);
        emit BuyNft(_tokenId, seller, buyer, msg.value, block.timestamp);
        return seller;
    }

    function cancelItemByRouter(uint256 _tokenId) external {
        require(msg.sender == router, "only can call by router");
        require(nftOrderIndexs[_tokenId] != 0, "order not exist");
        // require(tokenOwners[_tokenId] == _owner, "not owner");
        uint256 idx = nftOrderIndexs[_tokenId] - 1;
        TokenMeta memory order = nftOrders[idx];
        require(block.timestamp >= order.nextUpdateTime, "cannot cancel on current time");
        remove(idx);
        nft.safeTransferFrom(address(this), tokenOwners[_tokenId], _tokenId);
        nftOrderIndexs[_tokenId] = 0;
        tokenOwners[_tokenId] = address(0);
        emit Cancel(_tokenId, tokenOwners[_tokenId]);
    }

    function changePriceByRouter(uint256 _tokenId, uint256 _price) external {
        require(msg.sender == router, "only can call by router");
        require(_price > 0);
        // require(tokenOwners[_tokenId] == msg.sender, "not owner");
        require(nftOrderIndexs[_tokenId] != 0, "order not exist");
        uint256 idx = nftOrderIndexs[_tokenId] - 1;
        TokenMeta storage order = nftOrders[idx];
        require(block.timestamp >= order.nextUpdateTime, "cannot cancel on current time");
        require(order.tokenId == _tokenId, "order wrong");
        uint256 oldPrice = order.price;
        order.price = _price;
        order.nextUpdateTime = block.timestamp + updateInterval;
        emit PriceChange(_tokenId, oldPrice, _price, order.nextUpdateTime);
    }

    function remove(uint256 index) internal {
        if (index >= nftOrders.length) return;

        if (index != nftOrders.length - 1) {
            nftOrders[index] = nftOrders[nftOrders.length - 1];
            TokenMeta memory order = nftOrders[nftOrders.length - 1];
            nftOrderIndexs[order.tokenId] = index + 1;
        }

        delete nftOrders[nftOrders.length - 1];
        nftOrders.pop();
    }

    function getOwner(uint256 _tokenId) public view returns (address) {
        return tokenOwners[_tokenId];
    }

    function getOrder(uint256 _tokenId) public view returns (TokenMeta memory) {
        uint256 idx = nftOrderIndexs[_tokenId] - 1;
        return nftOrders[idx];
    }

    function getOrderPage(uint256 pageIdx, uint256 pageSize) public view returns (TokenMeta[] memory) {
        uint256 startIdx = pageIdx * pageSize;
        require(startIdx <= nftOrders.length, "Page number too high");
        uint256 pageEnd = startIdx + pageSize;
        uint256 endIdx = pageEnd <= nftOrders.length ? pageEnd : nftOrders.length;
        return bulkGetOrders(startIdx, endIdx);
    }

    function bulkGetOrders(uint256 startIdx, uint256 endIdx) public view returns (TokenMeta[] memory ret) {
        ret = new TokenMeta[](endIdx - startIdx);
        for (uint256 idx = startIdx; idx < endIdx; idx++) {
            ret[idx - startIdx] = nftOrders[idx];
        }
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // function sellItem(uint256 _tokenId, uint256 _price) external {
    //     require(_price > 0);
    //     nft.safeTransferFrom(msg.sender, address(this), _tokenId);
    //     tokenOwners[_tokenId] = msg.sender;
    //     nftOrders.push(TokenMeta(_tokenId, _price, block.timestamp, block.timestamp + updateInterval));
    //     nftOrderIndexs[_tokenId] = nftOrders.length;
    //     emit SellNft(_tokenId, msg.sender, _price, block.timestamp, block.timestamp + updateInterval);
    // }

    // function changePrice(uint256 _tokenId, uint256 _price) external {
    //     require(_price > 0);
    //     require(tokenOwners[_tokenId] == msg.sender, "not owner");
    //     require(nftOrderIndexs[_tokenId] != 0, "order not exist");
    //     uint256 idx = nftOrderIndexs[_tokenId] - 1;
    //     TokenMeta storage order = nftOrders[idx];
    //     require(block.timestamp >= order.nextUpdateTime, "cannot cancel on current time");
    //     require(order.tokenId == _tokenId, "order wrong");
    //     uint256 oldPrice = order.price;
    //     order.price = _price;
    //     order.nextUpdateTime = block.timestamp + updateInterval;
    //     emit PriceChange(_tokenId, oldPrice, _price, order.nextUpdateTime);
    // }

    // function cancelItem(uint256 _tokenId) external {
    //     require(tokenOwners[_tokenId] == msg.sender, "not owner");
    //     require(nftOrderIndexs[_tokenId] != 0, "order not exist");
    //     uint256 idx = nftOrderIndexs[_tokenId] - 1;
    //     TokenMeta memory order = nftOrders[idx];
    //     require(block.timestamp >= order.nextUpdateTime, "cannot cancel on current time");
    //     remove(idx);
    //     nft.safeTransferFrom(address(this), msg.sender, _tokenId);
    //     nftOrderIndexs[_tokenId] = 0;
    //     tokenOwners[_tokenId] = address(0);
    //     emit Cancel(_tokenId, msg.sender);
    // }

    // function buyItem(uint256 _tokenId) external payable {
    //     require(nftOrderIndexs[_tokenId] != 0, "order not exist");
    //     uint256 idx = nftOrderIndexs[_tokenId] - 1;
    //     TokenMeta memory order = nftOrders[idx];
    //     require(msg.value == order.price, "value not equal price");
    //     address seller = tokenOwners[_tokenId];
    //     uint256 feeMarket = feeMarketNum.mul(msg.value).div(1000);
    //     uint256 feeCreator = feeCreatorNum.mul(msg.value).div(1000);
    //     uint256 feeSeller = msg.value.sub(feeMarket).sub(feeCreator);

    //     TransferHelper.safeTransferETH(feeMarketReceiver, feeMarket);
    //     TransferHelper.safeTransferETH(feeCreatorReceiver, feeCreator);
    //     TransferHelper.safeTransferETH(seller, feeSeller);
    //     remove(idx);
    //     nftOrderIndexs[_tokenId] = 0;
    //     tokenOwners[_tokenId] = address(0);

    //     nft.safeTransferFrom(address(this), msg.sender, _tokenId);
    //     emit BuyNft(_tokenId, seller, msg.sender, msg.value, block.timestamp);
    // }
}
