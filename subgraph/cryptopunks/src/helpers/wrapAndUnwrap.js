"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnwrap = exports.createWrap = void 0;
var schema_1 = require("../../generated/schema");
function createWrap(id, fromAccount, nft, event) {
    var wrap = new schema_1.Wrap(event.transaction.hash
        .toHexString()
        .concat("-")
        .concat(event.logIndex.toString()));
    wrap.from = fromAccount.toHexString();
    wrap.type = "WRAP";
    wrap.timestamp = event.block.timestamp;
    wrap.nft = nft.toString();
    wrap.blockNumber = event.block.number;
    wrap.blockHash = event.block.hash;
    wrap.txHash = event.transaction.hash;
    wrap.save();
    return wrap;
}
exports.createWrap = createWrap;
function createUnwrap(fromAccount, toAccount, nft, event) {
    var unWrap = new schema_1.Unwrap(event.transaction.hash
        .toHexString()
        .concat("-")
        .concat(event.logIndex.toString()));
    unWrap.from = fromAccount.toHexString();
    unWrap.to = toAccount.toHexString();
    unWrap.type = "UNWRAP";
    unWrap.timestamp = event.block.timestamp;
    unWrap.nft = nft.toString();
    unWrap.blockNumber = event.block.number;
    unWrap.blockHash = event.block.hash;
    unWrap.txHash = event.transaction.hash;
    unWrap.save();
    return unWrap;
}
exports.createUnwrap = createUnwrap;
