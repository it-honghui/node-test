"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAskRemoved = exports.createAskCreated = void 0;
var schema_1 = require("../../generated/schema");
function createAskCreated(punkIndex, event) {
    var askCreatedId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
    var askCreated = new schema_1.AskCreated(askCreatedId);
    askCreated.type = "ASK_CREATED";
    askCreated.nft = punkIndex.toString();
    askCreated.timestamp = event.block.timestamp;
    askCreated.blockNumber = event.block.number;
    askCreated.txHash = event.transaction.hash;
    askCreated.blockHash = event.block.hash;
    askCreated.contract = event.address.toHexString();
    askCreated.save();
    return askCreated;
}
exports.createAskCreated = createAskCreated;
function createAskRemoved(punkIndex, event) {
    var askRemovedId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
    var askRemoved = new schema_1.AskRemoved(askRemovedId);
    askRemoved.type = "ASK_REMOVED";
    askRemoved.nft = punkIndex.toString();
    askRemoved.timestamp = event.block.timestamp;
    askRemoved.blockNumber = event.block.number;
    askRemoved.txHash = event.transaction.hash;
    askRemoved.blockHash = event.block.hash;
    askRemoved.contract = event.address.toHexString();
    askRemoved.save();
    return askRemoved;
}
exports.createAskRemoved = createAskRemoved;
