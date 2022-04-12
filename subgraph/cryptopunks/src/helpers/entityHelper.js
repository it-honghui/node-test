"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateTransfer = exports.getOrCreateSale = exports.createMetadata = exports.getOrCreateAssign = exports.getOrCreateAccount = void 0;
var graph_ts_1 = require("@graphprotocol/graph-ts");
var schema_1 = require("../../generated/schema");
var constant_1 = require("../constant");
function getOrCreateAccount(address) {
    var id = address.toHexString();
    var account = schema_1.Account.load(id);
    if (!account) {
        account = new schema_1.Account(id);
        account.numberOfPunksOwned = graph_ts_1.BigInt.fromI32(0);
        account.save();
    }
    return account;
}
exports.getOrCreateAccount = getOrCreateAccount;
function getOrCreateAssign(punkIndex, toAccount, punk, metadata, event) {
    var assign = schema_1.Assign.load(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    if (!assign) {
        assign = new schema_1.Assign(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    }
    assign.to = toAccount.toHexString();
    assign.nft = punkIndex.toString();
    assign.timestamp = event.block.timestamp;
    assign.contract = event.address.toHexString();
    assign.blockNumber = event.block.number;
    assign.txHash = event.transaction.hash;
    assign.blockHash = event.block.hash;
    punk.metadata = metadata.id;
    punk.assignedTo = toAccount.toHexString();
    punk.transferedTo = toAccount.toHexString();
    assign.type = "ASSIGN";
    assign.save();
    return assign;
}
exports.getOrCreateAssign = getOrCreateAssign;
function createMetadata(punkId) {
    var metadata = new schema_1.MetaData(punkId.toString());
    metadata.tokenURI = constant_1.TOKEN_URI.concat(punkId.toString());
    metadata.contractURI = constant_1.CONTRACT_URI;
    metadata.tokenId = punkId;
    metadata.punk = punkId.toString();
    metadata.contractURI = constant_1.CONTRACT_URI;
    metadata.imageURI = constant_1.IMAGE_URI.concat(punkId.toString()).concat(".png");
    metadata.traits = new Array();
    metadata.save();
    return metadata;
}
exports.createMetadata = createMetadata;
function getOrCreateSale(toAddress, fromAddress, punk, event) {
    var sale = schema_1.Sale.load(event.transaction.hash.toHexString() + "-" + punk.toString());
    if (!sale) {
        sale = new schema_1.Sale(event.transaction.hash.toHexString() + "-" + punk.toString());
    }
    sale.to = toAddress.toHexString();
    sale.from = fromAddress.toHexString();
    sale.contract = event.address.toHexString();
    sale.nft = punk.toString();
    sale.timestamp = event.block.timestamp;
    sale.blockNumber = event.block.number;
    sale.txHash = event.transaction.hash;
    sale.blockHash = event.block.hash;
    sale.type = "SALE";
    sale.save();
    return sale;
}
exports.getOrCreateSale = getOrCreateSale;
function getOrCreateTransfer(fromAddress, toAddress, punk, event) {
    var transfer = schema_1.Transfer.load(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    if (!transfer) {
        transfer = new schema_1.Transfer(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
    }
    transfer.from = fromAddress.toHexString();
    transfer.to = toAddress.toHexString();
    transfer.contract = event.address.toHexString();
    transfer.nft = punk.toString();
    transfer.timestamp = event.block.timestamp;
    transfer.blockNumber = event.block.number;
    transfer.txHash = event.transaction.hash;
    transfer.blockHash = event.block.hash;
    transfer.type = "TRANSFER";
    transfer.save();
    return transfer;
}
exports.getOrCreateTransfer = getOrCreateTransfer;
