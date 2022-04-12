"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_ts_1 = require("@graphprotocol/graph-ts");
var index_1 = require("matchstick-as/assembly/index");
var log_1 = require("matchstick-as/assembly/log");
var store_1 = require("matchstick-as/assembly/store");
var cryptopunks_1 = require("../../generated/cryptopunks/cryptopunks");
var WrappedPunks_1 = require("../../generated/WrappedPunks/WrappedPunks");
var mapping_1 = require("../../src/mapping");
var constant_1 = require("../../src/constant");
var OWNER1 = "0x6f4a2d3a4f47f9c647d86c929755593911ee0001";
var OWNER2 = "0xc36817163b7eaef25234e1d18adbfa52105a0002";
var OWNER3 = "0xb4cf0f5f2ffed445ca804898654366316d0a0003";
var PROXY2 = "0x674578060c0f07146bcc86d12b8a2efa1e810002";
var CRYPTOPUNKS_ADDRESS = graph_ts_1.Address.fromString("0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb");
index_1.createMockedFunction(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), "symbol", "symbol():(string)").returns([graph_ts_1.ethereum.Value.fromString("WPUNKS")]);
index_1.createMockedFunction(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), "name", "name():(string)").returns([graph_ts_1.ethereum.Value.fromString("Wrapped Cryptopunks")]);
index_1.createMockedFunction(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), "totalSupply", "totalSupply():(uint256)").returns([graph_ts_1.ethereum.Value.fromI32(1)]);
function createBlock(number) {
    var mockEvent = index_1.newMockEvent();
    var block = mockEvent.block;
    block.number = graph_ts_1.BigInt.fromI32(number);
    return block;
}
function createAssign(to, punkIndex) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("to", graph_ts_1.ethereum.Value.fromAddress(to)));
    parameters.push(new graph_ts_1.ethereum.EventParam("punkIndex", graph_ts_1.ethereum.Value.fromI32(punkIndex)));
    index_1.createMockedFunction(CRYPTOPUNKS_ADDRESS, "symbol", "symbol():(string)").returns([graph_ts_1.ethereum.Value.fromString("Ͼ")]);
    index_1.createMockedFunction(CRYPTOPUNKS_ADDRESS, "name", "name():(string)").returns([
        graph_ts_1.ethereum.Value.fromString("CryptoPunks"),
    ]);
    index_1.createMockedFunction(CRYPTOPUNKS_ADDRESS, "imageHash", "imageHash():(string)").returns([
        graph_ts_1.ethereum.Value.fromString("ac39af4793119ee46bbff351d8cb6b5f23da60222126add4268e261199a2921b"),
    ]);
    index_1.createMockedFunction(CRYPTOPUNKS_ADDRESS, "totalSupply", "totalSupply():(uint256)").returns([graph_ts_1.ethereum.Value.fromI32(1)]);
    var assignEvent = new cryptopunks_1.Assign(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(1), mockEvent.transaction, parameters);
    return assignEvent;
}
function createPunkTransferEvent(from, to, punkIndex, blockNumber) {
    if (blockNumber === void 0) { blockNumber = 1000; }
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("from", graph_ts_1.ethereum.Value.fromAddress(from)));
    parameters.push(new graph_ts_1.ethereum.EventParam("to", graph_ts_1.ethereum.Value.fromAddress(to)));
    parameters.push(new graph_ts_1.ethereum.EventParam("punkIndex", graph_ts_1.ethereum.Value.fromI32(punkIndex)));
    var transferEvent = new cryptopunks_1.PunkTransfer(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(blockNumber), mockEvent.transaction, parameters);
    return transferEvent;
}
function createWrappedPunkTransfer(from, to, tokenId, blockNumber) {
    if (blockNumber === void 0) { blockNumber = 2; }
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("from", graph_ts_1.ethereum.Value.fromAddress(from)));
    parameters.push(new graph_ts_1.ethereum.EventParam("to", graph_ts_1.ethereum.Value.fromAddress(to)));
    parameters.push(new graph_ts_1.ethereum.EventParam("tokenId", graph_ts_1.ethereum.Value.fromI32(tokenId)));
    var transferEvent = new WrappedPunks_1.Transfer(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(blockNumber), mockEvent.transaction, parameters);
    return transferEvent;
}
function createPunkNoLongerForSaleEvent(punkIndex) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("punkIndex", graph_ts_1.ethereum.Value.fromI32(punkIndex)));
    var PunkNoLongerForSaleEvent = new cryptopunks_1.PunkNoLongerForSale(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(3), mockEvent.transaction, parameters);
    return PunkNoLongerForSaleEvent;
}
function createPunkBidEntered(punkIndex, bid, bidder) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("punkIndex", graph_ts_1.ethereum.Value.fromI32(punkIndex)));
    parameters.push(new graph_ts_1.ethereum.EventParam("bid", graph_ts_1.ethereum.Value.fromI32(bid)));
    parameters.push(new graph_ts_1.ethereum.EventParam("bidder", graph_ts_1.ethereum.Value.fromAddress(bidder)));
    var PunkBidEnteredEvent = new cryptopunks_1.PunkBidEntered(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(4), mockEvent.transaction, parameters);
    return PunkBidEnteredEvent;
}
function createPunkOffered(punkIndex, offer, offeredBy) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("punkIndex", graph_ts_1.ethereum.Value.fromI32(punkIndex)));
    parameters.push(new graph_ts_1.ethereum.EventParam("offer", graph_ts_1.ethereum.Value.fromI32(offer)));
    parameters.push(new graph_ts_1.ethereum.EventParam("offeredBy", graph_ts_1.ethereum.Value.fromAddress(offeredBy)));
    var PunkOfferedEvent = new cryptopunks_1.PunkOffered(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(4), mockEvent.transaction, parameters);
    return PunkOfferedEvent;
}
function createProxyRegisteredEvent(user, proxy) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("user", graph_ts_1.ethereum.Value.fromAddress(user)));
    parameters.push(new graph_ts_1.ethereum.EventParam("proxy", graph_ts_1.ethereum.Value.fromAddress(proxy)));
    var proxyRegisteredEvent = new WrappedPunks_1.ProxyRegistered(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(3), mockEvent.transaction, parameters);
    return proxyRegisteredEvent;
}
function createPunkBoughtEvent(punk, value, seller, buyer) {
    var mockEvent = index_1.newMockEvent();
    var parameters = new Array();
    parameters.push(new graph_ts_1.ethereum.EventParam("punk", graph_ts_1.ethereum.Value.fromI32(punk)));
    parameters.push(new graph_ts_1.ethereum.EventParam("value", graph_ts_1.ethereum.Value.fromI32(value)));
    parameters.push(new graph_ts_1.ethereum.EventParam("seller", graph_ts_1.ethereum.Value.fromAddress(seller)));
    parameters.push(new graph_ts_1.ethereum.EventParam("buyer", graph_ts_1.ethereum.Value.fromAddress(buyer)));
    var punkBoughtEvent = new cryptopunks_1.PunkBought(CRYPTOPUNKS_ADDRESS, mockEvent.logIndex, mockEvent.transactionLogIndex, mockEvent.logType, createBlock(3), mockEvent.transaction, parameters);
    return punkBoughtEvent;
}
/////////////////////////////////////////////////////////////////////////////////////
//TEST ASSIGN
///////////////////////////////////////////
index_1.test("test handleAssign", function () {
    log_1.log.warning("test handleAssign", []);
    var assignEvent = createAssign(graph_ts_1.Address.fromString(OWNER1), 1);
    index_1.createMockedFunction(CRYPTOPUNKS_ADDRESS, "name", "name():(string)").returns([
        graph_ts_1.ethereum.Value.fromString("CryptoPunks"),
    ]);
    mapping_1.handleAssign(assignEvent);
    index_1.assert.fieldEquals("Account", OWNER1, "numberOfPunksOwned", "1");
    index_1.assert.fieldEquals("Contract", CRYPTOPUNKS_ADDRESS.toHexString(), "name", "CryptoPunks");
    index_1.assert.fieldEquals("MetaData", "1-1-METADATA", "punk", "1");
    index_1.assert.fieldEquals("Punk", "1", "metadata", "1-1-METADATA");
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "false");
});
///////////////////////////////////////////
//TEST PUNK TRANSFER
///////////////////////////////////////////
index_1.test("test Transfer", function () {
    var transferEvent = createPunkTransferEvent(graph_ts_1.Address.fromString(OWNER1), graph_ts_1.Address.fromString(OWNER2), 1, 1);
    mapping_1.handlePunkTransfer(transferEvent);
    index_1.assert.fieldEquals("Account", OWNER1, "numberOfPunksOwned", "0");
    index_1.assert.fieldEquals("Account", OWNER2, "numberOfPunksOwned", "1");
    // logStore();
});
///////////////////////////////////////////
//TEST WRAP
///////////////////////////////////////////
/**
 * Example: https://etherscan.io/tx/0x83f2c4b428b2ee5cf0c317fe72bb39716ca2e4d93597b3d80a8a2e60aa698d22
 * 1. registerProxy
 * 2. send Punk to Proxy
 * 3.1 transfer Punk from Proxy to wrapped punks
 * 3.2 transfer WrappedPunk from 0x0 to owner
 * Owner: 0xb4cf0f5f2ffed445ca804898654366316d0a779a
 * User Proxy: 0x674578060c0f07146BcC86D12B8a2efA1e819C38
 *
 */
