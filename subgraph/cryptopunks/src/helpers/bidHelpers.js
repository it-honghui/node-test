"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBidRemoved = exports.createBidCreated = exports.getOrCreateBid = void 0;
var schema_1 = require("../../generated/schema");
function getOrCreateBid(fromAddress, punkIndex, event) {
    var bidId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
    var currentBid = punkIndex.currentBid;
    if (currentBid !== null) {
        var oldBid = schema_1.Bid.load(currentBid);
        oldBid.open = false;
        oldBid.save();
    }
    var bid = new schema_1.Bid(bidId);
    bid.nft = punkIndex.id;
    bid.from = fromAddress;
    bid.offerType = "BID";
    bid.save();
    return bid;
}
exports.getOrCreateBid = getOrCreateBid;
function createBidCreated(punkIndex, fromAddress, event) {
    var bidCreated = new schema_1.BidCreated(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    bidCreated.type = "BID_CREATED";
    bidCreated.nft = punkIndex.toString();
    bidCreated.from = fromAddress;
    bidCreated.timestamp = event.block.timestamp;
    bidCreated.blockNumber = event.block.number;
    bidCreated.txHash = event.transaction.hash;
    bidCreated.blockHash = event.block.hash;
    bidCreated.contract = event.address.toHexString();
    bidCreated.save();
    return bidCreated;
}
exports.createBidCreated = createBidCreated;
function createBidRemoved(punkIndex, fromAddress, event) {
    var bidRemoved = new schema_1.BidRemoved(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    bidRemoved.from = fromAddress;
    bidRemoved.contract = event.address.toHexString();
    bidRemoved.nft = punkIndex.toString();
    bidRemoved.timestamp = event.block.timestamp;
    bidRemoved.blockNumber = event.block.number;
    bidRemoved.txHash = event.transaction.hash;
    bidRemoved.blockHash = event.block.hash;
    bidRemoved.type = "BID_REMOVED";
    bidRemoved.save();
    return bidRemoved;
}
exports.createBidRemoved = createBidRemoved;
