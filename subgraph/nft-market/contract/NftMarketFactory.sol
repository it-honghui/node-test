// contracts/NftMarketFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "Ownable.sol";
import "NftMarket.sol";

contract NftMarketFactory is Ownable {
    mapping(address => address) public getPair;
    address[] public allPairs;
    address public router;

    event marketCreated(address _nft, address pair, uint256);

    function createMarketPair(
        address _nft,
        address _feeMarketReceiver,
        uint256 _feeMarketNum,
        address _feeCreatorReceiver,
        uint256 _feeCreatorNum
    ) external onlyOwner returns (address pair) {
        require(getPair[_nft] == address(0), "PAIR_EXISTS");
        bytes memory bytecode = type(NftMarket).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_nft, address(this)));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        NftMarket(pair).initialize(_nft, _feeMarketReceiver, _feeMarketNum, _feeCreatorReceiver, _feeCreatorNum, router);
        getPair[_nft] = pair;
        allPairs.push(pair);
        emit marketCreated(_nft, pair, allPairs.length);
    }

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

}