index_1.test("testWrap", function () {
    index_1.assert.fieldEquals("Punk", "1", "owner", OWNER2);
    mapping_1.handleProxyRegistered(createProxyRegisteredEvent(graph_ts_1.Address.fromString(OWNER2), graph_ts_1.Address.fromString(PROXY2)));
    index_1.assert.fieldEquals("UserProxy", PROXY2, "user", OWNER2);
    mapping_1.handlePunkTransfer(createPunkTransferEvent(graph_ts_1.Address.fromString(OWNER2), graph_ts_1.Address.fromString(PROXY2), 1, 4));
    index_1.assert.fieldEquals("Account", OWNER2, "numberOfPunksOwned", "1");
    mapping_1.handlePunkTransfer(createPunkTransferEvent(graph_ts_1.Address.fromString(PROXY2), graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), 1, 5));
    // logStore();
    index_1.assert.fieldEquals("Account", OWNER2, "numberOfPunksOwned", "1");
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "true");
});
///////////////////////////////////////////
//WRAPPED TRANSFER
///////////////////////////////////////////
index_1.test("testWrappedTransfer", function () {
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "true");
    index_1.assert.fieldEquals("Punk", "1", "owner", OWNER2);
    mapping_1.handleWrappedPunkTransfer(createWrappedPunkTransfer(graph_ts_1.Address.fromString(OWNER2), graph_ts_1.Address.fromString(OWNER3), 1, 6));
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "true");
    index_1.assert.fieldEquals("Punk", "1", "owner", OWNER3);
    index_1.assert.fieldEquals("Account", OWNER2, "numberOfPunksOwned", "0");
    index_1.assert.fieldEquals("Account", OWNER3, "numberOfPunksOwned", "1");
    // logStore();
});
///////////////////////////////////////////
//TEST UNWRAP
///////////////////////////////////////////
index_1.test("testUnwrap", function () {
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "true");
    mapping_1.handlePunkTransfer(createPunkTransferEvent(graph_ts_1.Address.fromString(constant_1.WRAPPED_PUNK_ADDRESS), graph_ts_1.Address.fromString(OWNER3), 1, 5));
    index_1.assert.fieldEquals("Punk", "1", "wrapped", "false");
    index_1.assert.fieldEquals("Punk", "1", "owner", OWNER3);
    index_1.assert.fieldEquals("Account", OWNER3, "numberOfPunksOwned", "1");
    // logStore();
});
index_1.test("Test Sale ID", function () {
    log_1.log.warning("Test Sale ID", []);
    mapping_1.handlePunkBought(createPunkBoughtEvent(1, 100, graph_ts_1.Address.fromString(OWNER1), graph_ts_1.Address.fromString(OWNER2)));
    store_1.logStore();
});
///////////////////////////////////////////
//TEST PUNKOFFERED
///////////////////////////////////////////
// test("test PunkOffer", () => {
//   clearStore();
//   //Handle Assign creates the punks otherwise punkId will be null
//   handleAssign(createAssign(Address.fromString(ZERO_ADDRESS), 1));
//   handleAssign(createAssign(Address.fromString(OWNER1), 2));
//   handlePunkOffered(createPunkOffered(1, 1, Address.fromString(ZERO_ADDRESS)));
//   handlePunkOffered(createPunkOffered(2, 1, Address.fromString(OWNER1)));
//   handlePunkTransfer(
//     createPunkTransferEvent(
//       Address.fromString(WRAPPED_PUNK_ADDRESS),
//       Address.fromString(OWNER3),
//       1,
//       7
//     )
//   );
//   assert.fieldEquals("Punk", "1", "wrapped", "false");
//   assert.fieldEquals("Punk", "1", "owner", OWNER3);
//   assert.fieldEquals("Account", OWNER3, "numberOfPunksOwned", "1");
//   assert.fieldEquals("Punk", "2", "owner", OWNER1);
//   logStore();
// });
// test("test PunkNoLongerForSale", () => {
//   let PunkNoLongerForSaleEvent = createPunkNoLongerForSaleEvent(1);
//   handlePunkNoLongerForSale(PunkNoLongerForSaleEvent);
//   //assert.fieldEquals("AskCreated", "1-100-ASKCREATED", "nft", "1");
//   // logStore();
// });
// test("test PunkBidEntered", () => {
//   let PunkBidEnteredEvent = createPunkBidEntered(
//     1,
//     100000,
//     Address.fromString(OWNER1)
//   );
//   handlePunkBidEntered(PunkBidEnteredEvent);
//   assert.fieldEquals(
//     "BidRemoved",
//     "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1-BIDREMOVED",
//     "type",
//     "BID_REMOVED"
//   );
//   // logStore();
// });
